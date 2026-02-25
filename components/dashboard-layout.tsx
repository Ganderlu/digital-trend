"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, Timestamp, onSnapshot } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import Link from "next/link";
import {
  LayoutDashboard,
  Upload,
  Download,
  List,
  History,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  role?: string;
  joinedDate?: Timestamp | Date;
  lastAccess?: Timestamp | Date;
  balance?: number;
  totalEarnings?: number;
  totalDeposits?: number;
  activeDeposits?: number;
  lastDeposit?: number;
  totalWithdrawals?: number;
  pendingWithdrawals?: number;
  lastWithdrawal?: number;
  photoURL?: string;
};

const dashboardNavItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { key: "deposit", label: "Make Deposit", icon: Upload, href: "/deposit" },
  {
    key: "withdraw",
    label: "Request Withdraw",
    icon: Download,
    href: "/withdraw",
  },
  {
    key: "investment-plans",
    label: "Investment Plans",
    icon: List,
    href: "/investment-plans",
  },
  // {
  //   key: "deposit-list",
  //   label: "Deposit List",
  //   icon: List,
  //   href: "/deposit-list",
  // },
  {
    key: "account-history",
    label: "Account History",
    icon: History,
    href: "/account-history",
  },
  { key: "referrals", label: "Referrals", icon: Users, href: "/referrals" },
  {
    key: "account-settings",
    label: "Account Settings",
    icon: Settings,
    href: "/account-settings",
  },
  {
    key: "security-settings",
    label: "Security Settings",
    icon: ShieldCheck,
    href: "/security-settings",
  },
  { key: "exit", label: "Exit Account", icon: LogOut, action: "logout" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      // Clean up previous snapshot listener if user changes (rare but good practice)
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }

      const userRef = doc(db, "users", currentUser.uid);
      unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile({
            email: currentUser.email ?? "",
            joinedDate: new Date(),
          });
        }
        setCheckingAuth(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
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
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const fullName =
    profile && (profile.firstName || profile.lastName)
      ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
      : "User";

  const username = profile?.username || profile?.email?.split("@")[0] || "User";

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-white/5 bg-slate-950 px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-800">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Welcome {username}
            </p>
            <p className="text-xs text-slate-500">{fullName}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="mb-2 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <ShieldAlert className="h-5 w-5" />
              Admin Panel
            </Link>
          )}
          {dashboardNavItems.map((item) =>
            item.action === "logout" ? (
              <button
                key={item.key}
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-emerald-400"
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

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative w-64 flex-col border-r border-white/10 bg-slate-950 px-4 py-6">
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="text-lg font-bold text-slate-100">Menu</span>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg p-1 hover:bg-white/10"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-800">
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Welcome {username}
                </p>
                <p className="text-xs text-slate-500">{fullName}</p>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="mb-2 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                >
                  <ShieldAlert className="h-5 w-5" />
                  Admin Panel
                </Link>
              )}
              {dashboardNavItems.map((item) =>
                item.action === "logout" ? (
                  <button
                    key={item.key}
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-emerald-400"
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
          <div className="hidden md:block"></div> {/* Spacer */}
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 sm:block"
            >
              About Us
            </Link>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 hover:bg-slate-800">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-slate-300">
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
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
                Are you sure you want to log out of your account? You will need
                to sign in again to access your dashboard.
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
