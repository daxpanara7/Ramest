import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const cls = "text-[10.5px] font-medium border-transparent";

export function statusBadge(status: "Published" | "Draft" | "Scheduled") {
  const map = {
    Published: "bg-emerald-500/12 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
    Draft: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
    Scheduled: "bg-amber-500/12 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  } as const;
  return <Badge className={cn(cls, map[status])}>{status}</Badge>;
}

export function leadStatusBadge(status: "New" | "Contacted" | "Qualified" | "Won" | "Lost") {
  const map = {
    New: "bg-primary/12 text-primary ring-1 ring-inset ring-primary/25",
    Contacted: "bg-sky-500/12 text-sky-400 ring-1 ring-inset ring-sky-500/20",
    Qualified: "bg-amber-500/12 text-amber-400 ring-1 ring-inset ring-amber-500/20",
    Won: "bg-emerald-500/12 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
    Lost: "bg-destructive/12 text-destructive ring-1 ring-inset ring-destructive/25",
  } as const;
  return <Badge className={cn(cls, map[status])}>{status}</Badge>;
}

export function userStatusBadge(status: "Active" | "Invited" | "Suspended") {
  const map = {
    Active: "bg-emerald-500/12 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
    Invited: "bg-sky-500/12 text-sky-400 ring-1 ring-inset ring-sky-500/20",
    Suspended: "bg-destructive/12 text-destructive ring-1 ring-inset ring-destructive/25",
  } as const;
  return <Badge className={cn(cls, map[status])}>{status}</Badge>;
}

/**
 * Lead status straight from the API's Prisma enum (UPPERCASE, and including
 * SPAM, which the legacy Title-case helper above has no entry for).
 */
export function apiLeadStatusBadge(status: string) {
  const map: Record<string, string> = {
    NEW: "bg-primary/12 text-primary ring-1 ring-inset ring-primary/25",
    CONTACTED: "bg-sky-500/12 text-sky-600 ring-1 ring-inset ring-sky-500/20",
    QUALIFIED: "bg-amber-500/12 text-amber-600 ring-1 ring-inset ring-amber-500/20",
    WON: "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/20",
    LOST: "bg-destructive/12 text-destructive ring-1 ring-inset ring-destructive/25",
    SPAM: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
  };
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <Badge className={cn(cls, map[status] ?? map.NEW)}>{label}</Badge>;
}

/** Newsletter subscriber status: PENDING | ACTIVE | UNSUBSCRIBED. */
export function subscriberStatusBadge(status: string) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/20",
    PENDING: "bg-amber-500/12 text-amber-600 ring-1 ring-inset ring-amber-500/20",
    UNSUBSCRIBED: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
  };
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <Badge className={cn(cls, map[status] ?? map.PENDING)}>{label}</Badge>;
}

/** Blog post status from the API enum: DRAFT | SCHEDULED | PUBLISHED | ARCHIVED. */
export function postStatusBadge(status: string) {
  const map: Record<string, string> = {
    PUBLISHED: "bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/20",
    DRAFT: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
    SCHEDULED: "bg-amber-500/12 text-amber-600 ring-1 ring-inset ring-amber-500/20",
    ARCHIVED: "bg-destructive/12 text-destructive ring-1 ring-inset ring-destructive/25",
  };
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <Badge className={cn(cls, map[status] ?? map.DRAFT)}>{label}</Badge>;
}
