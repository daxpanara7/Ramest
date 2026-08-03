"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth-context";
import { useApi } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";

/**
 * The signed-in user's own account, from the auth context plus /users/:id.
 *
 * Email is read-only: UpdateUserDto has no email field, because changing a
 * sign-in identity needs a re-verification flow that does not exist yet. An
 * editable box that silently discards the change would be worse than a
 * locked one.
 */

type FullUser = {
  id: string; name: string; email: string;
  isActive: boolean; lastLoginAt: string | null; createdAt: string;
  roles: { role: { id: string; name: string } }[];
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi<FullUser>(
    user ? `/users/${user.id}` : null,
  );

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedOk, setSavedOk] = useState(false);

  useEffect(() => {
    if (data) setName(data.name);
  }, [data]);

  const dirty = !!data && name.trim() !== data.name && name.trim().length > 0;

  const save = async () => {
    if (!data) return;
    setSaving(true); setSaveError(null); setSavedOk(false);
    try {
      await api(`/users/${data.id}`, { method: "PATCH", body: { name: name.trim() } });
      setSavedOk(true);
      reload();
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const initials =
    (data?.name ?? user?.name ?? "")
      .split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "–";

  return (
    <Section>
      <PageHeader title="Profile" description="Your personal account settings." />

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <Button variant="ghost" size="sm" className="ml-auto h-7" onClick={reload}>Retry</Button>
        </div>
      )}

      <Card className="surface-glow overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/15 text-2xl text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {loading && !data ? (
              <>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="mt-2 h-4 w-64" />
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl tracking-tight">{data?.name ?? "—"}</h2>
                <p className="text-sm text-muted-foreground">{data?.email ?? "—"}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  {(data?.roles ?? []).map((r) => (
                    <Badge key={r.role.id} variant="secondary" className="capitalize">{r.role.name}</Badge>
                  ))}
                  <Badge variant="outline">{data?.isActive ? "Active" : "Suspended"}</Badge>
                  {data?.createdAt && (
                    <Badge variant="outline">
                      Joined {new Date(data.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 p-6">
            <h3 className="font-display text-lg">Details</h3>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} disabled={loading} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
              <Input value={data?.email ?? ""} disabled readOnly />
              <p className="text-xs text-muted-foreground">
                Changing your sign-in email needs a verification flow that is not built yet.
              </p>
            </div>

            {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}

            <div className="flex items-center justify-end gap-2">
              {savedOk && !dirty && (
                <span className="mr-auto flex items-center gap-1.5 text-sm text-emerald-600">
                  <Check className="h-4 w-4" /> Saved
                </span>
              )}
              <Button
                variant="outline" size="sm"
                onClick={() => { setName(data?.name ?? ""); setSavedOk(false); }}
                disabled={!dirty || saving}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={save} disabled={!dirty || saving}>
                {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <h3 className="font-display text-lg">Account</h3>
            <Row
              label="Last sign-in"
              value={data?.lastLoginAt ? relativeTime(data.lastLoginAt) : "—"}
              title={data?.lastLoginAt ? formatDateTime(data.lastLoginAt) : undefined}
            />
            <Row label="Account created" value={data?.createdAt ? formatDateTime(data.createdAt) : "—"} />
            <Row label="Status" value={data?.isActive ? "Active" : "Suspended"} />
            <Row label="Roles" value={(data?.roles ?? []).map((r) => r.role.name).join(", ") || "—"} />
            <Row label="Permissions" value={`${user?.permissions.length ?? 0} granted`} />
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function Row({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium capitalize" title={title}>{value}</span>
    </div>
  );
}
