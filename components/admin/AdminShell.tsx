"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/admin/auth-context";

const NAV: { href: string; label: string; icon: string; perm?: string }[] = [
  { href: "/admin", label: "Dashboard", icon: "fa-gauge-high", perm: "dashboard:read" },
  { href: "/admin/leads", label: "Leads", icon: "fa-inbox", perm: "lead:read" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper", perm: "blog:read" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "fa-envelope", perm: "newsletter:read" },
  { href: "/admin/media", label: "Media", icon: "fa-image", perm: "media:read" },
  { href: "/admin/users", label: "Users", icon: "fa-users", perm: "user:read" },
  { href: "/admin/roles", label: "Roles", icon: "fa-shield-halved", perm: "role:read" },
  { href: "/admin/activity", label: "Activity", icon: "fa-clock-rotate-left", perm: "audit:read" },
  { href: "/admin/seo", label: "SEO", icon: "fa-chart-line", perm: "seo:read" },
];

/** Wraps admin routes in the auth provider; login page renders bare. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ShellBody>{children}</ShellBody>
    </AuthProvider>
  );
}

function ShellBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLogin = pathname === "/admin/login";

  // Redirect unauthenticated users to login (except on the login page itself).
  useEffect(() => {
    if (!loading && !user && !isLogin) router.replace("/admin/login");
  }, [loading, user, isLogin, router]);

  if (isLogin) return <div className="admin-root">{children}</div>;

  if (loading || !user) {
    return (
      <div className="admin-root admin-center">
        <div className="admin-spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="admin-root admin-layout">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          <Image
            src="/assets/logo_final.webp"
            alt="Ramest Technolabs"
            width={687}
            height={267}
            priority
          />
        </Link>
        <span className="admin-logo-tag">Admin Panel</span>
        <nav className="admin-nav">
          {NAV.filter((n) => !n.perm || user.permissions.includes(n.perm)).map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`admin-nav-item${active ? " active" : ""}`}
              >
                <i className={`fa-solid ${n.icon}`} aria-hidden="true" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <AdminUserBox />
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

function AdminUserBox() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;
  return (
    <div className="admin-userbox">
      <div className="admin-userbox-info">
        <strong>{user.name}</strong>
        <span>{user.roles.join(", ")}</span>
      </div>
      <button
        type="button"
        className="admin-logout"
        onClick={async () => {
          await logout();
          router.replace("/admin/login");
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" /> Sign out
      </button>
    </div>
  );
}
