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
      <form className="admin-login-card" onSubmit={onSubmit}>
        <Image
          className="admin-login-logo"
          src="/assets/logo_final.webp"
          alt="Ramest Technolabs"
          width={687}
          height={267}
          priority
        />
        <h1 className="admin-login-title">Admin Panel</h1>
        <p className="admin-login-sub">Sign in to manage content, leads, and settings.</p>

        {error && (
          <div className="admin-alert" role="alert">
            {error}
          </div>
        )}

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
