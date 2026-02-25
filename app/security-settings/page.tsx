"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import DashboardLayout from "@/components/dashboard-layout";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    setSaving(true);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (currentUser && currentUser.email) {
        // Re-authenticate first
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);

        // Update Password
        await updatePassword(currentUser, newPassword);

        // Update Firestore record
        const db = getFirebaseFirestore();
        await updateDoc(doc(db, "users", currentUser.uid), {
          lastPasswordChange: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setMessage({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        setMessage({ type: "error", text: "Incorrect current password." });
      } else {
        setMessage({
          type: "error",
          text: "Failed to update password. Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const isPasswordUser = user?.providerData?.some(
    (p: any) => p.providerId === "password",
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">
            Security Settings
          </h1>
          <p className="mt-2 text-slate-400">
            Manage your password and security preferences.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Password Change Section */}
          {!isPasswordUser ? (
            <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-50">
                    Password Management
                  </h2>
                  <p className="text-sm text-slate-400">
                    You are signed in with a third-party provider (e.g.,
                    Google). You cannot change your password here.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm lg:p-8">
              <div className="mb-6 flex items-start gap-4 border-b border-white/5 pb-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-50">
                    Change Password
                  </h2>
                  <p className="text-sm text-slate-400">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </p>
                </div>
              </div>

              {message && (
                <div
                  className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
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
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="mb-2 block text-sm font-medium text-slate-400"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-12 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium text-slate-400"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-12 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        placeholder="Min. 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-slate-400"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        placeholder="Re-enter new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={
                      saving ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Two-Factor Authentication (UI Only for now) */}
          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm lg:p-8 opacity-60 pointer-events-none">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-50">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-sm text-slate-400">
                    Add an extra layer of security to your account.
                  </p>
                  <div className="mt-2 inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                    Coming Soon
                  </div>
                </div>
              </div>

              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
