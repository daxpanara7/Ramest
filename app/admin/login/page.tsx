"use client";

// Contained two-column auth card: branded panel on the left, form on the right,
// sitting on a dark page with a warm radial glow. Card surfaces are deliberately
// darker than that glow so the panel reads as solid.
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/admin/auth-context";
import { ApiError } from "@/lib/admin/api";
import RecaptchaNotice from "@/components/RecaptchaNotice";

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
      {/* Soft blue glow behind the card (matches the marketing frontend) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(56,152,236,0.14),transparent_65%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-5">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border shadow-2xl shadow-[rgba(2,32,90,0.18)] md:grid-cols-2">
          {/* ---------- Left: brand (deep-navy panel, like the site capsule) ---------- */}
          <div className="flex flex-col justify-between gap-12 border-b border-border/60 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(56,152,236,0.22),transparent_55%),linear-gradient(160deg,#0B2E6B_0%,#00204F_100%)] p-9 md:border-b-0 md:border-r md:p-10">
            <Image
              src="/assets/logo_mark_light.webp"
              alt="Ramest Technolabs"
              width={528}
              height={206}
              priority
              className="h-16 w-auto self-start drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)] md:h-20"
            />

            <div>
              <h1 className="font-display text-[2.9rem] leading-[1.06] tracking-tight text-white">
                Create. <span className="text-[#9BD0FF]">Manage.</span>
                <br />
                Grow.
              </h1>
              <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-white/75">
                One command center for your content, leads, and everything that
                keeps ramesttechnolabs.com moving forward.
              </p>
            </div>

            <div className="text-xs leading-relaxed">
              <div className="font-medium text-white">Ramest Technolabs</div>
              <div className="text-white/65">© 2026 · All rights reserved.</div>
            </div>
          </div>

          {/* ---------- Right: form (white surface) ---------- */}
          <div className="flex flex-col justify-center bg-card p-9 md:p-12">
            <h2 className="font-display text-[2rem] leading-tight tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your credentials to access the panel.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-normal text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@ramesttechnolabs.com"
                  className="h-12 rounded-lg bg-secondary border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-normal text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-lg bg-secondary border-border pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg text-[15px] font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <RecaptchaNotice className="text-center text-[11px] leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-2" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
