"use client";

// Ported from ramest-admin-hub (Vite/TanStack) to Next.js. The user menu and
// logout are wired to the real auth context; notifications stay on sample
// data until a notifications API exists.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Plus, Search, Sun, Moon, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/lib/mock-data";
import { useAuth } from "@/lib/admin/auth-context";

const CRUMBS: Record<string, string> = {
  dashboard: "Dashboard", blog: "Blog", categories: "Categories", tags: "Tags",
  leads: "Contact Leads", newsletter: "Newsletter", seo: "SEO", geo: "GEO", aeo: "AEO",
  media: "Media Library", users: "Users", roles: "Roles", settings: "Settings",
  general: "General", company: "Company", email: "Email", security: "Security",
  logs: "Logs", activity: "Activity Logs", audit: "Audit Logs", profile: "Profile",
  new: "New",
};

export function AppHeader() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { user, logout } = useAuth();
  // Drop the leading "admin" segment — it's the app root, not a crumb.
  const parts = pathname.split("/").filter(Boolean).slice(1);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    return () => document.documentElement.classList.remove("light");
  }, [dark]);

  const unread = notifications.filter((n) => n.unread).length;
  const firstName = user?.name.split(/\s+/)[0] ?? "";
  const initials = user
    ? user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "–";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-3 backdrop-blur-md md:px-5">
      <SidebarTrigger className="h-8 w-8" />
      <Separator orientation="vertical" className="mx-1 h-5" />

      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[13px] md:flex">
        <Link href="/admin/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
          Home
        </Link>
        {parts.map((p, i) => {
          const label = CRUMBS[p] ?? p;
          const last = i === parts.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className={last ? "truncate font-medium text-foreground" : "truncate text-muted-foreground"}>
                {label}
              </span>
            </span>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search anything…"
            className="h-8 w-64 bg-card/60 pl-8 pr-14 text-xs"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 flex h-5 -translate-y-1/2 items-center gap-0.5 rounded border bg-background px-1.5 text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/admin/blog/new">New blog post</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin/leads">Log a lead</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin/media">Upload media</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin/users">Invite user</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative h-8 w-8" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-3 py-2.5">
              <DropdownMenuLabel className="p-0 text-sm">Notifications</DropdownMenuLabel>
              <Badge variant="secondary" className="text-[10px]">{unread} new</Badge>
            </div>
            <div className="max-h-80 overflow-auto">
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-3 border-b px-3 py-2.5 last:border-0 hover:bg-accent/40">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-muted"}`} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">{n.at}</p>
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full border border-border/70 bg-card px-1 py-1 text-left transition-colors hover:bg-accent">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/15 text-[10px] text-primary">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden pr-2 text-xs font-medium md:inline">{firstName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/admin/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin/settings/general">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin/logs/activity">Activity</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
