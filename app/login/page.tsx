"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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

  return (
    <div className="bg-white min-h-screen transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24">
        <section className="grid w-full max-w-4xl gap-12 rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr] shadow-xl transition-colors duration-300">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
              Account Login
            </p>
            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Access your investment dashboard.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Sign in to monitor performance, review statements, manage funding,
              and update your preferences. For your security, please avoid
              logging in from shared or public devices.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  Multi-factor authentication available
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  Real-time portfolio analytics
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  Secure advisory messaging
                </span>
              </div>
            </div>
            <p className="mt-10 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              Security notice: If you suspect unauthorized access, contact
              support immediately.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-300">
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
          </div>
        </section>
      </div>
    </div>
  );
}
