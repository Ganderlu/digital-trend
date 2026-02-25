"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

const adminNavItems = [
  {
    key: "dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    key: "users",
    label: "User Management",
    icon: Users,
    href: "/admin/users",
  },
  {
    key: "deposits",
    label: "Deposits",
    icon: CreditCard,
    href: "/admin/deposits",
  },
  {
    key: "withdrawals",
    label: "Withdrawals",
    icon: ArrowUpRight,
    href: "/admin/withdrawals",
  },
  {
    key: "investments",
    label: "Investments",
    icon: TrendingUp,
    href: "/admin/investments",
  },
  {
    key: "settings",
    label: "Admin Settings",
    icon: Settings,
    href: "/admin/settings",
  },
  { key: "exit", label: "Logout", icon: LogOut, action: "logout" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      // Check if user has admin role
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "admin") {
            setAdminUser(userData);
            setCheckingAuth(false);
          } else {
            // Not an admin, redirect to user dashboard
            router.replace("/dashboard");
          }
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/login");
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-4">
          <ShieldAlert className="h-12 w-12 animate-pulse text-emerald-500" />
          <div className="animate-pulse">Verifying Admin Access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-white/5 bg-slate-950 px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">Admin Portal</p>
            <p className="text-xs text-slate-500">System Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/dashboard"
            className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          {adminNavItems.map((item) =>
            item.action === "logout" ? (
              <button
                key={item.key}
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-red-400"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ) : (
              <Link
                key={item.key}
                href={item.href || "#"}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-emerald-400"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="mt-auto px-2">
          <div className="rounded-xl bg-slate-900 p-4 border border-white/5">
            <p className="text-xs text-slate-500 mb-1">Logged in as</p>
            <p className="text-sm font-medium text-slate-200 truncate">
              {adminUser?.email || "Admin"}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative w-64 flex-col border-r border-white/10 bg-slate-950 px-4 py-6">
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="text-lg font-bold text-slate-100">
                Admin Menu
              </span>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg p-1 hover:bg-white/10"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              <Link
                href="/dashboard"
                className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Link>
              {adminNavItems.map((item) =>
                item.action === "logout" ? (
                  <button
                    key={item.key}
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-red-400"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href || "#"}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      pathname === item.href
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-emerald-400"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 backdrop-blur">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
              Admin Mode
            </div>
          </div>
        </header>

        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <LogOut className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-50">
                Confirm Logout
              </h3>
              <p className="mb-6 text-sm text-slate-400">
                Are you sure you want to log out of the admin portal?
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
