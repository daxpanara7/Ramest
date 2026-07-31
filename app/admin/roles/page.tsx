"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { api, ApiError } from "@/lib/admin/api";
import { useApi } from "@/lib/admin/use-api";

/**
 * Original layout — role cards above a permissions matrix — now live over
 * /api/roles and /api/permissions.
 *
 * The matrix is editable and writes through: ticking a box PATCHes that
 * role's full permissionKeys array, because UpdateRoleDto replaces the set
 * rather than accepting a delta.
 *
 * Permission rows are grouped by the prefix of their key (`blog:read` ->
 * "Blog"), which is how the seed data is already organised.
 */

type Permission = { id: string; key: string; label: string };
type Role = {
  id: string; name: string; description: string | null;
  permissions: { permission: Permission }[];
};
type RoleList = { items: Role[] };
type PermissionList = { items: Permission[] };
type UserList = { items: { roles: { role: { id: string } }[] }[]; total: number };

export default function RolesPage() {
  const { data: roleData, loading, error, reload } = useApi<RoleList>("/roles");
  const { data: permData } = useApi<PermissionList>("/permissions");
  const { data: users } = useApi<UserList>("/users?take=100");

  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const roles = roleData?.items ?? [];
  const permissions = permData?.items ?? [];

  // Real member counts, tallied from one /users fetch.
  const memberCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const u of users?.items ?? []) {
      for (const r of u.roles) counts.set(r.role.id, (counts.get(r.role.id) ?? 0) + 1);
    }
    return (id: string) => counts.get(id) ?? 0;
  }, [users]);

  const groups = useMemo(() => {
    const by = new Map<string, Permission[]>();
    for (const p of permissions) {
      const g = p.key.split(":")[0];
      by.set(g, [...(by.get(g) ?? []), p]);
    }
    return Array.from(by.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  const has = (role: Role, key: string) => role.permissions.some((p) => p.permission.key === key);

  const toggle = async (role: Role, key: string, next: boolean) => {
    const current = role.permissions.map((p) => p.permission.key);
    const permissionKeys = next ? [...current, key] : current.filter((k) => k !== key);
    setSaving(role.id);
    try {
      await api(`/roles/${role.id}`, { method: "PATCH", body: { permissionKeys } });
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not update role.");
    } finally { setSaving(null); }
  };

  return (
    <Section>
      <PageHeader
        title="Roles & Permissions"
        description="Fine-grained access control for your workspace."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Custom role
            </Button>
          </>
        }
      />

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <Button variant="ghost" size="sm" className="ml-auto h-7" onClick={reload}>Retry</Button>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {loading && roles.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px] rounded-xl" />)
          : roles.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base capitalize">{r.name}</CardTitle>
                    <div className="flex shrink-0 items-center gap-1">
                      <Badge variant="secondary" className="text-[10.5px]">{memberCount(r.id)} members</Badge>
                      <DeleteRole role={r} onDone={reload} />
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    {r.description || `${r.permissions.length} permissions granted.`}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions matrix</CardTitle>
          <CardDescription>Configure what each role can do — changes save immediately</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading && roles.length === 0 ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left">
                  <th className="px-4 py-2.5 font-medium">Capability</th>
                  {roles.map((r) => (
                    <th key={r.id} className="px-4 py-2.5 text-center font-medium capitalize">
                      {r.name}
                      {saving === r.id && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.flatMap(([group, perms]) => [
                  <tr key={group} className="bg-muted/10">
                    <td colSpan={roles.length + 1} className="px-4 py-2 text-[10.5px] uppercase tracking-widest text-muted-foreground">
                      {group}
                    </td>
                  </tr>,
                  ...perms.map((p) => (
                    <tr key={p.id} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-2.5">
                        {p.label}
                        <span className="ml-2 font-mono text-[10px] text-muted-foreground">{p.key}</span>
                      </td>
                      {roles.map((r) => (
                        <td key={r.id} className="px-4 py-2.5 text-center">
                          <Checkbox
                            checked={has(r, p.key)}
                            disabled={saving !== null}
                            onCheckedChange={(v) => toggle(r, p.key, !!v)}
                            aria-label={`${p.label} for ${r.name}`}
                          />
                        </td>
                      ))}
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <RoleDialog
        open={creating}
        permissions={permissions}
        onClose={() => setCreating(false)}
        onSaved={() => { setCreating(false); reload(); }}
      />
    </Section>
  );
}

function DeleteRole({ role, onDone }: { role: Role; onDone: () => void }) {
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete the "${role.name}" role? Users keep their accounts but lose these permissions.`)) return;
    setBusy(true);
    try {
      await api(`/roles/${role.id}`, { method: "DELETE" });
      onDone();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not delete role.");
      setBusy(false);
    }
  };

  return (
    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive"
      onClick={remove} disabled={busy} aria-label={`Delete ${role.name} role`}>
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}

function RoleDialog({
  open, permissions, onClose, onSaved,
}: { open: boolean; permissions: Permission[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keys, setKeys] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(""); setDescription(""); setKeys([]); setErr(null);
  }, [open]);

  const submit = async () => {
    if (!name.trim()) { setErr("Name is required."); return; }
    setBusy(true); setErr(null);
    try {
      await api("/roles", {
        method: "POST",
        body: { name: name.trim(), description: description.trim() || undefined, permissionKeys: keys },
      });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not create role.");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom role</DialogTitle>
          <DialogDescription>Pick the capabilities this role should grant.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="editor" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Description</span>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} maxLength={300} />
          </label>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Permissions</span>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-border/60 p-3">
              {permissions.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={keys.includes(p.key)}
                    onCheckedChange={(v) => setKeys((s) => (v ? [...s, p.key] : s.filter((k) => k !== p.key)))}
                  />
                  <span>{p.label}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">{p.key}</span>
                </label>
              ))}
            </div>
          </div>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={busy}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Create role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
