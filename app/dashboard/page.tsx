"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  History,
  User,
  PieChart,
  Box,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  joinedDate?: Timestamp | Date;
  createdAt?: Timestamp | Date;
  lastAccess?: Timestamp | Date;
  balance?: number;
  totalEarnings?: number;
  totalDeposits?: number;
  activeDeposits?: number;
  lastDeposit?: number;
  totalWithdrawals?: number;
  pendingWithdrawals?: number;
  lastWithdrawal?: number;
  referralEarnings?: number;
};

type Transaction = {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "earning";
  amount: number;
  currency?: string;
  planName?: string;
  status: string;
  createdAt: Timestamp;
  method?: string;
  description?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      // Fetch Profile
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        setProfile({
          email: currentUser.email ?? "",
          joinedDate: new Date(), // Fallback
        });
      }

      // Fetch All Transactions
      try {
        const depositsQuery = query(
          collection(db, "deposits"),
          where("userId", "==", currentUser.uid),
        );
        const withdrawalsQuery = query(
          collection(db, "withdrawals"),
          where("userId", "==", currentUser.uid),
        );
        const investmentsQuery = query(
          collection(db, "investments"),
          where("userId", "==", currentUser.uid),
        );
        const earningsQuery = query(
          collection(db, "earnings"),
          where("userId", "==", currentUser.uid),
        );

        const [depositsSnap, withdrawalsSnap, investmentsSnap, earningsSnap] =
          await Promise.all([
            getDocs(depositsQuery),
            getDocs(withdrawalsQuery),
            getDocs(investmentsQuery),
            getDocs(earningsQuery),
          ]);

        const deposits = depositsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "deposit" as const,
          ...doc.data(),
        })) as Transaction[];

        const withdrawals = withdrawalsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "withdrawal" as const,
          ...doc.data(),
        })) as Transaction[];

        const investments = investmentsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "investment" as const,
          ...doc.data(),
        })) as Transaction[];

        const earnings = earningsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "earning" as const,
          ...doc.data(),
        })) as Transaction[];

        // Calculate Withdrawal Stats
        const totalWithdrawalsAmount = withdrawals
          .filter((tx) => tx.status === "approved" || tx.status === "completed")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const pendingWithdrawalsAmount = withdrawals
          .filter((tx) => tx.status === "pending")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const lastWithdrawalAmount =
          withdrawals.filter(
            (tx) => tx.status === "approved" || tx.status === "completed",
          ).length > 0
            ? withdrawals
                .filter(
                  (tx) => tx.status === "approved" || tx.status === "completed",
                )
                .sort(
                  (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
                )[0].amount
            : 0;

        // Calculate Deposit Stats
        const totalDepositsAmount = deposits
          .filter((tx) => tx.status === "approved" || tx.status === "completed")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const activeDepositsAmount = investments
          .filter((tx) => tx.status === "active" || tx.status === "approved")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const lastDepositAmount =
          deposits.filter(
            (tx) => tx.status === "approved" || tx.status === "completed",
          ).length > 0
            ? deposits
                .filter(
                  (tx) => tx.status === "approved" || tx.status === "completed",
                )
                .sort(
                  (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
                )[0].amount
            : 0;

        // Calculate Earnings Stats
        const totalEarningsAmount = earnings
          .filter((tx) => tx.status === "approved" || tx.status === "completed")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        setProfile((prev) => {
          if (!prev) return null;
          const referralComm = prev.referralEarnings || 0;
          return {
            ...prev,
            totalWithdrawals: totalWithdrawalsAmount,
            pendingWithdrawals: pendingWithdrawalsAmount,
            lastWithdrawal: lastWithdrawalAmount,
            totalDeposits: totalDepositsAmount,
            activeDeposits: activeDepositsAmount,
            lastDeposit: lastDepositAmount,
            totalEarnings: totalEarningsAmount + referralComm,
          };
        });

        const all = [...deposits, ...withdrawals, ...investments, ...earnings];

        // If user has referral earnings, we add a "virtual" transaction to show in history
        if (userDoc.exists() && (userDoc.data().referralEarnings || 0) > 0) {
          all.push({
            id: "referral-earnings-total",
            type: "earning",
            amount: userDoc.data().referralEarnings,
            status: "approved",
            createdAt: userDoc.data().joinedDate || Timestamp.now(),
            description: "Total Referral Commission",
          });
        }

        all.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        setAllTransactions(all);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const fullName =
    profile && (profile.firstName || profile.lastName)
      ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
      : "User";

  const username = profile?.username || profile?.email?.split("@")[0] || "User";

  // Format date helper
  const formatDate = (timestamp: Timestamp | Date | undefined | null) => {
    if (!timestamp) return "N/A";
    // Handle Firestore timestamp or Date object
    const date =
      timestamp instanceof Timestamp
        ? timestamp.toDate()
        : new Date(timestamp as Date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Format currency helper
  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Pagination Logic
  const totalPages = Math.ceil(allTransactions.length / ITEMS_PER_PAGE);
  const currentTransactions = allTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Profile Card */}
          <div className="rounded-3xl bg-white p-8 text-center text-slate-900 lg:col-span-1 border border-slate-200">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-4 ring-slate-50">
              <User className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="mt-1 text-sm text-slate-500">{username}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/deposit")}
                className="rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                Deposit
              </button>
              <button
                onClick={() => router.push("/withdraw")}
                className="rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Withdraw
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 text-center">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Joined Date
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatDate(profile?.createdAt || profile?.joinedDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Last Access
                </p>
                <p className="mt-1 text-sm font-semibold">Now</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Username</p>
                <p className="mt-1 text-sm font-semibold truncate">
                  {username}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & History */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Row */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Balance Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Balance
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {formatCurrency(profile?.balance)}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                      <History className="h-3.5 w-3.5" />
                      <span>Updated: now</span>
                    </div>
                    <p className="mt-4 text-xs font-medium text-slate-500">
                      Your account balance
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
                    <PieChart className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Total Earnings Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Total Earnings
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {formatCurrency(profile?.totalEarnings)}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                      <History className="h-3.5 w-3.5" />
                      <span>Updated: now</span>
                    </div>
                    <p className="mt-4 text-xs font-medium text-slate-500">
                      Your total Earnings
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
                    <Box className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* History Row */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Deposit History */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Deposit History
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(profile?.totalDeposits)}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        Total Deposits
                      </p>
                    </div>
                    <ArrowDownLeft className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(profile?.activeDeposits)}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        Active Investment
                      </p>
                    </div>
                    <ArrowDownLeft className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {profile?.lastDeposit
                          ? formatCurrency(profile.lastDeposit)
                          : "$n/a"}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        Last Deposit
                      </p>
                    </div>
                    <ArrowDownLeft className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Withdrawal History */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Withdrawal History
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(profile?.totalWithdrawals)}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        Total Withdrawals
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(profile?.pendingWithdrawals)}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        Pending Withdrawals
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {profile?.lastWithdrawal
                          ? formatCurrency(profile.lastWithdrawal)
                          : "$n/a"}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        Last Withdrawal
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Account History */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              <h3 className="text-lg font-bold text-slate-900">
                All Account History
              </h3>
            </div>
            <div className="text-xs font-medium text-slate-500">
              {allTransactions.length} Transactions
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {allTransactions.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No transactions found
              </div>
            ) : (
              currentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        tx.type === "deposit"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : tx.type === "withdrawal"
                            ? "bg-amber-500/10 text-amber-500"
                            : tx.type === "earning"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : tx.type === "withdrawal" ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : tx.type === "earning" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingUp className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 capitalize">
                        {tx.type === "earning" ? "Profit/Earning" : tx.type}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(tx.createdAt)}</span>
                        {tx.status && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] capitalize ${
                              tx.status === "approved" ||
                              tx.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : tx.status === "pending"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {tx.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.type === "deposit" || tx.type === "earning"
                          ? "text-emerald-500"
                          : tx.type === "withdrawal"
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "earning"
                        ? "+"
                        : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {tx.type === "investment"
                        ? tx.planName
                        : tx.type === "earning"
                          ? tx.description || "Profit Distribution"
                          : tx.type === "deposit"
                            ? tx.currency
                            : tx.method || "Wallet"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
            <div className="text-xs text-slate-500">
              Showing {currentTransactions.length} of {allTransactions.length}{" "}
              transactions
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 min-w-[36px] rounded-xl px-2 text-xs font-bold transition-all ${
                          currentPage === page
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/50"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
