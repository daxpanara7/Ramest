import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSign } from 'crypto';

/**
 * Google Search Console reader.
 *
 * Uses a service account (GOOGLE_SERVICE_ACCOUNT_JSON) rather than OAuth: no
 * refresh token to expire, and it works headlessly on Render. The account
 * must be added as a user on the Search Console property.
 *
 * The JWT is signed with node:crypto directly — googleapis pulls in a very
 * large dependency tree for what is three HTTP calls.
 *
 * IMPORTANT CAVEAT for every caller: Search Console reports *Google Search*
 * clicks and impressions. It is not total site traffic — it knows nothing
 * about direct, referral or social visits (that is GA4's job). It also lags
 * roughly 2 days, so "today" is always empty.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/webmasters/v3';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

export type GscRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscTotals = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type ServiceAccount = { client_email: string; private_key: string };

@Injectable()
export class SearchConsoleService {
  private readonly logger = new Logger(SearchConsoleService.name);
  private token: { value: string; expiresAt: number } | null = null;

  constructor(private readonly config: ConfigService) {}

  /** True once a service-account key and a site URL are configured. */
  get enabled(): boolean {
    return Boolean(this.credentials && this.siteUrl);
  }

  get siteUrl(): string {
    return (
      this.config.get<string>('SEARCH_CONSOLE_SITE_URL') ??
      'sc-domain:ramesttechnolabs.com'
    );
  }

  private get credentials(): ServiceAccount | null {
    const raw = this.config.get<string>('GOOGLE_SERVICE_ACCOUNT_JSON');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as ServiceAccount;
      if (!parsed.client_email || !parsed.private_key) return null;
      return parsed;
    } catch {
      this.logger.error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
      return null;
    }
  }

  /** Cached until 60s before expiry — tokens last an hour. */
  private async accessToken(): Promise<string | null> {
    const creds = this.credentials;
    if (!creds) return null;
    if (this.token && Date.now() < this.token.expiresAt) return this.token.value;

    const b64 = (o: unknown) =>
      Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const input =
      b64({ alg: 'RS256', typ: 'JWT' }) +
      '.' +
      b64({
        iss: creds.client_email,
        scope: SCOPE,
        aud: TOKEN_URL,
        iat: now,
        exp: now + 3600,
      });

    const signer = createSign('RSA-SHA256');
    signer.update(input);
    const assertion = `${input}.${signer.sign(creds.private_key, 'base64url')}`;

    try {
      const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
      if (!data.access_token) {
        this.logger.error(`Search Console token failed: ${data.error ?? 'unknown'}`);
        return null;
      }
      this.token = {
        value: data.access_token,
        expiresAt: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000,
      };
      return this.token.value;
    } catch (err) {
      this.logger.error(`Search Console token request failed: ${String(err)}`);
      return null;
    }
  }

  /** Raw searchAnalytics.query. Returns [] when unavailable — never throws. */
  async query(body: Record<string, unknown>): Promise<GscRow[]> {
    const token = await this.accessToken();
    if (!token) return [];

    try {
      const res = await fetch(
        `${API}/sites/${encodeURIComponent(this.siteUrl)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (!res.ok) {
        this.logger.warn(`Search Console query ${res.status}: ${await res.text()}`);
        return [];
      }
      const data = (await res.json()) as { rows?: GscRow[] };
      return data.rows ?? [];
    } catch (err) {
      this.logger.error(`Search Console query failed: ${String(err)}`);
      return [];
    }
  }

  /**
   * GSC has no data for the last ~2 days, so ranges end at day-2 rather than
   * today — otherwise every window silently loses its most recent points.
   */
  private range(daysBack: number, endOffset = 2) {
    const iso = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString().slice(0, 10);
    return { startDate: iso(daysBack + endOffset), endDate: iso(endOffset) };
  }

  /** Totals for a window plus the equally-sized window before it. */
  async totalsWithPrevious(days = 28): Promise<{
    current: GscTotals;
    previous: GscTotals;
    deltaPct: { clicks: number | null; impressions: number | null };
  }> {
    const cur = this.range(days);
    const prev = this.range(days, days + 2);

    const [a, b] = await Promise.all([
      this.query({ ...cur, rowLimit: 1 }),
      this.query({ ...prev, rowLimit: 1 }),
    ]);

    const totals = (rows: GscRow[]): GscTotals => ({
      clicks: rows[0]?.clicks ?? 0,
      impressions: rows[0]?.impressions ?? 0,
      ctr: rows[0]?.ctr ?? 0,
      position: rows[0]?.position ?? 0,
    });

    const current = totals(a);
    const previous = totals(b);
    // null rather than 0 when there is no baseline — "+100%" from zero is a
    // lie, and the UI needs to be able to say "no comparison yet".
    const pct = (now: number, before: number) =>
      before === 0 ? null : Math.round(((now - before) / before) * 1000) / 10;

    return {
      current,
      previous,
      deltaPct: {
        clicks: pct(current.clicks, previous.clicks),
        impressions: pct(current.impressions, previous.impressions),
      },
    };
  }

  /** Daily series for the trend chart. */
  async timeseries(days = 90): Promise<{ date: string; clicks: number; impressions: number; ctr: number; position: number }[]> {
    const rows = await this.query({ ...this.range(days), dimensions: ['date'], rowLimit: 500 });
    return rows.map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
      position: Math.round(r.position * 10) / 10,
    }));
  }

  /** Per-URL performance — powers the blog "Views" column. */
  async pages(days = 28, limit = 100) {
    const rows = await this.query({ ...this.range(days), dimensions: ['page'], rowLimit: limit });
    return rows.map((r) => ({
      url: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
      position: Math.round(r.position * 10) / 10,
    }));
  }

  /** Top queries — the raw material for AEO/LLMO question analysis. */
  async queries(days = 28, limit = 100) {
    const rows = await this.query({ ...this.range(days), dimensions: ['query'], rowLimit: limit });
    return rows.map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
      position: Math.round(r.position * 10) / 10,
    }));
  }

  /** Clicks by country — the real source for the Geographic dashboard. */
  async countries(days = 28, limit = 50) {
    const rows = await this.query({ ...this.range(days), dimensions: ['country'], rowLimit: limit });
    return rows.map((r) => ({
      country: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
      position: Math.round(r.position * 10) / 10,
    }));
  }

  /** Desktop / mobile / tablet split. */
  async devices(days = 28) {
    const rows = await this.query({ ...this.range(days), dimensions: ['device'], rowLimit: 10 });
    return rows.map((r) => ({
      device: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
    }));
  }
}
