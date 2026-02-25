"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
  where,
  runTransaction,
  getDoc,
  increment,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  ArrowUpRight,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  AlertCircle,
  Wallet,
  Landmark,
} from "lucide-react";

type WithdrawalRequest = {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp | any;
  userEmail?: string;
  details?: any;
};

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

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
        const withdrawalsQuery = query(
          collection(db, "withdrawals"),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(withdrawalsQuery);

        const withdrawalsData = await Promise.all(
          snapshot.docs.map(async (wdDoc) => {
            const data = wdDoc.data();
            let userEmail = data.userEmail || "Unknown";

            // If email is missing in withdrawal doc, try to fetch from user doc
            if (!data.userEmail && data.userId) {
              try {
                const userDoc = await getDoc(doc(db, "users", data.userId));
                if (userDoc.exists()) {
                  userEmail = userDoc.data().email;
                }
              } catch (e) {
                console.error("Error fetching user email", e);
              }
            }

            return {
              id: wdDoc.id,
              ...data,
              userEmail,
            } as WithdrawalRequest;
          }),
        );

        setWithdrawals(withdrawalsData);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleStatusUpdate = async (
    withdrawal: WithdrawalRequest,
    newStatus: "approved" | "rejected",
  ) => {
    if (processingId) return;

    const action = newStatus === "approved" ? "approve" : "reject";
    if (!confirm(`Are you sure you want to ${action} this withdrawal?`)) return;

    setProcessingId(withdrawal.id);
    const db = getFirebaseFirestore();

    try {
      await runTransaction(db, async (transaction) => {
        const withdrawalRef = doc(db, "withdrawals", withdrawal.id);
        const userRef = doc(db, "users", withdrawal.userId);

        const withdrawalDoc = await transaction.get(withdrawalRef);
        if (!withdrawalDoc.exists()) {
          throw "Withdrawal document does not exist!";
        }

        if (withdrawalDoc.data().status !== "pending") {
          throw "Withdrawal is already processed!";
        }

        // Check balance if approving
        if (newStatus === "approved") {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists()) {
            throw "User document does not exist!";
          }

          const currentBalance = userDoc.data().balance || 0;
          if (currentBalance < withdrawal.amount) {
            throw `Insufficient user balance! Current: ${currentBalance}, Requested: ${withdrawal.amount}`;
          }

          // Deduct balance
          transaction.update(userRef, {
            balance: increment(-withdrawal.amount),
          });
        }

        // Update withdrawal status
        transaction.update(withdrawalRef, {
          status: newStatus,
          processedAt: Timestamp.now(),
        });
      });

      // Update local state
      setWithdrawals(
        withdrawals.map((w) =>
          w.id === withdrawal.id ? { ...w, status: newStatus } : w,
        ),
      );
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      alert("Failed to update withdrawal status: " + error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredWithdrawals = withdrawals.filter((wd) => {
    if (filterStatus === "all") return true;
    return wd.status === filterStatus;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">
            Loading withdrawals...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">
              Withdrawal Requests
            </h1>
            <p className="mt-2 text-slate-400">
              Manage and process user withdrawals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredWithdrawals.length > 0 ? (
                  filteredWithdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">
                              {withdrawal.userEmail}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {withdrawal.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-200">
                        {formatCurrency(withdrawal.amount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 capitalize">
                        {withdrawal.method}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        {withdrawal.method === "BANK" ? (
                          <div
                            className="flex items-center gap-1"
                            title={`${withdrawal.details?.bankName} - ${withdrawal.details?.accountNumber}`}
                          >
                            <Landmark className="h-3 w-3 text-slate-500" />
                            <span className="text-xs">
                              {withdrawal.details?.bankName}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-1"
                            title={withdrawal.details?.walletAddress}
                          >
                            <Wallet className="h-3 w-3 text-slate-500" />
                            <span className="text-xs truncate max-w-[120px]">
                              {withdrawal.details?.walletAddress}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(withdrawal.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            withdrawal.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : withdrawal.status === "rejected"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {withdrawal.status === "pending" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {withdrawal.status === "approved" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {withdrawal.status === "rejected" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {withdrawal.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleStatusUpdate(withdrawal, "approved")
                              }
                              disabled={!!processingId}
                              className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                              title="Approve Withdrawal"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(withdrawal, "rejected")
                              }
                              disabled={!!processingId}
                              className="rounded-lg bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                              title="Reject Withdrawal"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {withdrawal.status !== "pending" && (
                          <span className="text-xs text-slate-600">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No withdrawals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
