"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/admin/auth-context";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AppHeader } from "@/components/admin/app-header";
import { Toaster } from "@/components/ui/sonner";

/**
 * Admin chrome: auth provider + route guard + the ported Lovable shell
 * (sidebar / header / content inset). The login page renders bare.
 */
export default function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChromeBody>{children}</ChromeBody>
    </AuthProvider>
  );
}

function ChromeBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLogin) router.replace("/admin/login");
  }, [loading, user, isLogin, router]);

  if (isLogin) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-background text-foreground">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
