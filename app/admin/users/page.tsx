"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle, Loader2, MoreHorizontal, RefreshCw, Search, Trash2, UserPlus,
} from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userStatusBadge } from "@/components/admin/badges";
import { api, ApiError } from "@/lib/admin/api";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";
import { useConfirm } from "@/components/admin/use-confirm";

/**
 * Original layout, live over /api/users.
 *
 * "Status" maps the API's boolean isActive onto the designed
 * Active/Suspended badge. There is no Invited state server-side: creating a
 * user requires a password, so accounts are active from the moment they exist.
 */

type Role = { id: string; name: string };
type User = {
  id: string; name: string; email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roles: { role: Role }[];
};
type UserList = { items: User[]; total: number };
type RoleList = { items: Role[] };

const PAGE_SIZE = 25;

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(q); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const path = `/users${qs({
    search: debouncedQ || undefined,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  })}`;

  const { data, loading, error, reload } = useApi<UserList>(path);
  const { data: roles } = useApi<RoleList>("/roles");

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Section>
      <PageHeader
        title="Users"
        description={
          loading && !data
            ? "Loading…"
            : `${total} ${total === 1 ? "person has" : "people have"} access to this workspace.`
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Invite user
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

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-border/60 p-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="h-9 pl-8" />
          </div>
          <p className="ml-auto text-xs text-muted-foreground">
            {loading ? "Loading…" : `${total} user${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && rows.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-9 w-full" /></TableCell></TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  {debouncedQ ? "No users match that search." : "No users yet."}
                </TableCell>
              </TableRow>
            ) : rows.map((u) => (
              <UserRow key={u.id} user={u} onEdit={() => setEditing(u)} onChanged={reload} />
            ))}
          </TableBody>
        </Table>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
            <span>Showing {rows.length} of {total}</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
                disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
                disabled={page >= pages - 1 || loading} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <UserDialog
        open={creating} user={null} roles={roles?.items ?? []}
        onClose={() => setCreating(false)}
        onSaved={() => { setCreating(false); reload(); }}
      />
      <UserDialog
        open={!!editing} user={editing} roles={roles?.items ?? []}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); reload(); }}
      />
    </Section>
  );
}

function UserRow({ user, onEdit, onChanged }: { user: User; onEdit: () => void; onChanged: () => void }) {
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  const toggleActive = async () => {
    setBusy(true);
    try {
      await api(`/users/${user.id}`, { method: "PATCH", body: { isActive: !user.isActive } });
      onChanged();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not update user.");
    } finally { setBusy(false); }
  };

  const remove = async () => {
    const yes = await confirm({
      title: `Delete ${user.name}?`,
      description: `${user.email} will lose access immediately. This cannot be undone.`,
    });
    if (!yes) return;
    setBusy(true);
    try {
      await api(`/users/${user.id}`, { method: "DELETE" });
      onChanged();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not delete user.");
      setBusy(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
              {user.name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium">{user.name}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {user.roles.length === 0
            ? <span className="text-muted-foreground">—</span>
            : user.roles.map((r) => (
                <Badge key={r.role.id} variant="outline" className="text-[10.5px] capitalize">{r.role.name}</Badge>
              ))}
        </div>
      </TableCell>
      <TableCell>{userStatusBadge(user.isActive ? "Active" : "Suspended")}</TableCell>
      <TableCell className="text-muted-foreground" title={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : ""}>
        {user.lastLoginAt ? relativeTime(user.lastLoginAt) : "Never"}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7" disabled={busy} aria-label={`Actions for ${user.name}`}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onEdit}>Edit user</DropdownMenuItem>
            <DropdownMenuItem onClick={toggleActive}>
              {user.isActive ? "Suspend" : "Reactivate"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={remove} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function UserDialog({
  open, user, roles, onClose, onSaved,
}: {
  open: boolean; user: User | null; roles: Role[];
  onClose: () => void; onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPassword("");
    setRoleIds(user?.roles.map((r) => r.role.id) ?? []);
    setErr(null);
  }, [open, user]);

  const submit = async () => {
    if (!name.trim()) { setErr("Name is required."); return; }
    if (!user && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("A valid email is required."); return; }
    if (!user && password.length < 8) { setErr("Password must be at least 8 characters."); return; }

    setBusy(true); setErr(null);
    try {
      if (user) {
        // Email is immutable server-side — UpdateUserDto has no email field.
        await api(`/users/${user.id}`, { method: "PATCH", body: { name: name.trim(), roleIds } });
      } else {
        await api("/users", { method: "POST", body: { name: name.trim(), email: email.trim(), password, roleIds } });
      }
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not save.");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit user" : "Invite user"}</DialogTitle>
          <DialogDescription>
            {user ? "Change the name and assigned roles." : "Creates an active account with the password you set."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="Jane Doe" />
          </Field>
          <Field label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" maxLength={200}
              disabled={!!user} placeholder="jane@ramesttechnolabs.com" />
          </Field>
          {!user && (
            <Field label="Password (min 8 characters)">
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" maxLength={200} />
            </Field>
          )}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Roles</span>
            <div className="space-y-2 rounded-lg border border-border/60 p-3">
              {roles.length === 0 ? (
                <p className="text-xs text-muted-foreground">No roles defined yet.</p>
              ) : roles.map((r) => (
                <label key={r.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={roleIds.includes(r.id)}
                    onCheckedChange={(v) =>
                      setRoleIds((s) => (v ? [...s, r.id] : s.filter((x) => x !== r.id)))
                    }
                  />
                  <span className="capitalize">{r.name}</span>
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
            {user ? "Save changes" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
