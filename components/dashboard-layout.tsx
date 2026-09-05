"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { GoogleTranslateSelect } from "@/components/google-translate-select";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, Timestamp, onSnapshot } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import Link from "next/link";
import ProfileAvatar from "./profile-avatar";
import { useProfilePhotoURL } from "@/hooks/useProfilePhotoURL";
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
  TrendingUp,
  Grid3X3,
  Bell,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  Award,
  AlertTriangle,
  RefreshCw,
  Gift,
  Search,
  ChevronRight,
} from "lucide-react";

type TickerCoin = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  color: string;
};

const INITIAL_TICKER: TickerCoin[] = [
  {
    symbol: "XRP",
    name: "XRP",
    price: 1.37153,
    change: -0.06,
    changePct: -4.33,
    color: "#00AAE4",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.205,
    change: -0.004,
    changePct: -1.91,
    color: "#0033AD",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 77966,
    change: -569,
    changePct: -0.72,
    color: "#F7931A",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2448.8,
    change: +6.1,
    changePct: +0.25,
    color: "#627EEA",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 172.56,
    change: +4.82,
    changePct: +2.87,
    color: "#14F195",
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 593.1,
    change: -3.4,
    changePct: -0.57,
    color: "#F3BA2F",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.1442,
    change: -0.0032,
    changePct: -2.17,
    color: "#C2A633",
  },
  {
    symbol: "USDT",
    name: "Tether",
    price: 1582.4,
    change: +1.6,
    changePct: +0.1,
    color: "#26A17B",
  },
  {
    symbol: "TRX",
    name: "Tron",
    price: 0.1321,
    change: +0.0018,
    changePct: +1.38,
    color: "#FF0013",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: 28.56,
    change: +0.94,
    changePct: +3.4,
    color: "#E84142",
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    price: 6.52,
    change: -0.14,
    changePct: -2.1,
    color: "#E6007A",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    price: 0.542,
    change: +0.021,
    changePct: +4.03,
    color: "#8247E5",
  },
];

type AppNotification = {
  id: string;
  type:
    | "trade"
    | "deposit"
    | "withdraw"
    | "earning"
    | "security"
    | "referral"
    | "system";
  title: string;
  message: string;
  amount?: number;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "trade",
    title: "Trade Won",
    message: "BTC/USDT CALL trade closed with profit",
    amount: 84,
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "deposit",
    title: "Deposit Confirmed",
    message: "Deposit via Bank Transfer was approved",
    amount: 1000,
    time: "15 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "earning",
    title: "Daily Earnings",
    message: "Investment Plan daily payout received",
    amount: 126.5,
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n4",
    type: "referral",
    title: "Referral Reward",
    message: "Level-1 referral activated their account",
    amount: 20,
    time: "3 hours ago",
    read: true,
  },
  {
    id: "n5",
    type: "withdraw",
    title: "Withdrawal Processed",
    message: "Your withdrawal request has been paid out",
    amount: 350,
    time: "Yesterday",
    read: true,
  },
  {
    id: "n6",
    type: "system",
    title: "System Update",
    message: "New Matrix Plan tiers now available",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n7",
    type: "security",
    title: "New Login Detected",
    message: "Account signed in from Chrome · Windows",
    time: "3 days ago",
    read: true,
  },
];

type UserProfile = {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  username?: string;
  usernameDisplay?: string;
  role?: string;
  joinedDate?: Timestamp | Date;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
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
  photoPublicId?: string;
  profileImageUploaded?: boolean;
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
  { key: "trade", label: "Trade", icon: TrendingUp, href: "/trade" },
  {
    key: "matrix-plan",
    label: "Matrix Plan",
    icon: Grid3X3,
    href: "/matrix-plan",
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const unsubscribeSnapshotRef = useRef<(() => void) | undefined>(undefined);
  const unsubscribeAuthRef = useRef<(() => void) | undefined>(undefined);

  const photoHook = useProfilePhotoURL(currentUserId);
  const effectivePhotoURL = photoHook.resolvedUrl(profile?.photoURL);

  const [ticker, setTicker] = useState<TickerCoin[]>(INITIAL_TICKER);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) =>
        prev.map((coin) => {
          const driftPct = (Math.random() - 0.5) * 0.004;
          const newPrice = Math.max(0.0001, coin.price * (1 + driftPct));
          const priceDelta = newPrice - coin.price;
          const newChange = coin.change + priceDelta * 0.5;
          const denom = newPrice - newChange;
          const newChangePct =
            denom !== 0 ? (newChange / denom) * 100 : coin.changePct;
          return {
            ...coin,
            price: newPrice,
            change: newChange,
            changePct: Number.isFinite(newChangePct)
              ? newChangePct
              : coin.changePct,
          };
        }),
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notifRef.current &&
        e.target instanceof Node &&
        !notifRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        if (unsubscribeSnapshotRef.current) {
          unsubscribeSnapshotRef.current();
          unsubscribeSnapshotRef.current = undefined;
        }
        router.replace("/login");
        return;
      }

      setCurrentUserId(currentUser.uid);

      if (unsubscribeSnapshotRef.current) {
        unsubscribeSnapshotRef.current();
        unsubscribeSnapshotRef.current = undefined;
      }

      const userRef = doc(db, "users", currentUser.uid);
      unsubscribeSnapshotRef.current = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            if (data?.photoURL && photoHook.url !== data.photoURL) {
              photoHook.setPhoto(data.photoURL, data.photoPublicId ?? null);
            }
          } else {
            setProfile({
              email: currentUser.email ?? "",
              joinedDate: new Date(),
            });
          }
          setCheckingAuth(false);
        },
        (error) => {
          if (
            error?.code === "permission-denied" ||
            error?.code === "unauthenticated"
          ) {
            return;
          }
          console.error("Firestore snapshot error:", error);
        },
      );
    });

    unsubscribeAuthRef.current = unsubscribeAuth;

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshotRef.current) {
        unsubscribeSnapshotRef.current();
        unsubscribeSnapshotRef.current = undefined;
      }
    };
  }, [router]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    if (unsubscribeSnapshotRef.current) {
      unsubscribeSnapshotRef.current();
      unsubscribeSnapshotRef.current = undefined;
    }
    if (unsubscribeAuthRef.current) {
      unsubscribeAuthRef.current();
      unsubscribeAuthRef.current = undefined;
    }

    try {
      await signOut(auth);
    } catch {}
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
    profile?.fullName && profile.fullName.trim().length > 0
      ? profile.fullName.trim()
      : profile && (profile.firstName || profile.lastName)
        ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
        : profile?.usernameDisplay || profile?.username || "User";

  const displayUsername =
    profile?.usernameDisplay ||
    profile?.username ||
    profile?.email?.split("@")[0] ||
    "User";

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-white/5 bg-slate-950 px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <ProfileAvatar
            src={effectivePhotoURL}
            alt={displayUsername}
            fallbackInitials={`${profile?.firstName || profile?.fullName?.split(" ")[0] || ""} ${profile?.lastName || profile?.fullName?.split(" ").slice(1).join(" ") || profile?.email || ""}`}
            size="h-10 w-10"
            gradient="from-slate-800 to-slate-900"
            iconSize={24}
            cacheBuster={
              profile?.photoPublicId || profile?.updatedAt
                ? String(Date.now()).slice(0, -3)
                : undefined
            }
          />
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Welcome {displayUsername}
            </p>
            <p className="text-xs text-slate-500">{fullName}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {(profile?.role === "admin" ||
            profile?.email === "cjonwubuya@gmail.com") && (
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
              <ProfileAvatar
                src={effectivePhotoURL}
                alt={displayUsername}
                fallbackInitials={`${profile?.firstName || profile?.fullName?.split(" ")[0] || ""} ${profile?.lastName || profile?.fullName?.split(" ").slice(1).join(" ") || profile?.email || ""}`}
                size="h-10 w-10"
                gradient="from-slate-800 to-slate-900"
                iconSize={24}
                cacheBuster={
                  profile?.photoPublicId || profile?.updatedAt
                    ? String(Date.now()).slice(0, -3)
                    : undefined
                }
              />
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Welcome {displayUsername}
                </p>
                <p className="text-xs text-slate-500">{fullName}</p>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {(profile?.role === "admin" ||
                profile?.email === "cjonwubuya@gmail.com") && (
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
        <style jsx global>{`
          @keyframes marquee-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @keyframes notif-pop {
            0% {
              transform: scale(0.9);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes pulse-badge {
            0%,
            100% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45);
            }
            50% {
              box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
            }
          }
          .ticker-track {
            animation: marquee-left 55s linear infinite;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
          .notif-pop {
            animation: notif-pop 0.18s ease-out;
          }
          .pulse-badge {
            animation: pulse-badge 1.8s infinite;
          }
        `}</style>

        {/* Live Market Ticker */}
        <div className="relative w-full overflow-hidden border-b border-white/5 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-slate-950 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-slate-950 to-transparent" />
          <div className="flex items-center py-2.5 pl-3 pr-3">
            <div className="mr-3 hidden shrink-0 items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Live Markets
              </span>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div className="ticker-track flex w-max items-center gap-10 whitespace-nowrap">
                {[...ticker, ...ticker].map((coin, idx) => {
                  const pos = coin.changePct >= 0;
                  return (
                    <div
                      key={`${coin.symbol}-${idx}`}
                      className="flex items-center gap-2.5 pr-10"
                    >
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: coin.color }}
                      >
                        {coin.symbol.charAt(0)}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-100">
                          {coin.name}
                        </span>
                        <span className="text-sm font-semibold text-slate-200 tabular-nums">
                          {coin.price < 0.01
                            ? coin.price.toFixed(5)
                            : coin.price < 1
                              ? coin.price.toFixed(4)
                              : coin.price < 100
                                ? coin.price.toFixed(2)
                                : coin.price.toLocaleString("en-US", {
                                    maximumFractionDigits: 0,
                                  })}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 text-sm font-bold tabular-nums ${
                            pos ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {pos ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                          {coin.change >= 0 ? "+" : ""}
                          {Math.abs(coin.change) < 1
                            ? coin.change.toFixed(4)
                            : coin.change.toFixed(2)}
                          <span className="ml-1 opacity-80">
                            ({pos ? "+" : ""}
                            {coin.changePct.toFixed(2)}%)
                          </span>
                        </span>
                      </div>
                      {idx < ticker.length && (
                        <span className="ml-2 h-5 w-px shrink-0 bg-white/10" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-1.5 md:flex lg:hidden xl:flex">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search assets, trades..."
                className="w-56 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400/80">
                  Balance
                </p>
                <p className="text-sm font-bold text-slate-100 tabular-nums">
                  $
                  {((profile?.balance ?? 0) as number).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <GoogleTranslateSelect compact />

            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 transition hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-indigo-300"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="pulse-badge absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-slate-950 bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="notif-pop absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl ring-1 ring-black/40 sm:w-[400px]">
                  <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/80 px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
                        <Bell className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">
                          Notifications
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {unreadCount} unread · {notifications.length} total
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={markAllRead}
                      disabled={unreadCount === 0}
                      className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-40"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {notifications.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                          <CheckCircle className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-300">
                          All caught up
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          No new notifications
                        </p>
                      </div>
                    )}
                    {notifications.map((n) => {
                      const icons: Record<
                        AppNotification["type"],
                        { icon: any; color: string; bg: string }
                      > = {
                        trade: {
                          icon: TrendingUp,
                          color: "text-emerald-400",
                          bg: "bg-emerald-500/15",
                        },
                        deposit: {
                          icon: CreditCard,
                          color: "text-blue-400",
                          bg: "bg-blue-500/15",
                        },
                        withdraw: {
                          icon: Wallet,
                          color: "text-violet-400",
                          bg: "bg-violet-500/15",
                        },
                        earning: {
                          icon: Award,
                          color: "text-amber-400",
                          bg: "bg-amber-500/15",
                        },
                        security: {
                          icon: AlertTriangle,
                          color: "text-red-400",
                          bg: "bg-red-500/15",
                        },
                        referral: {
                          icon: Gift,
                          color: "text-pink-400",
                          bg: "bg-pink-500/15",
                        },
                        system: {
                          icon: RefreshCw,
                          color: "text-sky-400",
                          bg: "bg-sky-500/15",
                        },
                      };
                      const meta = icons[n.type];
                      const Icon = meta.icon;
                      return (
                        <button
                          key={n.id}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((x) =>
                                x.id === n.id ? { ...x, read: true } : x,
                              ),
                            );
                          }}
                          className={`flex w-full items-start gap-3 border-b border-white/5 px-5 py-3.5 text-left transition last:border-0 hover:bg-white/5 ${
                            !n.read ? "bg-indigo-500/[0.04]" : ""
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}
                          >
                            <Icon className={`h-4.5 w-4.5 ${meta.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-100">
                                {n.title}
                                {!n.read && (
                                  <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 align-middle" />
                                )}
                              </p>
                              <span className="shrink-0 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                                {n.time}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">
                              {n.message}
                            </p>
                            {typeof n.amount === "number" && (
                              <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
                                <span className="text-[10px] font-bold text-emerald-400 tabular-nums">
                                  +${n.amount.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                          <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-600" />
                        </button>
                      );
                    })}
                  </div>

                  <Link
                    href="/account-history"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-center gap-1.5 border-t border-white/5 bg-slate-950/60 px-5 py-3 text-xs font-semibold text-indigo-400 transition hover:bg-slate-950"
                  >
                    View all activity
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-2.5 py-1.5 transition hover:border-white/20 hover:bg-slate-800/80">
              <ProfileAvatar
                src={effectivePhotoURL}
                alt={displayUsername}
                fallbackInitials={`${profile?.firstName || profile?.fullName?.split(" ")[0] || ""} ${profile?.lastName || profile?.fullName?.split(" ").slice(1).join(" ") || profile?.email || ""}`}
                size="h-8 w-8"
                iconSize={16}
                cacheBuster={
                  profile?.photoPublicId || profile?.updatedAt
                    ? String(Date.now()).slice(0, -3)
                    : undefined
                }
              />
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-bold text-slate-200">
                  {displayUsername}
                </p>
                <p className="text-[10px] text-slate-500">
                  {profile?.role === "admin" ? "Administrator" : "Pro Account"}
                </p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
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
