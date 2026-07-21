"use client";

// Login for the admin console. Structure follows the ramest-admin-hub design
// (ambient split layout, glass form card) with two deliberate changes: the real
// brand logo replaces the "R" letter-tile placeholder, and the mock SSO
// buttons / "SOC 2" badge were dropped — nothing here is decoration that
// doesn't actually work.
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/admin/auth-context";
import { ApiError } from "@/lib/admin/api";

const PILLARS = [
  { k: "Role-based", v: "access control" },
  { k: "Argon2id", v: "password hashing" },
  { k: "Audited", v: "every action" },
];

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
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full bg-primary/25 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-52 -right-32 h-[520px] w-[520px] rounded-full bg-primary/12 blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_35%,var(--background)_88%)]" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-stretch gap-0 px-5 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        {/* ---------- Left: brand ---------- */}
        <section className="hidden flex-col justify-between py-14 pr-14 lg:flex">
          <Image
            src="/assets/logo_final.webp"
            alt="Ramest Technolabs"
            width={687}
            height={267}
            priority
            className="h-11 w-auto self-start"
          />

          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
              Admin Console
            </span>

            <h1 className="mt-7 font-display text-[3.4rem] leading-[0.98] tracking-tight">
              Run the show.
              <br />
              <span className="text-primary">Watch it grow.</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Every post, every lead, every metric — one console, all in flow.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-3">
              {PILLARS.map((p) => (
                <div
                  key={p.k}
                  className="rounded-xl border border-border/50 bg-card/40 px-3.5 py-3 backdrop-blur"
                >
                  <dt className="font-display text-[15px] leading-none text-foreground">{p.k}</dt>
                  <dd className="mt-1.5 text-[11px] leading-tight text-muted-foreground">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ramest Technolabs · Ahmedabad, India
          </p>
        </section>

        {/* ---------- Right: form ---------- */}
        <section className="flex items-center justify-center py-10 lg:py-14">
          <div className="w-full max-w-[26rem]">
            {/* Logo repeats on mobile, where the brand panel is hidden */}
            <Image
              src="/assets/logo_final.webp"
              alt="Ramest Technolabs"
              width={687}
              height={267}
              priority
              className="mb-8 h-10 w-auto lg:hidden"
            />

            <div className="rounded-2xl border border-border/60 bg-card/60 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
              <h2 className="font-display text-[1.7rem] leading-tight tracking-tight">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to pick up where you left off.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@ramesttechnolabs.com"
                      className="h-11 bg-background/60 pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 bg-background/60 pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="mt-2 h-11 w-full text-sm">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Authorised access only · every action is logged
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
