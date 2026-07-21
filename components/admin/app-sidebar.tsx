"use client";

// Ported from ramest-admin-hub (Vite/TanStack) to Next.js:
// Link/useRouterState -> next/link + usePathname, URLs prefixed with /admin,
// and the mock profile/logout wired to the real auth context.
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, FolderTree, Tag, Users2, Mail, Search,
  Globe, Sparkles, Image as ImageIcon, ShieldCheck, Settings, Activity,
  ScrollText, LogOut, Newspaper, Command,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/admin/auth-context";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type Group = { label: string; icon: React.ComponentType<{ className?: string }>; items: Item[] };

const single: Item[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
];

const groups: Group[] = [
  { label: "Content", icon: FileText, items: [
    { title: "Blog", url: "/admin/blog", icon: Newspaper },
    { title: "Categories", url: "/admin/categories", icon: FolderTree },
    { title: "Tags", url: "/admin/tags", icon: Tag },
  ]},
  { label: "Leads", icon: Users2, items: [
    { title: "Contact Leads", url: "/admin/leads", icon: Users2 },
    { title: "Newsletter", url: "/admin/newsletter", icon: Mail },
  ]},
  { label: "SEO", icon: Search, items: [
    { title: "SEO Dashboard", url: "/admin/seo", icon: Search },
    { title: "GEO Dashboard", url: "/admin/geo", icon: Globe },
    { title: "AEO Dashboard", url: "/admin/aeo", icon: Sparkles },
  ]},
  { label: "Media", icon: ImageIcon, items: [
    { title: "Media Library", url: "/admin/media", icon: ImageIcon },
  ]},
  { label: "Users", icon: Users2, items: [
    { title: "Users", url: "/admin/users", icon: Users2 },
    { title: "Roles", url: "/admin/roles", icon: ShieldCheck },
  ]},
  { label: "Settings", icon: Settings, items: [
    { title: "General", url: "/admin/settings/general", icon: Settings },
    { title: "Company", url: "/admin/settings/company", icon: Settings },
    { title: "Email", url: "/admin/settings/email", icon: Mail },
    { title: "Security", url: "/admin/settings/security", icon: ShieldCheck },
  ]},
  { label: "Logs", icon: ScrollText, items: [
    { title: "Activity Logs", url: "/admin/logs/activity", icon: Activity },
    { title: "Audit Logs", url: "/admin/logs/audit", icon: ScrollText },
  ]},
];

function initialsOf(name: string) {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [q, setQ] = useState("");

  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");
  const filter = (t: string) => !q || t.toLowerCase().includes(q.toLowerCase());

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        {/* Real brand mark. Collapsed rail is only ~48px wide, so the wide
            wordmark is swapped for the square icon rather than squashed. */}
        <Link
          href="/admin/dashboard"
          aria-label="Ramest Technolabs admin — dashboard"
          className="flex items-center gap-2.5 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          {collapsed ? (
            <Image
              src="/assets/logo-mark.png"
              alt=""
              width={512}
              height={512}
              priority
              className="h-8 w-8 shrink-0 rounded-lg object-contain"
            />
          ) : (
            <div className="flex min-w-0 flex-col gap-1.5">
              <Image
                src="/assets/logo_final.webp"
                alt="Ramest Technolabs"
                width={687}
                height={267}
                priority
                className="h-8 w-auto self-start"
              />
              <span className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Admin Console
              </span>
            </div>
          )}
        </Link>
        {!collapsed && (
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="h-8 bg-sidebar-accent/40 pl-8 pr-10 text-xs placeholder:text-muted-foreground/70 focus-visible:ring-1"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 flex h-5 -translate-y-1/2 items-center gap-0.5 rounded border border-sidebar-border bg-sidebar px-1 text-[10px] text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-1.5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {single.filter((i) => filter(i.title)).map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {groups.map((g) => {
          const items = g.items.filter((i) => filter(i.title) || filter(g.label));
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={g.label}>
              {!collapsed && (
                <SidebarGroupLabel className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/80">
                  {g.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/profile")} tooltip="Profile">
              <Link href="/admin/profile" className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                    {user ? initialsOf(user.name) : "–"}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("flex min-w-0 flex-col leading-tight", collapsed && "hidden")}>
                  <span className="truncate text-xs font-medium">{user?.name ?? "—"}</span>
                  <span className="truncate text-[10px] capitalize text-muted-foreground">
                    {user?.roles.join(", ") ?? ""}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="text-muted-foreground hover:text-foreground"
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
