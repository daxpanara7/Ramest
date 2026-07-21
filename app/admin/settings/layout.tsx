"use client";

// Ported from _admin.settings.tsx — TanStack Outlet becomes a Next nested layout.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin/settings/general", label: "General" },
  { to: "/admin/settings/company", label: "Company" },
  { to: "/admin/settings/email", label: "Email" },
  { to: "/admin/settings/security", label: "Security" },
  { to: "/admin/settings/api", label: "API keys" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[26px] tracking-tight md:text-[30px]">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your workspace, security, and integrations.</p>
      </div>
      <nav className="flex flex-wrap gap-1 border-b border-border/60">
        {tabs.map((t) => {
          const active = pathname === t.to;
          return (
            <Link
              key={t.to}
              href={t.to}
              className={cn(
                "-mb-px inline-flex items-center border-b-2 px-3 py-2 text-sm transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
