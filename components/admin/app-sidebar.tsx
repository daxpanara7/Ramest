"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderTree, Tag, Users2, Mail, Search,
  Globe, Sparkles, Image as ImageIcon, ShieldCheck, Settings, Activity,
  ScrollText, LogOut, Newspaper, BrainCircuit, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/admin/auth-context";

/**
 * Navigation shell, styled after Linear / Vercel / Supabase.
 *
 * The rhythm is deliberate rather than decorative:
 *   - 32px rows on a 4px grid — dense enough to see the whole app at once,
 *     which is the point of a console sidebar.
 *   - Active state is a tinted row plus a 3px left rail. Colour alone is a
 *     weak signal at 13px; the rail reads instantly at a glance.
 *   - Section labels are 10px/muted so they organise without competing with
 *     the items under them.
 *   - The brand header is 56px. The previous 86px block dominated the panel
 *     and pushed navigation below the fold.
 */

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type Group = { label: string; items: Item[] };

const single: Item[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
];

const groups: Group[] = [
  { label: "Content", items: [
    { title: "Blog", url: "/admin/blog", icon: Newspaper },
    { title: "Categories", url: "/admin/categories", icon: FolderTree },
    { title: "Tags", url: "/admin/tags", icon: Tag },
  ]},
  { label: "Leads", items: [
    { title: "Contact Leads", url: "/admin/leads", icon: Users2 },
    { title: "Newsletter", url: "/admin/newsletter", icon: Mail },
  ]},
  { label: "Search", items: [
    { title: "SEO Dashboard", url: "/admin/seo", icon: Search },
    // "GEO" split on purpose: geography here, Generative Engine Optimization
    // on the AI Search page. Same three letters, different data entirely.
    { title: "Geographic Reach", url: "/admin/geo", icon: Globe },
    { title: "AI Search", url: "/admin/ai-search", icon: BrainCircuit },
    { title: "AEO Dashboard", url: "/admin/aeo", icon: Sparkles },
  ]},
  { label: "Media", items: [
    { title: "Media Library", url: "/admin/media", icon: ImageIcon },
  ]},
  { label: "Team", items: [
    { title: "Users", url: "/admin/users", icon: Users2 },
    { title: "Roles", url: "/admin/roles", icon: ShieldCheck },
  ]},
  { label: "Settings", items: [
    { title: "General", url: "/admin/settings/general", icon: Settings },
    { title: "Company", url: "/admin/settings/company", icon: Settings },
    { title: "Email", url: "/admin/settings/email", icon: Mail },
    { title: "Security", url: "/admin/settings/security", icon: ShieldCheck },
  ]},
  { label: "Logs", items: [
    { title: "Activity Logs", url: "/admin/logs/activity", icon: Activity },
    { title: "Audit Logs", url: "/admin/logs/audit", icon: ScrollText },
  ]},
];

function initialsOf(name: string) {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

/** One row. Shared by the standalone item and every group item. */
function NavRow({
  item, active, collapsed,
}: { item: Item; active: boolean; collapsed: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.title}
        className={cn(
          "group/row relative h-8 gap-2.5 rounded-md px-2 text-[13px] font-normal",
          "text-sidebar-foreground/70 transition-colors duration-150",
          "hover:bg-sidebar-accent/55 hover:text-sidebar-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium",
          "data-[active=true]:text-sidebar-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        <Link href={item.url}>
          {/* 3px rail — the primary active cue; colour alone is too weak at 13px */}
          {active && !collapsed && (
            <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <item.icon
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              active ? "text-primary" : "text-sidebar-foreground/45 group-hover/row:text-sidebar-foreground/70",
            )}
          />
          <span className="truncate">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* ---------------------------------------------------------- brand */}
      <SidebarHeader
        className={cn(
          "h-14 justify-center border-b border-sidebar-border",
          collapsed ? "items-center px-0" : "px-3",
        )}
      >
        <Link
          href="/admin/dashboard"
          aria-label="Ramest Technolabs admin — dashboard"
          className={cn(
            "flex items-center gap-2.5 rounded-md outline-none transition-opacity hover:opacity-80",
            "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            collapsed && "justify-center",
          )}
        >
          <Image
            src="/assets/logo-mark.png"
            alt=""
            width={512}
            height={512}
            priority
            className="h-7 w-7 shrink-0 rounded-[7px] object-contain shadow-sm ring-1 ring-black/5"
          />
          {!collapsed && (
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground">
                Ramest
              </span>
              <span className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-sidebar-foreground/40">
                Console
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* ------------------------------------------------------------ nav */}
      <SidebarContent className="gap-0 px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {single.map((item) => (
                <NavRow key={item.url} item={item} active={isActive(item.url)} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {groups.map((g) => (
          <SidebarGroup key={g.label} className="mt-4 p-0 first:mt-0">
            {!collapsed && (
              <SidebarGroupLabel className="h-auto px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-sidebar-foreground/35">
                {g.label}
              </SidebarGroupLabel>
            )}
            {/* Collapsed: a hairline keeps the groups legible without labels */}
            {collapsed && <div className="mx-auto mb-2 h-px w-5 bg-sidebar-border" />}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {g.items.map((item) => (
                  <NavRow key={item.url} item={item} active={isActive(item.url)} collapsed={collapsed} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* --------------------------------------------------------- footer */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        {collapsed ? (
          <SidebarMenu className="gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={user?.name ?? "Profile"} className="h-8 justify-center px-0">
                <Link href="/admin/profile">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                      {user ? initialsOf(user.name) : "–"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Log out"
                className="h-8 justify-center px-0 text-sidebar-foreground/60 hover:text-destructive"
                onClick={async () => { await logout(); router.replace("/admin/login"); }}
              >
                <LogOut className="h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="rounded-lg border border-sidebar-border/70 bg-sidebar-accent/40 p-1.5">
            <Link
              href="/admin/profile"
              className="group/user flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors hover:bg-sidebar-accent"
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                  {user ? initialsOf(user.name) : "–"}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-[12.5px] font-medium text-sidebar-foreground">
                  {user?.name ?? "—"}
                </span>
                <span className="truncate text-[10.5px] capitalize text-sidebar-foreground/45">
                  {user?.roles.join(", ") || "—"}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/30 transition-transform group-hover/user:translate-x-0.5" />
            </Link>

            <button
              type="button"
              onClick={async () => { await logout(); router.replace("/admin/login"); }}
              className="mt-0.5 flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-[12.5px] text-sidebar-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
