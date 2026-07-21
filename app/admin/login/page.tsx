"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/admin/auth-context";
import { ApiError } from "@/lib/admin/api";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-auth-card">
        {/* Brand panel */}
        <aside className="admin-auth-brand">
          <Image
            className="admin-auth-logo"
            src="/assets/logo_final.webp"
            alt="Ramest Technolabs"
            width={687}
            height={267}
            priority
          />
          <div className="admin-auth-brand-body">
            <h1>
              Create. <span>Manage.</span> Grow.
            </h1>
            <p>
              One command center for your content, leads, and everything that keeps
              ramesttechnolabs.com moving forward.
            </p>
          </div>
          <div className="admin-auth-brand-foot">
            <strong>Ramest Technolabs</strong>
            <span>© 2026 · All rights reserved.</span>
          </div>
        </aside>

        {/* Form panel */}
        <div className="admin-auth-form">
          <h2>Welcome back</h2>
          <p className="admin-auth-sub">Enter your credentials to access the panel.</p>

          {error && (
            <div className="admin-alert" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <label className="admin-field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="username"
                placeholder="you@ramesttechnolabs.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="admin-field">
              <span>Password</span>
              <div className="admin-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </label>

            <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
