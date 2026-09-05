"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import {
  LockKeyhole,
  ShieldCheck,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";

type ViewMode = "login" | "forgotPassword";

export default function LoginPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const auth = getFirebaseAuth();

      await signInWithEmailAndPassword(auth, email, password);

      router.push("/dashboard");
    } catch (loginError: unknown) {
      if (
        typeof loginError === "object" &&
        loginError &&
        "message" in loginError
      ) {
        setError(String((loginError as { message: unknown }).message));
      } else {
        setError("Something went wrong while signing in.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email address is required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "Something went wrong while sending the reset email.",
        );
      }

      setSuccess(
        data.message ||
          "Password reset email sent! Check your inbox for further instructions.",
      );
    } catch (resetError: unknown) {
      if (
        typeof resetError === "object" &&
        resetError &&
        "message" in resetError
      ) {
        setError(String((resetError as { message: unknown }).message));
      } else {
        setError("Something went wrong while sending the reset email.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function switchToForgotPassword() {
    setViewMode("forgotPassword");
    setError("");
    setSuccess("");
    setPassword("");
  }

  function switchToLogin() {
    setViewMode("login");
    setError("");
    setSuccess("");
  }

  const isLoginMode = viewMode === "login";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden transition-colors duration-300 relative">
      {/* Page ambient background */}
      <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24 min-h-screen">
        <section className="grid w-full max-w-5xl gap-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] transition-colors duration-300">
          {/* Left column: info */}
          <div className="relative flex flex-col justify-between">
            <div>
              <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <LockKeyhole className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                  {isLoginMode ? "Account Login" : "Password Recovery"}
                </span>
              </div>
              <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
                {isLoginMode
                  ? "Access your investment dashboard."
                  : "Reset your account password."}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                {isLoginMode
                  ? "Sign in to monitor performance, review statements, manage funding, and update your preferences. For your security, please avoid logging in from shared or public devices."
                  : "Enter your registered email address and we will send you a secure link to reset your password. The link will expire after 1 hour for your protection."}
              </p>
              <div className="mt-10 space-y-4">
                {[
                  {
                    title: isLoginMode
                      ? "Multi-factor authentication available"
                      : "Secure one-time reset link",
                    icon: ShieldCheck,
                  },
                  {
                    title: isLoginMode
                      ? "Real-time portfolio analytics"
                      : "Email delivered within minutes",
                    icon: TrendingUp,
                  },
                  {
                    title: isLoginMode
                      ? "Secure advisory messaging"
                      : "No data shared with third parties",
                    icon: LockKeyhole,
                  },
                ].map((b) => (
                  <div key={b.title} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500" />
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <b.icon className="h-4 w-4 text-emerald-400" />
                      <span>{b.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
              {isLoginMode
                ? "Security notice: If you suspect unauthorized access, contact support immediately."
                : "Security notice: Never share your reset link with anyone. Our team will never ask for it."}
            </p>
          </div>

          {/* Right column: form */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/70 to-slate-900/60 backdrop-blur p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] transition-colors duration-300">
            {/* Decorative corner ring */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/25 via-teal-500/10 to-transparent blur-2xl opacity-70" />

            {isLoginMode ? (
              <>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label
                      htmlFor="login-email"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                    >
                      Email Address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500/40 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="login-password"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500/40 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-emerald-400 transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pt-1">
                    <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(event) =>
                          setRememberDevice(event.target.checked)
                        }
                        className="h-4 w-4 rounded border-white/10 bg-slate-950/50 text-emerald-500 focus:ring-0 focus:ring-offset-0 accent-emerald-500"
                      />
                      <span>Remember Device</span>
                    </label>
                    <button
                      type="button"
                      onClick={switchToForgotPassword}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-red-400 leading-relaxed">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 py-5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting ? "Processing..." : "Sign In to Dashboard"}
                  </button>
                </form>
                <div className="mt-8 border-t border-white/5 pt-6 text-center">
                  <p className="text-sm text-slate-500">
                    New to TeveXtra?{" "}
                    <Link
                      href="/register"
                      className="font-black text-emerald-400 hover:underline hover:text-emerald-300"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <form className="space-y-5" onSubmit={handleForgotPassword}>
                  <div className="space-y-2">
                    <label
                      htmlFor="reset-email"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                    >
                      Registered Email Address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500/40 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/25">
                        <svg
                          className="h-3 w-3 text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-400">
                        If an account exists with this email, you will receive a
                        password reset link. Please check your spam folder if
                        you do not see it within a few minutes.
                      </p>
                    </div>
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-red-400 leading-relaxed">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="text-xs font-bold text-emerald-400 leading-relaxed">
                      {success}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 py-5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting
                      ? "Sending Reset Email..."
                      : "Send Password Reset Link"}
                  </button>
                </form>
                <div className="mt-8 border-t border-white/5 pt-6 text-center space-y-2">
                  <p className="text-sm text-slate-500">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="font-black text-emerald-400 hover:underline hover:text-emerald-300"
                    >
                      Back to Sign In
                    </button>
                  </p>
                  <p className="text-sm text-slate-500">
                    New to TeveXtra?{" "}
                    <Link
                      href="/register"
                      className="font-black text-emerald-400 hover:underline hover:text-emerald-300"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
