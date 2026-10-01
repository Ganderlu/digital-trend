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
  AlertCircle,
  CheckCircle2,
  X,
  Info,
} from "lucide-react";

type ViewMode = "login" | "forgotPassword";

function getFriendlyAuthError(error: unknown): string {
  const err = error as { code?: string; message?: string } | null | undefined;
  const code = (err?.code || "").toString().toLowerCase();
  const rawMessage = (err?.message || "").toString();

  switch (code) {
    case "auth/invalid-email":
      return "The email address you entered is not valid. Please check and try again.";
    case "auth/user-disabled":
      return "This account has been temporarily disabled. Please contact support@tevextra.com for assistance.";
    case "auth/user-not-found":
      return "We could not find an account with that email address. Please check the email or create a new account.";
    case "auth/wrong-password":
      return "The password you entered is incorrect. Please try again or use the forgot password option to reset it.";
    case "auth/invalid-password":
      return "The password you entered is not valid. Passwords must be at least 6 characters.";
    case "auth/too-many-requests":
      return "We have temporarily blocked sign-in attempts from this device due to too many failed requests. Please wait a few minutes and try again, or reset your password to regain access immediately.";
    case "auth/operation-not-allowed":
      return "Email sign-in is currently not enabled. Please contact support for assistance.";
    case "auth/invalid-credential":
      return "The sign-in credentials you provided are not valid. Please double-check your email and password, then try again.";
    case "auth/invalid-login-credentials":
      return "The sign-in credentials you provided are not valid. Please double-check your email and password, then try again.";
    case "auth/network-request-failed":
      return "We could not connect to our servers. Please check your internet connection and try again.";
    case "auth/requires-recent-login":
      return "For your security, this action requires you to sign in again. Please log out and sign back in.";
    case "auth/user-token-expired":
      return "Your session has expired. Please sign in again to continue.";
    case "auth/web-storage-unsupported":
      return "Your browser does not support storage required for sign-in. Please enable cookies and local storage, or try a different browser.";
    default:
      if (rawMessage && /firebase/i.test(rawMessage)) {
        return "Something went wrong while signing you in. Please check your credentials and try again. If the problem persists, contact support.";
      }
      return (
        rawMessage ||
        "Something went wrong while signing you in. Please try again."
      );
  }
}

function getFriendlyResetError(error: unknown): string {
  const message =
    (error as { message?: string } | null | undefined)?.message?.toString() ||
    "";

  const lower = message.toLowerCase();

  if (lower.includes("user-not-found") || lower.includes("user not found")) {
    return "If an account exists with this email address, a password reset link has been sent. Please check your inbox and spam folder if you do not see it within a few minutes.";
  }
  if (lower.includes("invalid-email") || lower.includes("invalid email")) {
    return "The email address you entered is not valid. Please check and try again.";
  }
  if (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("connection")
  ) {
    return "We could not connect to our servers. Please check your internet connection and try again.";
  }
  if (lower.includes("firebase")) {
    return "Something went wrong while sending the reset email. Please try again in a few moments.";
  }
  return (
    message ||
    "Something went wrong while sending the reset email. Please try again."
  );
}

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
  const [loginSuccess, setLoginSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoginSuccess("");

    if (!email || !password) {
      setError(
        "Email and password are required. Please enter both fields to continue.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const auth = getFirebaseAuth();

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDisplayName =
        cred.user?.displayName || email.split("@")[0] || "";

      try {
        sessionStorage.setItem("welcome_back:just_logged_in", "1");
      } catch {}

      setLoginSuccess(
        `Welcome back${userDisplayName ? ", " + userDisplayName : ""}! Redirecting you to your dashboard...`,
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (loginError: unknown) {
      setError(getFriendlyAuthError(loginError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Email address is required. Please enter the email linked to your account.",
      );
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
          "Password reset email sent successfully! Please check your inbox (and spam folder if needed) for further instructions.",
      );
    } catch (resetError: unknown) {
      setError(getFriendlyResetError(resetError));
    } finally {
      setSubmitting(false);
    }
  }

  function switchToForgotPassword() {
    setViewMode("forgotPassword");
    setError("");
    setSuccess("");
    setLoginSuccess("");
    setPassword("");
  }

  function switchToLogin() {
    setViewMode("login");
    setError("");
    setSuccess("");
    setLoginSuccess("");
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
                  {loginSuccess && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="relative rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 pr-10 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur animate-[fadeIn_0.3s_ease-out]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-emerald-300 leading-relaxed">
                            Sign in successful
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-emerald-400/90">
                            {loginSuccess}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="relative rounded-2xl border border-red-500/20 bg-red-500/10 p-4 pr-10 shadow-[0_0_0_1px_rgba(239,68,68,0.05)] backdrop-blur animate-[shake_0.4s_ease-in-out]"
                    >
                      <button
                        type="button"
                        onClick={() => setError("")}
                        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-lg text-red-400/60 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        aria-label="Dismiss error"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                          <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-red-300 leading-relaxed">
                            Unable to sign in
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-red-400/90">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

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
                      autoComplete="email"
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
                        autoComplete="current-password"
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
                  <button
                    type="submit"
                    disabled={submitting || !!loginSuccess}
                    className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 py-5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting
                      ? "Signing you in..."
                      : loginSuccess
                        ? "Redirecting..."
                        : "Sign In to Dashboard"}
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
                  {success && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="relative rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 pr-10 shadow-[0_0_0_1px_rgba(16,185,129,0.05)] backdrop-blur animate-[fadeIn_0.3s_ease-out]"
                    >
                      <button
                        type="button"
                        onClick={() => setSuccess("")}
                        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-lg text-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                        aria-label="Dismiss message"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-emerald-300 leading-relaxed">
                            Email sent successfully
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-emerald-400/90">
                            {success}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="relative rounded-2xl border border-red-500/20 bg-red-500/10 p-4 pr-10 shadow-[0_0_0_1px_rgba(239,68,68,0.05)] backdrop-blur animate-[shake_0.4s_ease-in-out]"
                    >
                      <button
                        type="button"
                        onClick={() => setError("")}
                        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-lg text-red-400/60 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        aria-label="Dismiss error"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                          <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-red-300 leading-relaxed">
                            Unable to process request
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-red-400/90">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

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
                      autoComplete="email"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500/40 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/15 border border-sky-500/25">
                        <Info className="h-3.5 w-3.5 text-sky-400" />
                      </div>
                      <p className="text-xs leading-relaxed text-slate-400">
                        If an account exists with this email, you will receive a
                        secure password reset link. Please check your spam
                        folder or promotions tab if you do not see it within a
                        few minutes. The link expires after 1 hour.
                      </p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !!success}
                    className="w-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 py-5 text-sm font-black text-white shadow-xl shadow-sky-500/30 transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting
                      ? "Sending Reset Email..."
                      : success
                        ? "Email Sent"
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
