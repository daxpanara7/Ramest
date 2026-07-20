"use client";

import { useCallback, useEffect, useState } from "react";
import { api, API_BASE, getAccessToken } from "@/lib/admin/api";
import { PageError } from "@/components/admin/status";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message: string;
  status: string;
  adminNotes?: string | null;
  country?: string | null;
  createdAt: string;
};

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST", "SPAM"];

export default function LeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      params.set("take", "50");
      const res = await api<{ items: Lead[]; total: number }>(`/leads?${params}`);
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <PageError message={error} />;

  return (
    <div>
      <header className="admin-page-head">
        <h1>Leads {total > 0 && <span className="admin-count">{total}</span>}</h1>
        <p>Enquiries from the website contact form.</p>
      </header>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Search name, email, company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <a
          className="admin-btn"
          href={`${API_BASE}/leads/export${status ? `?status=${status}` : ""}`}
          onClick={(e) => {
            // Export needs the bearer token; open via fetch->blob instead.
            e.preventDefault();
            downloadCsv(status);
          }}
        >
          <i className="fa-solid fa-download" aria-hidden="true" /> Export CSV
        </a>
      </div>

      {loading ? (
        <div className="admin-center" style={{ minHeight: "30vh" }}>
          <div className="admin-spinner" aria-label="Loading" />
        </div>
      ) : items.length === 0 ? (
        <p className="admin-muted">No leads match.</p>
      ) : (
        <div className="admin-card admin-card-flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Company</th>
                <th>Status</th>
                <th>Received</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.name}</strong>
                    <br />
                    <span className="admin-muted">{l.email}</span>
                  </td>
                  <td>{l.company || <span className="admin-muted">—</span>}</td>
                  <td>
                    <span className={`admin-badge status-${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="admin-muted">{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="admin-link-btn" onClick={() => setSelected(l)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onSaved,
}: {
  lead: Lead;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.adminNotes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api(`/leads/${lead.id}`, {
        method: "PATCH",
        body: { status, adminNotes: notes },
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="admin-drawer-head">
          <h2>{lead.name}</h2>
          <button className="admin-icon-btn" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>
        <dl className="admin-detail">
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </dd>
          {lead.phone && (
            <>
              <dt>Phone</dt>
              <dd>{lead.phone}</dd>
            </>
          )}
          {lead.company && (
            <>
              <dt>Company</dt>
              <dd>{lead.company}</dd>
            </>
          )}
          {lead.service && (
            <>
              <dt>Service</dt>
              <dd>{lead.service}</dd>
            </>
          )}
          <dt>Message</dt>
          <dd className="admin-message">{lead.message}</dd>
        </dl>

        <label className="admin-field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Internal notes</span>
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <div className="admin-drawer-actions">
          <button className="admin-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** CSV export with the auth header, via blob download. */
async function downloadCsv(status: string) {
  const res = await fetch(`${API_BASE}/leads/export${status ? `?status=${status}` : ""}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    credentials: "include",
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.csv";
  a.click();
  URL.revokeObjectURL(url);
}
