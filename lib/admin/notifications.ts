/**
 * Turns a raw ActivityLog row into something a human can read at a glance.
 *
 * The bell used to render the action key verbatim — "application.update",
 * "auth.login" — which tells you a machine did something but not which part of
 * the console it happened in, or to whom. Every event now resolves to a module
 * (the label used in the sidebar), a sentence, and a link to the page where
 * you would act on it.
 *
 * Shared by the header dropdown and the Activity Logs page so one event never
 * reads two different ways in two places.
 */

export type ActivityEvent = {
  id: string;
  action: string;
  entity: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  user: { name: string } | null;
};

/** Sidebar-matching module names, so the badge maps onto the navigation. */
export type NotificationModule =
  | "Job Applications"
  | "Contact Leads"
  | "Newsletter"
  | "Blog"
  | "Media Library"
  | "Users"
  | "Roles"
  | "Settings"
  | "Security";

export type Notification = {
  module: NotificationModule;
  /** What happened, in a sentence. */
  title: string;
  /** Who/what it concerns — candidate name, post title, etc. */
  detail: string;
  /** Where to go to act on it. */
  href: string;
  /**
   * `inbound` = something arrived from the public site and nobody has looked
   * at it yet. These are the only events that are genuinely "new work", so
   * the bell counts and highlights them separately from admin bookkeeping.
   */
  kind: "inbound" | "change" | "security";
};

type Rule = {
  module: NotificationModule;
  href: string;
  title: string;
  kind: Notification["kind"];
};

const RULES: Record<string, Rule> = {
  "application.created": {
    module: "Job Applications",
    href: "/admin/applications",
    title: "New job application received",
    kind: "inbound",
  },
  "application.update": {
    module: "Job Applications",
    href: "/admin/applications",
    title: "Application updated",
    kind: "change",
  },
  "application.delete": {
    module: "Job Applications",
    href: "/admin/applications",
    title: "Application deleted",
    kind: "change",
  },
  "lead.created": {
    module: "Contact Leads",
    href: "/admin/leads",
    title: "New contact enquiry received",
    kind: "inbound",
  },
  "lead.update": {
    module: "Contact Leads",
    href: "/admin/leads",
    title: "Lead updated",
    kind: "change",
  },
  "lead.delete": {
    module: "Contact Leads",
    href: "/admin/leads",
    title: "Lead deleted",
    kind: "change",
  },

  "newsletter.subscriber.import": {
    module: "Newsletter",
    href: "/admin/newsletter",
    title: "Subscribers imported",
    kind: "change",
  },
  "newsletter.subscriber.update": {
    module: "Newsletter",
    href: "/admin/newsletter",
    title: "Subscriber updated",
    kind: "change",
  },
  "newsletter.subscriber.delete": {
    module: "Newsletter",
    href: "/admin/newsletter",
    title: "Subscriber removed",
    kind: "change",
  },

  "post.create": { module: "Blog", href: "/admin/blog", title: "Post created", kind: "change" },
  "post.update": { module: "Blog", href: "/admin/blog", title: "Post updated", kind: "change" },
  "post.publish": { module: "Blog", href: "/admin/blog", title: "Post published", kind: "change" },
  "post.unpublish": { module: "Blog", href: "/admin/blog", title: "Post unpublished", kind: "change" },
  "post.delete": { module: "Blog", href: "/admin/blog", title: "Post deleted", kind: "change" },
  "category.create": { module: "Blog", href: "/admin/categories", title: "Category created", kind: "change" },
  "category.update": { module: "Blog", href: "/admin/categories", title: "Category updated", kind: "change" },
  "category.delete": { module: "Blog", href: "/admin/categories", title: "Category deleted", kind: "change" },
  "tag.create": { module: "Blog", href: "/admin/tags", title: "Tag created", kind: "change" },
  "tag.delete": { module: "Blog", href: "/admin/tags", title: "Tag deleted", kind: "change" },

  "media.upload": { module: "Media Library", href: "/admin/media", title: "Media uploaded", kind: "change" },
  "media.update": { module: "Media Library", href: "/admin/media", title: "Media updated", kind: "change" },
  "media.delete": { module: "Media Library", href: "/admin/media", title: "Media deleted", kind: "change" },

  "user.create": { module: "Users", href: "/admin/users", title: "User created", kind: "change" },
  "user.update": { module: "Users", href: "/admin/users", title: "User updated", kind: "change" },
  "user.delete": { module: "Users", href: "/admin/users", title: "User deleted", kind: "change" },
  "role.create": { module: "Roles", href: "/admin/roles", title: "Role created", kind: "change" },
  "role.update": { module: "Roles", href: "/admin/roles", title: "Role updated", kind: "change" },
  "role.delete": { module: "Roles", href: "/admin/roles", title: "Role deleted", kind: "change" },

  "setting.update": { module: "Settings", href: "/admin/settings/general", title: "Setting changed", kind: "change" },
  "setting.bulk_update": { module: "Settings", href: "/admin/settings/general", title: "Settings changed", kind: "change" },
  "setting.delete": { module: "Settings", href: "/admin/settings/general", title: "Setting removed", kind: "change" },

  "auth.login": { module: "Security", href: "/admin/logs/audit", title: "Signed in", kind: "security" },
  "auth.logout": { module: "Security", href: "/admin/logs/audit", title: "Signed out", kind: "security" },
  "auth.login.failed": {
    module: "Security",
    href: "/admin/logs/audit",
    title: "Failed sign-in attempt",
    kind: "security",
  },
};

/** Entity → module, so an action key we have not mapped still lands somewhere. */
const BY_ENTITY: Record<string, Rule> = {
  JobApplication: {
    module: "Job Applications",
    href: "/admin/applications",
    title: "Application activity",
    kind: "change",
  },
  ContactLead: { module: "Contact Leads", href: "/admin/leads", title: "Lead activity", kind: "change" },
  BlogPost: { module: "Blog", href: "/admin/blog", title: "Blog activity", kind: "change" },
  MediaAsset: { module: "Media Library", href: "/admin/media", title: "Media activity", kind: "change" },
  User: { module: "Users", href: "/admin/users", title: "User activity", kind: "change" },
  Role: { module: "Roles", href: "/admin/roles", title: "Role activity", kind: "change" },
};

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

/** The most identifying thing we can say about the subject of the event. */
function describe(event: ActivityEvent): string {
  const m = (event.metadata ?? {}) as Record<string, unknown>;
  const actor = event.user?.name ?? null;

  switch (event.action) {
    case "application.created": {
      const who = str(m.candidate) ?? "A candidate";
      const role = str(m.position);
      return role ? `${who} — ${role}` : who;
    }
    case "lead.created": {
      const who = str(m.name) ?? "Someone";
      const org = str(m.company);
      const svc = str(m.service);
      return [org ? `${who} (${org})` : who, svc].filter(Boolean).join(" — ");
    }
    case "application.update":
    case "lead.update": {
      const from = str(m.statusFrom);
      const to = str(m.statusTo);
      const move = from && to && from !== to ? `${title(from)} → ${title(to)}` : null;
      return [move, actor && `by ${actor}`].filter(Boolean).join(" · ") || actor || "Updated";
    }
    default:
      return [str(m.title) ?? str(m.name) ?? str(m.email), actor && `by ${actor}`]
        .filter(Boolean)
        .join(" · ") || actor || "System";
  }
}

const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

/** Resolves one activity row into a display-ready notification. */
export function toNotification(event: ActivityEvent): Notification {
  const rule =
    RULES[event.action] ??
    (event.entity ? BY_ENTITY[event.entity] : undefined) ?? {
      module: "Settings" as const,
      href: "/admin/logs/activity",
      // Last resort: a readable version of the raw key, never the key itself.
      title: event.action.replace(/[._]/g, " ").replace(/^./, (c) => c.toUpperCase()),
      kind: "change" as const,
    };

  return { ...rule, detail: describe(event) };
}
