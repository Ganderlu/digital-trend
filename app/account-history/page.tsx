"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";

type Transaction = {
  id: string;
  type: "deposit" | "withdrawal" | "investment";
  amount: number;
  currency?: string; // For deposits/withdrawals
  planName?: string; // For investments
  status: string;
  createdAt: Timestamp;
  method?: string; // For withdrawals
};

export default function AccountHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filterType, setFilterType] = useState<
    "all" | "deposit" | "withdrawal" | "investment"
  >("all");

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
        // Fetch Deposits
        const depositsQuery = query(
          collection(db, "deposits"),
          where("userId", "==", currentUser.uid),
        );
        const depositsSnapshot = await getDocs(depositsQuery);
        const deposits = depositsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "deposit" as const,
          ...doc.data(),
        })) as Transaction[];

        // Fetch Withdrawals
        const withdrawalsQuery = query(
          collection(db, "withdrawals"),
          where("userId", "==", currentUser.uid),
        );
        const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
        const withdrawals = withdrawalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "withdrawal" as const,
          ...doc.data(),
        })) as Transaction[];

        // Fetch Investments
        const investmentsQuery = query(
          collection(db, "investments"),
          where("userId", "==", currentUser.uid),
        );
        const investmentsSnapshot = await getDocs(investmentsQuery);
        const investments = investmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "investment" as const,
          ...doc.data(),
        })) as Transaction[];

        // Combine and Sort
        const allTransactions = [
          ...deposits,
          ...withdrawals,
          ...investments,
        ].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        setTransactions(allTransactions);
        setFilteredTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (filterType === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((t) => t.type === filterType),
      );
    }
  }, [filterType, transactions]);

  const formatDate = (timestamp: Timestamp | any) => {
    if (!timestamp) return "N/A";
    // Handle both Firestore Timestamp and JS Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
      case "active":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "rejected":
      case "failed":
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-5 w-5 text-emerald-400" />;
      case "withdrawal":
        return <ArrowUpRight className="h-5 w-5 text-red-400" />;
      case "investment":
        return <TrendingUp className="h-5 w-5 text-violet-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading history...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">
              Account History
            </h1>
            <p className="mt-2 text-slate-400">
              View your recent deposits, withdrawals, and investments.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-1">
            {(["all", "deposit", "withdrawal", "investment"] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    filterType === type
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </button>
              ),
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 ${
                              transaction.type === "deposit"
                                ? "bg-emerald-500/10"
                                : transaction.type === "withdrawal"
                                  ? "bg-red-500/10"
                                  : "bg-violet-500/10"
                            }`}
                          >
                            {getIcon(transaction.type)}
                          </div>
                          <span className="font-medium text-slate-200 capitalize">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-slate-300">
                          {transaction.type === "investment"
                            ? transaction.planName
                            : transaction.currency ||
                              transaction.method ||
                              "Standard"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`font-bold ${
                            transaction.type === "deposit"
                              ? "text-emerald-400"
                              : transaction.type === "withdrawal"
                                ? "text-slate-50"
                                : "text-violet-400"
                          }`}
                        >
                          {transaction.type === "withdrawal" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Search className="mb-4 h-10 w-10 opacity-20" />
                        <p>No transactions found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
