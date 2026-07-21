"use client";

// Ported from ramest-admin-hub login. Wired to the real auth API. The mock
// Google/GitHub SSO buttons, "SOC 2" badge, and the inert "keep me signed in"
// checkbox were removed rather than shipped as non-functional decoration —
// everything shown here is true of this system.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight, Eye, EyeOff, Loader2, Mail, ShieldCheck, Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/admin/auth-context";
import { ApiError } from "@/lib/admin/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,var(--background)_85%)]" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left — brand panel */}
        <div className="hidden flex-col justify-between border-r border-border/50 p-10 lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <span className="font-display text-lg font-semibold">R</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-semibold">Ramest Technolabs</div>
              <div className="text-xs text-muted-foreground">Admin Console</div>
            </div>
          </div>

          <div className="max-w-md space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Internal console
            </div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight">
              Run the business,<br />
              <span className="text-primary">not the busywork.</span>
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              One command center for content, leads, SEO, and everything that
              keeps ramesttechnolabs.com moving — built for the Ramest team.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { k: "RBAC", v: "Access control" },
                { k: "Argon2", v: "Password hashing" },
                { k: "Audited", v: "Every action" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-border/50 bg-card/40 p-3 backdrop-blur">
                  <div className="font-display text-lg">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Secured with rotating JWT sessions
            </div>
            <div>© {new Date().getFullYear()} Ramest Technolabs</div>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <span className="font-display text-lg font-semibold">R</span>
              </div>
              <div className="font-display text-base font-semibold">Ramest Admin</div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <div className="mb-7">
                <h2 className="font-display text-2xl tracking-tight">Welcome back</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Sign in to your admin workspace to continue.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@ramesttechnolabs.com"
                      className="h-11 bg-background/50 pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 bg-background/50 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group h-11 w-full text-sm font-medium shadow-lg shadow-primary/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                    </>
                  ) : (
                    <>
                      Sign in to console
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Don't have access?{" "}
                <a href="mailto:hr@ramesttechnolabs.com" className="text-foreground underline-offset-4 hover:underline">
                  Ask an administrator
                </a>
              </p>
            </div>

            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              Authorized personnel only. Every sign-in is logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
