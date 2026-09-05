"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  Settings,
  Save,
  Wallet,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
  ShieldCheck,
  LogOut,
  Copy,
  KeyRound,
} from "lucide-react";

type GlobalSettings = {
  walletBTC: string;
  walletETH: string;
  walletUSDT: string;
  walletXRP: string;
  supportEmail: string;
  siteName: string;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [claimSetupRunning, setClaimSetupRunning] = useState(false);
  const [claimStatus, setClaimStatus] = useState<null | {
    type: "success" | "error";
    text: string;
    needsSignOut?: boolean;
  }>(null);

  const [settings, setSettings] = useState<GlobalSettings>({
    walletBTC: "",
    walletETH: "",
    walletUSDT: "",
    walletXRP: "",
    supportEmail: "",
    siteName: "TeveXtra",
  });

  const handleGrantAdminClaim = async () => {
    try {
      setClaimSetupRunning(true);
      setClaimStatus(null);
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No signed in user. Please sign in again.");
      }
      const idToken = await getIdToken(currentUser, true);
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      setClaimStatus({
        type: "success",
        text:
          result.message ||
          "Admin custom claims set. Please sign out and back in.",
        needsSignOut: !!result.mustSignOutAndBackIn,
      });
    } catch (err: any) {
      console.error("handleGrantAdminClaim failed:", err);
      setClaimStatus({
        type: "error",
        text:
          err?.message ||
          "Could not grant admin claim. Check the console for details.",
      });
    } finally {
      setClaimSetupRunning(false);
    }
  };

  const handleSignOutNow = async () => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    await auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      try {
        const settingsDoc = await getDoc(doc(db, "settings", "global"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data() as GlobalSettings;

          // Check for old default values and update them to new user-provided values
          const oldDefaults = {
            walletBTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            walletETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
            walletUSDT: "TXj5f6X9X5X5X5X5X5X5X5X5X5X5X5X5X5",
          };

          const newDefaults = {
            walletBTC: "1J1RpsaG7BoQu6pmxQ2j2WC5H6zni6eUKh",
            walletETH: "0x031d48c14d06470edd37b8c23df4d179a855f48c",
            walletUSDT: "TAGehSxJe15bB81JmP7gnuHLJTwZGaWZ2K",
          };

          const updatedSettings = { ...data };
          let needsUpdate = false;

          if (data.walletBTC === oldDefaults.walletBTC) {
            updatedSettings.walletBTC = newDefaults.walletBTC;
            needsUpdate = true;
          }
          if (data.walletETH === oldDefaults.walletETH) {
            updatedSettings.walletETH = newDefaults.walletETH;
            needsUpdate = true;
          }
          if (data.walletUSDT === oldDefaults.walletUSDT) {
            updatedSettings.walletUSDT = newDefaults.walletUSDT;
            needsUpdate = true;
          }

          setSettings(updatedSettings);

          if (needsUpdate) {
            setMessage({
              type: "success",
              text: "Old default wallets detected. New wallets loaded - please click Save.",
            });
          }
        } else {
          // Initialize with defaults if not exists
          const defaultSettings = {
            walletBTC: "1J1RpsaG7BoQu6pmxQ2j2WC5H6zni6eUKh",
            walletETH: "0x031d48c14d06470edd37b8c23df4d179a855f48c",
            walletUSDT: "TAGehSxJe15bB81JmP7gnuHLJTwZGaWZ2K",
            walletXRP: "rLNaS6mXj5f6X9X5X5X5X5X5X5X5X5X5X5",
            supportEmail: "helpdigitaltrend@gmail.com",
            siteName: "TeveXtra",
          };
          setSettings(defaultSettings);
          // Optionally save these defaults to DB immediately or wait for user save
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setMessage({ type: "error", text: "Failed to load settings." });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        throw new Error(
          "Session expired. Please sign out, sign back in, then try again.",
        );
      }

      const db = getFirebaseFirestore();
      const settingsRef = doc(db, "settings", "global");

      // Pre-clean + trim string fields to avoid any whitespace issues
      const cleaned: GlobalSettings = {
        walletBTC: (settings.walletBTC || "").trim(),
        walletETH: (settings.walletETH || "").trim(),
        walletUSDT: (settings.walletUSDT || "").trim(),
        walletXRP: (settings.walletXRP || "").trim(),
        supportEmail: (settings.supportEmail || "").trim(),
        siteName: (settings.siteName || "TeveXtra").trim(),
      };

      try {
        // Try upsert via setDoc with merge (works for existing OR new docs)
        await setDoc(settingsRef, cleaned, { merge: true });
      } catch (setErr: unknown) {
        // Fallback: try updateDoc if setDoc's create-vs-update semantics get stuck
        const code = (setErr as any)?.code || (setErr as any)?.status || "";
        if (
          code === "permission-denied" ||
          code === "not-found" ||
          code === 7 ||
          code === 5
        ) {
          try {
            await updateDoc(settingsRef, { ...cleaned });
          } catch {
            throw setErr;
          }
        } else {
          throw setErr;
        }
      }

      setMessage({ type: "success", text: "Settings saved successfully." });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: unknown) {
      console.error("Error saving settings:", error);

      const code = (error as any)?.code || (error as any)?.status || "";
      let text = "Failed to save settings.";

      if (code === "permission-denied" || code === 7) {
        text =
          "Firebase Rules denied this write. Make sure you have pasted + published the updated Firestore Rules from the instructions. Also refresh the page + sign back in as admin.";
      } else if (
        code === "unauthenticated" ||
        code === 16 ||
        (error instanceof Error && error.message.includes("Session"))
      ) {
        text =
          error instanceof Error
            ? error.message
            : "You are not signed in. Please sign in as admin again.";
      } else if (code === "unavailable" || code === 14) {
        text =
          "Firestore is temporarily unavailable. Check your network and try again.";
      } else if (error instanceof Error && error.message.trim().length > 0) {
        text = `Failed to save settings — ${error.message}`;
      }

      setMessage({ type: "error", text });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof GlobalSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">System Settings</h1>
          <p className="mt-2 text-slate-400">
            Configure global system parameters and wallet addresses.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
              message.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Admin Claim Setup (Bootstrap) */}
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-slate-900 to-slate-900 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <KeyRound className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-50">
                  Admin Token Setup
                </h3>
                <p className="text-xs text-slate-400">
                  Grants a permanent Firebase Auth Custom Claim on your sign-in
                  token. This removes the 10-document Firestore limit and fixes
                  &quot;Missing or insufficient permissions&quot; on Admin
                  Overview.
                </p>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-400/80 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Required
              </div>
            </div>

            <div className="space-y-4">
              {claimStatus && (
                <div
                  className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    claimStatus.type === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/20 bg-red-500/10 text-red-300"
                  }`}
                >
                  {claimStatus.type === "success" ? (
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="font-medium">{claimStatus.text}</p>
                    {claimStatus.needsSignOut && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleSignOutNow}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out Now (then sign back in)
                        </button>
                        <span className="text-xs text-slate-400">
                          The new token with admin claim activates only after
                          re-authenticating.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGrantAdminClaim}
                  disabled={claimSetupRunning}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-50"
                >
                  {claimSetupRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Granting admin claim...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Grant Admin Claim to My Account
                    </>
                  )}
                </button>
                <div className="text-xs text-slate-400 max-w-lg">
                  Safe to run multiple times. Authorizes: super-admin email (
                  <code className="text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded text-[11px] border border-white/5">
                    cjonwubuya@gmail.com
                  </code>
                  ), any user with Firestore role=admin, or the very first user.
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Configuration */}
          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">
                  Wallet Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Set receiving addresses for user deposits.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Bitcoin (BTC) Address
                  </label>
                  <input
                    type="text"
                    value={settings.walletBTC}
                    onChange={(e) => handleChange("walletBTC", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    placeholder="Enter BTC wallet address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Ethereum (ETH) Address
                  </label>
                  <input
                    type="text"
                    value={settings.walletETH}
                    onChange={(e) => handleChange("walletETH", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    placeholder="Enter ETH wallet address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    USDT (TRC20) Address
                  </label>
                  <input
                    type="text"
                    value={settings.walletUSDT}
                    onChange={(e) => handleChange("walletUSDT", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    placeholder="Enter USDT wallet address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    XRP Address
                  </label>
                  <input
                    type="text"
                    value={settings.walletXRP}
                    onChange={(e) => handleChange("walletXRP", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    placeholder="Enter XRP wallet address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">
                  General Information
                </h3>
                <p className="text-xs text-slate-400">
                  Basic site configuration.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Support Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      handleChange("supportEmail", e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
