"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

type ViewMode = "login" | "forgotPassword";

export default function LoginPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="bg-white min-h-screen transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24">
        <section className="grid w-full max-w-4xl gap-12 rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr] shadow-xl transition-colors duration-300">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
              {isLoginMode ? "Account Login" : "Password Recovery"}
            </p>
            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {isLoginMode
                ? "Access your investment dashboard."
                : "Reset your account password."}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              {isLoginMode
                ? "Sign in to monitor performance, review statements, manage funding, and update your preferences. For your security, please avoid logging in from shared or public devices."
                : "Enter your registered email address and we will send you a secure link to reset your password. The link will expire after 1 hour for your protection."}
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  {isLoginMode
                    ? "Multi-factor authentication available"
                    : "Secure one-time reset link"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  {isLoginMode
                    ? "Real-time portfolio analytics"
                    : "Email delivered within minutes"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  {isLoginMode
                    ? "Secure advisory messaging"
                    : "No data shared with third parties"}
                </span>
              </div>
            </div>
            <p className="mt-10 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              {isLoginMode
                ? "Security notice: If you suspect unauthorized access, contact support immediately."
                : "Security notice: Never share your reset link with anyone. Our team will never ask for it."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-300">
            {isLoginMode ? (
              <>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label
                      htmlFor="login-email"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      Email Address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="login-password"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(event) =>
                          setRememberDevice(event.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-200 bg-slate-50 text-emerald-600 focus:ring-0"
                      />
                      <span>Remember Device</span>
                    </label>
                    <button
                      type="button"
                      onClick={switchToForgotPassword}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-red-600">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-emerald-600 py-5 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting ? "Processing..." : "Sign In to Dashboard"}
                  </button>
                </form>
                <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                  <p className="text-sm text-slate-500">
                    New to Digital-trend?{" "}
                    <Link
                      href="/register"
                      className="font-bold text-emerald-600 hover:underline"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <form className="space-y-6" onSubmit={handleForgotPassword}>
                  <div className="space-y-2">
                    <label
                      htmlFor="reset-email"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      Registered Email Address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                    />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-3 w-3 text-emerald-600"
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
                      <p className="text-xs leading-relaxed text-slate-600">
                        If an account exists with this email, you will receive a
                        password reset link. Please check your spam folder if
                        you do not see it within a few minutes.
                      </p>
                    </div>
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-red-600">{error}</p>
                  )}
                  {success && (
                    <p className="text-xs font-bold text-emerald-600">
                      {success}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-emerald-600 py-5 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting
                      ? "Sending Reset Email..."
                      : "Send Password Reset Link"}
                  </button>
                </form>
                <div className="mt-8 border-t border-slate-100 pt-6 text-center space-y-2">
                  <p className="text-sm text-slate-500">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="font-bold text-emerald-600 hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </p>
                  <p className="text-sm text-slate-500">
                    New to Digital-trend?{" "}
                    <Link
                      href="/register"
                      className="font-bold text-emerald-600 hover:underline"
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
