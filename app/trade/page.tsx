"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Wallet,
  Zap,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Search,
  Star,
  Plus,
  Minus,
  Settings,
  Maximize2,
  ChevronUp,
  ChevronDown,
  X,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Activity,
  LineChart,
  CandlestickChart,
  Crosshair,
  RefreshCw,
  Layers,
  Target,
  Gauge,
  Waves,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  balance?: number;
  totalEarnings?: number;
  totalDeposits?: number;
  activeDeposits?: number;
  totalTrades?: number;
  winRate?: number;
};

type Asset = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  category: "crypto" | "forex" | "commodity";
  tvSymbol: string;
  miniTrend: ("up" | "down")[];
  color: string;
};

type ActiveTrade = {
  id: string;
  asset: string;
  direction: "CALL" | "PUT";
  investment: number;
  entryPrice: number;
  currentPrice: number;
  expiry: number;
  startTime: number;
  status: "active" | "won" | "lost";
  pnl?: number;
  firestoreId?: string;
};

type TradeHistoryItem = {
  id: string;
  firestoreId?: string;
  asset: string;
  direction: "CALL" | "PUT";
  amount: number;
  payout: number;
  result: "won" | "lost";
  time: string;
  entryPrice?: number;
  exitPrice?: number;
};

type TechnicalIndicators = {
  trend: "Bullish" | "Bearish" | "Neutral";
  trendStrength: number;
  rsi: number;
  rsiSignal: "Overbought" | "Oversold" | "Neutral";
  macd: {
    value: number;
    signal: number;
    histogram: number;
    crossover: "Bullish" | "Bearish" | "Neutral";
  };
  ma20: number;
  ma50: number;
  ma200: number;
  maSignal: "Bullish" | "Bearish" | "Neutral";
  support: number;
  resistance: number;
  volatility: number;
  volatilityLevel: "Low" | "Medium" | "High";
  atr: number;
};

const ASSETS: Asset[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    price: 68420.5,
    change24h: 1.25,
    category: "crypto",
    tvSymbol: "BINANCE:BTCUSDT",
    miniTrend: ["up", "up", "down", "up", "up", "up", "down", "up"],
    color: "#F7931A",
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    price: 3245.8,
    change24h: 0.95,
    category: "crypto",
    tvSymbol: "BINANCE:ETHUSDT",
    miniTrend: ["up", "down", "up", "up", "down", "up", "up", "up"],
    color: "#627EEA",
  },
  {
    symbol: "BNB/USDT",
    name: "BNB",
    price: 592.1,
    change24h: -0.35,
    category: "crypto",
    tvSymbol: "BINANCE:BNBUSDT",
    miniTrend: ["down", "down", "up", "down", "down", "up", "down", "down"],
    color: "#F3BA2F",
  },
  {
    symbol: "SOL/USDT",
    name: "Solana",
    price: 165.35,
    change24h: 2.15,
    category: "crypto",
    tvSymbol: "BINANCE:SOLUSDT",
    miniTrend: ["up", "down", "up", "up", "up", "up", "down", "up"],
    color: "#14F195",
  },
  {
    symbol: "XRP/USDT",
    name: "Ripple",
    price: 0.5152,
    change24h: -0.25,
    category: "crypto",
    tvSymbol: "BINANCE:XRPUSDT",
    miniTrend: ["down", "up", "down", "down", "up", "down", "down", "down"],
    color: "#23292F",
  },
  {
    symbol: "ADA/USDT",
    name: "Cardano",
    price: 0.4508,
    change24h: 0.55,
    category: "crypto",
    tvSymbol: "BINANCE:ADAUSDT",
    miniTrend: ["up", "down", "up", "down", "up", "up", "up", "up"],
    color: "#0033AD",
  },
  {
    symbol: "DOGE/USDT",
    name: "Dogecoin",
    price: 0.1442,
    change24h: -0.45,
    category: "crypto",
    tvSymbol: "BINANCE:DOGEUSDT",
    miniTrend: ["down", "up", "down", "up", "down", "down", "down", "down"],
    color: "#C2A633",
  },
  {
    symbol: "USDT/NGN",
    name: "Tether",
    price: 1580.0,
    change24h: 0.1,
    category: "crypto",
    tvSymbol: "KUCOIN:USDTNGN",
    miniTrend: ["up", "up", "down", "up", "up", "down", "up", "up"],
    color: "#26A17B",
  },
];

const TIMEFRAMES = ["1M", "5M", "15M", "1H", "4H", "1D"];
const EXPIRY_OPTIONS = [30, 60, 120, 300, 600, 900];
const AMOUNT_PRESETS = [10, 50, 100, 500];
const PAYOUT_RATE = 0.84;
const CHART_STYLES = [
  { id: "1", name: "Candlestick", icon: CandlestickChart },
  { id: "3", name: "Line", icon: LineChart },
  { id: "9", name: "Area", icon: Activity },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function MiniChart({
  trend,
  positive,
  width = 60,
  height = 24,
}: {
  trend: ("up" | "down")[];
  positive: boolean;
  width?: number;
  height?: number;
}) {
  const color = positive ? "#10b981" : "#ef4444";
  const points = trend.map((t, i) => {
    const x = (i / (trend.length - 1)) * width;
    let y = height / 2;
    if (t === "up") y = height * 0.25;
    else y = height * 0.75;
    if (i === 0) y = height / 2;
    else if (i === trend.length - 1)
      y = positive ? height * 0.15 : height * 0.85;
    return `${x},${y}`;
  });
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points.join(" ")}
      />
    </svg>
  );
}

function generateIndicators(
  asset: Asset,
  livePrice: number,
): TechnicalIndicators {
  const basePrice = asset.price;
  const pricePct = (livePrice - basePrice) / basePrice;

  const trendRaw = asset.change24h + pricePct * 100;
  const trend: "Bullish" | "Bearish" | "Neutral" =
    trendRaw > 0.5 ? "Bullish" : trendRaw < -0.5 ? "Bearish" : "Neutral";
  const trendStrength = Math.min(100, Math.abs(trendRaw) * 20 + 30);

  const rsiBase = 50 + trendRaw * 8;
  const rsi = Math.max(5, Math.min(95, rsiBase + (Math.random() - 0.5) * 10));
  const rsiSignal: "Overbought" | "Oversold" | "Neutral" =
    rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral";

  const macdValue = (pricePct * 1000 + (Math.random() - 0.5) * 2).toFixed(4);
  const macdSignalVal = (
    parseFloat(macdValue) -
    (Math.random() - 0.3) * 0.5
  ).toFixed(4);
  const histogramVal = (
    parseFloat(macdValue) - parseFloat(macdSignalVal)
  ).toFixed(4);
  const macdCrossover: "Bullish" | "Bearish" | "Neutral" =
    parseFloat(histogramVal) > 0.05
      ? "Bullish"
      : parseFloat(histogramVal) < -0.05
        ? "Bearish"
        : "Neutral";

  const ma20 = basePrice * (0.995 + Math.random() * 0.015);
  const ma50 = basePrice * (0.985 + Math.random() * 0.025);
  const ma200 = basePrice * (0.95 + Math.random() * 0.07);
  const maSignal: "Bullish" | "Bearish" | "Neutral" =
    ma20 > ma50 && ma50 > ma200
      ? "Bullish"
      : ma20 < ma50 && ma50 < ma200
        ? "Bearish"
        : "Neutral";

  const support = basePrice * (0.95 + Math.random() * 0.03);
  const resistance = basePrice * (1.02 + Math.random() * 0.05);

  const volatility = 1.2 + Math.abs(asset.change24h) * 2 + Math.random() * 1.5;
  const volatilityLevel: "Low" | "Medium" | "High" =
    volatility < 2 ? "Low" : volatility < 4 ? "Medium" : "High";

  const atr = basePrice * (volatility / 100) * 0.02;

  return {
    trend,
    trendStrength,
    rsi: parseFloat(rsi.toFixed(2)),
    rsiSignal,
    macd: {
      value: parseFloat(macdValue),
      signal: parseFloat(macdSignalVal),
      histogram: parseFloat(histogramVal),
      crossover: macdCrossover,
    },
    ma20: parseFloat(ma20.toFixed(4)),
    ma50: parseFloat(ma50.toFixed(4)),
    ma200: parseFloat(ma200.toFixed(4)),
    maSignal,
    support: parseFloat(support.toFixed(4)),
    resistance: parseFloat(resistance.toFixed(4)),
    volatility: parseFloat(volatility.toFixed(2)),
    volatilityLevel,
    atr: parseFloat(atr.toFixed(4)),
  };
}

function formatPrice(n: number): string {
  if (n < 1) return n.toFixed(4);
  if (n < 100) return n.toFixed(2);
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function IndicatorBadge({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: "bullish" | "bearish" | "neutral";
}) {
  const colors = {
    bullish: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    bearish: "bg-red-500/15 text-red-400 border-red-500/30",
    neutral: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  };
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2 ${colors[type]}`}
    >
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}

function ProgressBar({
  value,
  color,
}: {
  value: number;
  color: "emerald" | "red" | "blue" | "amber";
}) {
  const bg = {
    emerald: "bg-emerald-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
  }[color];
  return (
    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className={`h-full ${bg} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default function TradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);

  const [assetTab, setAssetTab] = useState<
    "all" | "crypto" | "forex" | "commodity"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [timeframe, setTimeframe] = useState("1M");
  const [chartStyle, setChartStyle] = useState("1");
  const [direction, setDirection] = useState<"CALL" | "PUT">("CALL");
  const [investment, setInvestment] = useState("100");
  const [expirySec, setExpirySec] = useState(60);
  const [countdown, setCountdown] = useState(28);
  const [livePrice, setLivePrice] = useState(selectedAsset.price);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicators>(() =>
    generateIndicators(selectedAsset, selectedAsset.price),
  );
  const [indicatorsVisible, setIndicatorsVisible] = useState(true);
  const [crosshairEnabled, setCrosshairEnabled] = useState(true);

  const [now, setNow] = useState(() => Date.now());

  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);

  const unsubActiveRef = useRef<(() => void) | undefined>(undefined);
  const unsubHistoryRef = useRef<(() => void) | undefined>(undefined);
  const unsubAuthRef = useRef<(() => void) | undefined>(undefined);

  const chartContainer = useRef<HTMLDivElement>(null);
  const chartRenderKey = useRef(0);
  const chartLoadToken = useRef(0);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        if (unsubActiveRef.current) {
          unsubActiveRef.current();
          unsubActiveRef.current = undefined;
        }
        if (unsubHistoryRef.current) {
          unsubHistoryRef.current();
          unsubHistoryRef.current = undefined;
        }
        router.replace("/login");
        return;
      }
      setUser(currentUser);
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }

      if (unsubActiveRef.current) {
        unsubActiveRef.current();
        unsubActiveRef.current = undefined;
      }
      if (unsubHistoryRef.current) {
        unsubHistoryRef.current();
        unsubHistoryRef.current = undefined;
      }

      const activeQuery = query(
        collection(db, "trades"),
        where("userId", "==", currentUser.uid),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(20),
      );

      const historyQuery = query(
        collection(db, "trades"),
        where("userId", "==", currentUser.uid),
        where("status", "in", ["won", "lost"]),
        orderBy("createdAt", "desc"),
        limit(50),
      );

      const snapshotErrorHandler = (error: any) => {
        if (
          error?.code === "permission-denied" ||
          error?.code === "unauthenticated"
        ) {
          return;
        }
        console.error("Firestore snapshot error:", error);
      };

      unsubActiveRef.current = onSnapshot(
        activeQuery,
        (snapshot) => {
          const trades: ActiveTrade[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: `t-${d.id}`,
              firestoreId: d.id,
              asset: data.asset,
              direction: data.direction,
              investment: data.investment,
              entryPrice: data.entryPrice,
              currentPrice: data.entryPrice,
              expiry: data.expirySeconds || 60,
              startTime: data.createdAt?.toDate?.()?.getTime() || Date.now(),
              status: data.status,
            };
          });
          setActiveTrades(trades);
        },
        snapshotErrorHandler,
      );

      unsubHistoryRef.current = onSnapshot(
        historyQuery,
        (snapshot) => {
          const history: TradeHistoryItem[] = snapshot.docs.map((d) => {
            const data = d.data();
            const dDate = data.createdAt?.toDate?.() || new Date();
            return {
              id: `h-${d.id}`,
              firestoreId: d.id,
              asset: data.asset,
              direction: data.direction,
              amount: data.investment,
              payout:
                data.payout ||
                (data.status === "won"
                  ? data.investment * (1 + PAYOUT_RATE)
                  : 0),
              result: data.status,
              time: dDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
              entryPrice: data.entryPrice,
              exitPrice: data.exitPrice,
            };
          });
          setTradeHistory(history);
        },
        snapshotErrorHandler,
      );

      setLoading(false);
    });

    unsubAuthRef.current = unsubscribeAuth;

    return () => {
      unsubscribeAuth();
      if (unsubActiveRef.current) {
        unsubActiveRef.current();
        unsubActiveRef.current = undefined;
      }
      if (unsubHistoryRef.current) {
        unsubHistoryRef.current();
        unsubHistoryRef.current = undefined;
      }
    };
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      setLivePrice((prev) => {
        const delta = (Math.random() - 0.5) * prev * 0.0005;
        return prev + delta;
      });
      setCountdown((c) => (c <= 1 ? 28 : c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIndicators(generateIndicators(selectedAsset, livePrice));
  }, [selectedAsset, livePrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      const db = getFirebaseFirestore();

      setActiveTrades((trades): ActiveTrade[] => {
        const updated: ActiveTrade[] = [];

        for (const t of trades) {
          const elapsed = (Date.now() - t.startTime) / 1000;
          const remaining = Math.max(0, t.expiry - elapsed);
          const priceDelta = (Math.random() - 0.5) * t.currentPrice * 0.001;
          const newCurrent = Math.max(0.0001, t.currentPrice + priceDelta);

          if (remaining <= 0 && t.status === "active") {
            const isWin =
              t.direction === "CALL"
                ? newCurrent > t.entryPrice
                : newCurrent < t.entryPrice;
            const pnl = isWin ? t.investment * PAYOUT_RATE : -t.investment;
            const d = new Date();
            const timeStr = d.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

            const fallbackId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            const historyId = t.firestoreId
              ? `h-${t.firestoreId}`
              : `h-${fallbackId}`;

            setTradeHistory((h) => [
              {
                id: historyId,
                firestoreId: t.firestoreId,
                asset: t.asset,
                direction: t.direction,
                amount: t.investment,
                payout: isWin ? t.investment + t.investment * PAYOUT_RATE : 0,
                result: isWin ? "won" : "lost",
                time: timeStr,
                entryPrice: t.entryPrice,
                exitPrice: newCurrent,
              },
              ...h.filter((existing) => {
                if (!t.firestoreId) return true;
                return (
                  existing.firestoreId !== t.firestoreId &&
                  existing.id !== historyId
                );
              }),
            ]);

            if (t.firestoreId && user?.uid) {
              setDoc(
                doc(db, "trades", t.firestoreId),
                {
                  status: isWin ? "won" : "lost",
                  exitPrice: newCurrent,
                  payout: isWin ? t.investment * (1 + PAYOUT_RATE) : 0,
                  pnl,
                  settledAt: serverTimestamp(),
                },
                { merge: true },
              ).catch(console.error);

              setDoc(
                doc(db, "users", user.uid),
                {
                  balance:
                    (profile?.balance || 0) + (isWin ? t.investment + pnl : 0),
                  totalEarnings:
                    (profile?.totalEarnings || 0) + Math.max(0, pnl),
                  totalTrades: (profile?.totalTrades || 0) + 1,
                },
                { merge: true },
              ).catch(console.error);

              setProfile((p) => ({
                ...p,
                balance: (p?.balance || 0) + (isWin ? t.investment + pnl : 0),
                totalEarnings: (p?.totalEarnings || 0) + Math.max(0, pnl),
                totalTrades: (p?.totalTrades || 0) + 1,
              }));
            }

            const resolvedStatus: "won" | "lost" = isWin ? "won" : "lost";
            updated.push({
              ...t,
              status: resolvedStatus,
              pnl,
              currentPrice: newCurrent,
            });
          } else {
            updated.push({ ...t, currentPrice: newCurrent });
          }
        }

        return updated.filter((t) => t.status === "active");
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [
    user?.uid,
    profile?.balance,
    profile?.totalEarnings,
    profile?.totalTrades,
  ]);

  const loadChart = () => {
    if (!chartContainer.current || loading) return;
    const token = ++chartLoadToken.current;
    const container = chartContainer.current;
    const { clientWidth, clientHeight } = container;

    container.innerHTML = "";
    const widgetRoot = document.createElement("div");
    widgetRoot.className = "tradingview-widget-container__widget h-full w-full";
    widgetRoot.style.width = "100%";
    widgetRoot.style.height = "100%";
    container.appendChild(widgetRoot);

    const intervalMap: Record<string, string> = {
      "1M": "1",
      "5M": "5",
      "15M": "15",
      "1H": "60",
      "4H": "240",
      "1D": "D",
    };

    chartRenderKey.current += 1;
    const script = document.createElement("script");
    script.id = `tv-script-${chartRenderKey.current}`;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    const cfg = {
      width: clientWidth > 0 ? clientWidth : "100%",
      height: clientHeight > 0 ? clientHeight : "100%",
      symbol: selectedAsset.tvSymbol,
      interval: intervalMap[timeframe] || "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: chartStyle,
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: false,
      calendar: false,
      hide_side_toolbar: !crosshairEnabled,
      save_image: false,
      studies: indicatorsVisible
        ? [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "MASimple@tv-basicstudies",
          ]
        : [],
      support_host: "https://www.tradingview.com",
      container_id: widgetRoot.id,
    };
    script.innerHTML = JSON.stringify(cfg);
    script.onload = () => {
      if (chartLoadToken.current !== token) {
        const wrapper = container.querySelector(
          ".tradingview-widget-container__widget",
        );
        if (wrapper) wrapper.innerHTML = "";
      }
    };
    container.appendChild(script);
    setLivePrice(selectedAsset.price);
  };

  useEffect(() => {
    loadChart();
  }, [
    selectedAsset,
    timeframe,
    chartStyle,
    loading,
    indicatorsVisible,
    crosshairEnabled,
  ]);

  const filteredAssets = useMemo(() => {
    return ASSETS.filter((a) => {
      const matchTab =
        assetTab === "all"
          ? true
          : assetTab === "crypto"
            ? a.category === "crypto"
            : assetTab === "forex"
              ? a.category === "forex"
              : a.category === "commodity";
      const matchSearch =
        !searchQuery ||
        a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [assetTab, searchQuery]);

  const totalVolume = useMemo(
    () => tradeHistory.reduce((s, h) => s + h.amount, 0) * 120,
    [tradeHistory],
  );
  const netPnL = useMemo(
    () =>
      tradeHistory.reduce(
        (s, h) => s + (h.result === "won" ? h.amount * PAYOUT_RATE : -h.amount),
        0,
      ),
    [tradeHistory],
  );
  const payoutAmount = parseFloat(investment || "0") * (1 + PAYOUT_RATE);
  const winsCount = tradeHistory.filter((h) => h.result === "won").length;
  const winRate =
    tradeHistory.length > 0
      ? Math.round((winsCount / tradeHistory.length) * 100)
      : profile?.winRate || 0;

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePlaceTrade = async () => {
    const amount = parseFloat(investment);
    if (!amount || amount <= 0) {
      showNotification("error", "Please enter a valid investment amount.");
      return;
    }
    if (profile?.balance !== undefined && amount > profile.balance) {
      showNotification("error", "Insufficient balance for this trade.");
      return;
    }
    if (!user) return;

    try {
      const db = getFirebaseFirestore();
      const docRef = await addDoc(collection(db, "trades"), {
        userId: user.uid,
        userEmail: profile?.email || user.email,
        asset: selectedAsset.symbol,
        assetName: selectedAsset.name,
        tvSymbol: selectedAsset.tvSymbol,
        direction,
        investment: amount,
        entryPrice: livePrice,
        expirySeconds: expirySec,
        timeframe,
        status: "active",
        payoutRate: PAYOUT_RATE,
        indicators: {
          trend: indicators.trend,
          rsi: indicators.rsi,
          macd: indicators.macd.value,
          support: indicators.support,
          resistance: indicators.resistance,
        },
        createdAt: serverTimestamp(),
      });

      const newTrade: ActiveTrade = {
        id: `t-${docRef.id}`,
        firestoreId: docRef.id,
        asset: selectedAsset.symbol,
        direction,
        investment: amount,
        entryPrice: livePrice,
        currentPrice: livePrice,
        expiry: expirySec,
        startTime: Date.now(),
        status: "active",
      };
      setActiveTrades((t) => [newTrade, ...t]);

      await setDoc(
        doc(db, "users", user.uid),
        {
          balance: (profile?.balance || 0) - amount,
        },
        { merge: true },
      );
      setProfile((p) => ({
        ...p,
        balance: (p?.balance || 0) - amount,
      }));

      showNotification(
        "success",
        `${direction} trade of ${formatCurrency(amount)} on ${selectedAsset.symbol} placed!`,
      );
    } catch (err) {
      console.error("Trade save error:", err);
      showNotification("error", "Failed to place trade. Please try again.");
    }
  };

  const handleCloseTrade = (id: string) => {
    const db = getFirebaseFirestore();
    const trade = activeTrades.find((t) => t.id === id);
    setActiveTrades((trades) =>
      trades.filter((t) => t.id !== id).map((t) => t),
    );
    if (trade) {
      const current = trade.currentPrice;
      const isWin =
        trade.direction === "CALL"
          ? current > trade.entryPrice
          : current < trade.entryPrice;
      const pnl = isWin ? trade.investment * PAYOUT_RATE : -trade.investment;
      const now = new Date();
      setTradeHistory((h) => [
        {
          id: `h${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          asset: trade.asset,
          direction: trade.direction,
          amount: trade.investment,
          payout: isWin ? trade.investment + trade.investment * PAYOUT_RATE : 0,
          result: isWin ? "won" : "lost",
          time: now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          entryPrice: trade.entryPrice,
          exitPrice: current,
        },
        ...h,
      ]);

      if (trade.firestoreId && user?.uid) {
        setDoc(
          doc(db, "trades", trade.firestoreId),
          {
            status: isWin ? "won" : "lost",
            exitPrice: current,
            payout: isWin ? trade.investment * (1 + PAYOUT_RATE) : 0,
            pnl,
            settledAt: serverTimestamp(),
            closedManually: true,
          },
          { merge: true },
        ).catch(console.error);

        setDoc(
          doc(db, "users", user.uid),
          {
            balance:
              (profile?.balance || 0) + (isWin ? trade.investment + pnl : 0),
            totalEarnings: (profile?.totalEarnings || 0) + Math.max(0, pnl),
            totalTrades: (profile?.totalTrades || 0) + 1,
          },
          { merge: true },
        ).catch(console.error);

        setProfile((p) => ({
          ...p,
          balance: (p?.balance || 0) + (isWin ? trade.investment + pnl : 0),
          totalEarnings: (p?.totalEarnings || 0) + Math.max(0, pnl),
          totalTrades: (p?.totalTrades || 0) + 1,
        }));
      }

      showNotification(
        isWin ? "success" : "error",
        `Trade closed ${isWin ? "in profit" : "at a loss"}: ${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}`,
      );
    }
  };

  const rsiColor =
    indicators.rsi > 70 ? "red" : indicators.rsi < 30 ? "emerald" : "blue";
  const trendColor =
    indicators.trend === "Bullish"
      ? "emerald"
      : indicators.trend === "Bearish"
        ? "red"
        : "amber";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">
            Loading trade desk...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1800px] p-4 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-50">
              Trade Now
            </h1>
            <p className="text-sm text-slate-400">
              Execute trades on global markets with advanced analysis tools
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
              <Target className="h-4 w-4 text-indigo-400" />
              <span className="text-xs text-slate-400">Win Rate</span>
              <span className="text-sm font-bold text-indigo-400">
                {winRate}%
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <span className="text-xs text-slate-400">Account Mode</span>
              <span className="text-sm font-bold text-emerald-400">
                LIVE ACCOUNT
              </span>
            </div>
            <button className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
              SWITCH
            </button>
          </div>
        </div>

        {notification && (
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
              notification.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto p-1 hover:bg-white/5 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Available Balance</p>
                <p className="text-lg font-bold text-slate-50">
                  {formatCurrency(profile?.balance || 2450.75)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Active Trades</p>
                <p className="text-lg font-bold text-slate-50">
                  {activeTrades.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Volume</p>
                <p className="text-lg font-bold text-slate-50">
                  {formatCurrency(totalVolume || 25430.5)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Net P&L</p>
                <p
                  className={`text-lg font-bold ${
                    (netPnL || 350.45) >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {(netPnL || 350.45) >= 0 ? "+" : ""}
                  {formatCurrency(netPnL || 350.45)}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Trades</p>
                <p className="text-lg font-bold text-slate-50">
                  {profile?.totalTrades || tradeHistory.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3 xl:col-span-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4 flex flex-col">
            <h2 className="text-sm font-bold text-slate-200 mb-3">
              Select Asset
            </h2>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-1.5 mb-3">
              {(["all", "crypto", "forex", "Commodities"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setAssetTab(tab === "Commodities" ? "commodity" : tab)
                    }
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      assetTab === (tab === "Commodities" ? "commodity" : tab)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {tab === "all" ? "All" : tab}
                  </button>
                ),
              )}
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[62vh] min-h-[540px]">
              {filteredAssets.map((asset) => {
                const positive = asset.change24h >= 0;
                const isSelected = selectedAsset.symbol === asset.symbol;
                return (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`w-full rounded-xl p-3 text-left transition-colors ${
                      isSelected
                        ? "bg-emerald-500/10 ring-1 ring-emerald-500/40"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: `${asset.color}20`,
                          color: asset.color,
                        }}
                      >
                        {asset.symbol.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-100 truncate">
                          {asset.symbol}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {asset.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-100 tabular-nums">
                          {asset.price < 1
                            ? asset.price.toFixed(4)
                            : asset.price < 100
                              ? asset.price.toFixed(2)
                              : formatCompact(asset.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-12">
                      <MiniChart
                        trend={asset.miniTrend}
                        positive={positive}
                        width={70}
                        height={22}
                      />
                      <div className="flex-1" />
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
                          positive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {positive ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        {positive ? "+" : ""}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <button className="mt-3 w-full rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-blue-400 hover:bg-slate-700 transition-colors">
              View More Assets
            </button>
          </div>

          <div className="col-span-12 lg:col-span-6 xl:col-span-6 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                    style={{
                      backgroundColor: `${selectedAsset.color}20`,
                      color: selectedAsset.color,
                    }}
                  >
                    {selectedAsset.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-50">
                        {selectedAsset.symbol}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          indicators.trend === "Bullish"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : indicators.trend === "Bearish"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {indicators.trend === "Bullish" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : indicators.trend === "Bearish" ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : (
                          <Activity className="h-3 w-3" />
                        )}
                        {indicators.trend}
                      </span>
                      <button className="text-slate-400 hover:text-amber-400 transition-colors">
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-500">
                      {selectedAsset.name} · Spot · {timeframe}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-start gap-4 sm:gap-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                        {formatPrice(livePrice)}
                      </p>
                      <span
                        className={`text-lg font-bold ${
                          selectedAsset.change24h >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {selectedAsset.change24h >= 0 ? "▲" : "▼"}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        selectedAsset.change24h >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedAsset.change24h >= 0 ? "+" : ""}
                      {selectedAsset.change24h.toFixed(2)}% 24h
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-slate-500">24H High</p>
                      <p className="text-sm font-semibold text-slate-200">
                        {formatPrice(selectedAsset.price * 1.0068)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">24H Low</p>
                      <p className="text-sm font-semibold text-slate-200">
                        {formatPrice(selectedAsset.price * 0.9776)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">24H Volume</p>
                      <p className="text-sm font-semibold text-slate-200">
                        {formatCompact(selectedAsset.price * 0.182)}{" "}
                        {selectedAsset.symbol.startsWith("BTC") ? "BTC" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-slate-500">Candle closes in</p>
                    <div className="mt-1 rounded-xl border border-emerald-500/20 bg-slate-950 px-4 py-2 text-center">
                      <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                        00:{countdown.toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-3 mb-3">
                <div className="flex gap-1 rounded-xl bg-slate-950 p-1">
                  {TIMEFRAMES.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        timeframe === tf
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                <div className="h-6 w-px bg-white/10 mx-1" />

                <div className="flex gap-1 rounded-xl bg-slate-950 p-1">
                  {CHART_STYLES.map(({ id, name, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setChartStyle(id)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        chartStyle === id
                          ? "bg-violet-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      title={name}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCrosshairEnabled((v) => !v);
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    crosshairEnabled
                      ? "bg-slate-800 text-slate-200"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                  title="Toggle Crosshair"
                >
                  <Crosshair className="h-4 w-4" />
                  Crosshair
                </button>

                <button
                  onClick={() => setIndicatorsVisible((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    indicatorsVisible
                      ? "bg-slate-800 text-slate-200"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  Indicators
                </button>

                <button
                  onClick={() => loadChart()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                  title="Refresh Chart"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>

                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              <div
                className="tradingview-widget-container h-[65vh] min-h-[620px] w-full rounded-xl overflow-hidden bg-slate-950"
                ref={chartContainer}
              >
                <div
                  className="tradingview-widget-container__widget h-full w-full"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                    <Gauge className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Market Analysis
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Updated live · {selectedAsset.symbol}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trend
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        indicators.trend === "Bullish"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : indicators.trend === "Bearish"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {indicators.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-50 mb-2">
                    {Math.round(indicators.trendStrength)}%
                  </p>
                  <ProgressBar
                    value={indicators.trendStrength}
                    color={trendColor as any}
                  />
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5" />
                      RSI (14)
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        indicators.rsiSignal === "Overbought"
                          ? "bg-red-500/15 text-red-400"
                          : indicators.rsiSignal === "Oversold"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-slate-500/15 text-slate-400"
                      }`}
                    >
                      {indicators.rsiSignal}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-50 mb-2 tabular-nums">
                    {indicators.rsi}
                  </p>
                  <ProgressBar value={indicators.rsi} color={rsiColor as any} />
                  <div className="flex justify-between mt-1 text-[10px] text-slate-600">
                    <span>30</span>
                    <span>50</span>
                    <span>70</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Waves className="h-3.5 w-3.5" />
                      MACD
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        indicators.macd.crossover === "Bullish"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : indicators.macd.crossover === "Bearish"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-slate-500/15 text-slate-400"
                      }`}
                    >
                      {indicators.macd.crossover}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-500">MACD:</span>
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          indicators.macd.value >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {indicators.macd.value.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-500">
                        Signal:
                      </span>
                      <span className="text-xs font-semibold text-slate-300 tabular-nums">
                        {indicators.macd.signal.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-500">Hist:</span>
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          indicators.macd.histogram >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {indicators.macd.histogram >= 0 ? "+" : ""}
                        {indicators.macd.histogram.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <BarChart3 className="h-3.5 w-3.5" />
                      Volatility
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        indicators.volatilityLevel === "High"
                          ? "bg-red-500/15 text-red-400"
                          : indicators.volatilityLevel === "Medium"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      {indicators.volatilityLevel}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-50 mb-1 tabular-nums">
                    {indicators.volatility}%
                  </p>
                  <p className="text-[11px] text-slate-500 mb-2">
                    ATR: {formatPrice(indicators.atr)}
                  </p>
                  <ProgressBar
                    value={Math.min(100, indicators.volatility * 10)}
                    color={
                      indicators.volatilityLevel === "High"
                        ? "red"
                        : indicators.volatilityLevel === "Medium"
                          ? "amber"
                          : "emerald"
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    Moving Averages
                  </h4>
                  <div className="space-y-2.5 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-8 rounded bg-emerald-500" />
                        <span className="text-xs text-slate-500">MA 20</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-200 tabular-nums">
                        {formatPrice(indicators.ma20)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-8 rounded bg-blue-500" />
                        <span className="text-xs text-slate-500">MA 50</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-200 tabular-nums">
                        {formatPrice(indicators.ma50)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-8 rounded bg-violet-500" />
                        <span className="text-xs text-slate-500">MA 200</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-200 tabular-nums">
                        {formatPrice(indicators.ma200)}
                      </span>
                    </div>
                  </div>
                  <IndicatorBadge
                    label="MA Signal"
                    value={indicators.maSignal}
                    type={
                      indicators.maSignal === "Bullish"
                        ? "bullish"
                        : indicators.maSignal === "Bearish"
                          ? "bearish"
                          : "neutral"
                    }
                  />
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    Key Levels
                  </h4>
                  <div className="space-y-3 mb-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Resistance
                        </span>
                        <span className="text-sm font-bold text-red-400 tabular-nums">
                          {formatPrice(indicators.resistance)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-red-500/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500/60 to-red-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                ((indicators.resistance - livePrice) /
                                  (indicators.resistance -
                                    indicators.support)) *
                                  100,
                              ),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-1">
                      <div className="flex items-center gap-2 rounded-full bg-slate-800/50 px-3 py-1">
                        <span className="text-[10px] text-slate-500">
                          Current
                        </span>
                        <span className="text-sm font-bold text-slate-100 tabular-nums">
                          {formatPrice(livePrice)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="h-1.5 w-full rounded-full bg-emerald-500/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-500/60 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                ((livePrice - indicators.support) /
                                  (indicators.resistance -
                                    indicators.support)) *
                                  100,
                              ),
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Support
                        </span>
                        <span className="text-sm font-bold text-emerald-400 tabular-nums">
                          {formatPrice(indicators.support)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <IndicatorBadge
                      label="Distance to S"
                      value={`${(((livePrice - indicators.support) / livePrice) * 100).toFixed(2)}%`}
                      type="bullish"
                    />
                    <IndicatorBadge
                      label="Distance to R"
                      value={`${(((indicators.resistance - livePrice) / livePrice) * 100).toFixed(2)}%`}
                      type="bearish"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <IndicatorBadge
                  label="Trend"
                  value={indicators.trend}
                  type={
                    indicators.trend === "Bullish"
                      ? "bullish"
                      : indicators.trend === "Bearish"
                        ? "bearish"
                        : "neutral"
                  }
                />
                <IndicatorBadge
                  label="RSI"
                  value={indicators.rsi.toFixed(1)}
                  type={
                    indicators.rsiSignal === "Overbought"
                      ? "bearish"
                      : indicators.rsiSignal === "Oversold"
                        ? "bullish"
                        : "neutral"
                  }
                />
                <IndicatorBadge
                  label="MACD"
                  value={indicators.macd.crossover}
                  type={
                    indicators.macd.crossover === "Bullish"
                      ? "bullish"
                      : indicators.macd.crossover === "Bearish"
                        ? "bearish"
                        : "neutral"
                  }
                />
                <IndicatorBadge
                  label="MA"
                  value={indicators.maSignal}
                  type={
                    indicators.maSignal === "Bullish"
                      ? "bullish"
                      : indicators.maSignal === "Bearish"
                        ? "bearish"
                        : "neutral"
                  }
                />
                <IndicatorBadge
                  label="Volatility"
                  value={indicators.volatilityLevel}
                  type={
                    indicators.volatilityLevel === "High"
                      ? "bearish"
                      : indicators.volatilityLevel === "Low"
                        ? "bullish"
                        : "neutral"
                  }
                />
                <IndicatorBadge
                  label="Overall"
                  value={
                    (indicators.trend === "Bullish" ? 1 : -1) +
                      (indicators.rsiSignal === "Oversold"
                        ? 1
                        : indicators.rsiSignal === "Overbought"
                          ? -1
                          : 0) +
                      (indicators.maSignal === "Bullish" ? 1 : -1) >=
                    1
                      ? "BUY"
                      : (indicators.trend === "Bearish" ? 1 : -1) +
                            (indicators.rsiSignal === "Overbought"
                              ? 1
                              : indicators.rsiSignal === "Oversold"
                                ? -1
                                : 0) +
                            (indicators.maSignal === "Bearish" ? 1 : -1) >=
                          1
                        ? "SELL"
                        : "HOLD"
                  }
                  type={
                    (indicators.trend === "Bullish" ? 1 : -1) +
                      (indicators.rsiSignal === "Oversold"
                        ? 1
                        : indicators.rsiSignal === "Overbought"
                          ? -1
                          : 0) +
                      (indicators.maSignal === "Bullish" ? 1 : -1) >=
                    1
                      ? "bullish"
                      : (indicators.trend === "Bearish" ? 1 : -1) +
                            (indicators.rsiSignal === "Overbought"
                              ? 1
                              : indicators.rsiSignal === "Oversold"
                                ? -1
                                : 0) +
                            (indicators.maSignal === "Bearish" ? 1 : -1) >=
                          1
                        ? "bearish"
                        : "neutral"
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-200">
                    Active Trades ({activeTrades.length})
                  </h3>
                  <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                    View All Active Trades
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-white/5">
                        <th className="py-2 px-2 font-medium">Asset</th>
                        <th className="py-2 px-2 font-medium">Direction</th>
                        <th className="py-2 px-2 font-medium">Investment</th>
                        <th className="py-2 px-2 font-medium">Entry Price</th>
                        <th className="py-2 px-2 font-medium">Current Price</th>
                        <th className="py-2 px-2 font-medium">Time Left</th>
                        <th className="py-2 px-2 font-medium">Status</th>
                        <th className="py-2 px-2 font-medium">P&L</th>
                        <th className="py-2 px-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTrades.length === 0 && (
                        <tr>
                          <td
                            colSpan={9}
                            className="py-8 text-center text-slate-500"
                          >
                            No active trades. Place a trade to get started!
                          </td>
                        </tr>
                      )}
                      {activeTrades.map((t) => {
                        const elapsed = (now - t.startTime) / 1000;
                        const remaining = Math.max(0, t.expiry - elapsed);
                        const progress = Math.min(1, elapsed / t.expiry);
                        const inProfit =
                          t.direction === "CALL"
                            ? t.currentPrice > t.entryPrice
                            : t.currentPrice < t.entryPrice;
                        const unrealized = inProfit
                          ? t.investment * PAYOUT_RATE
                          : -t.investment;
                        return (
                          <tr
                            key={t.id}
                            className="border-b border-white/5 last:border-0"
                          >
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-6 w-6 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: `${
                                      ASSETS.find((a) => a.symbol === t.asset)
                                        ?.color || "#888"
                                    }30`,
                                    color:
                                      ASSETS.find((a) => a.symbol === t.asset)
                                        ?.color || "#888",
                                  }}
                                />
                                <span className="font-semibold text-slate-200">
                                  {t.asset}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  t.direction === "CALL"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {t.direction === "CALL" ? (
                                  <ChevronUp className="h-3 w-3" />
                                ) : (
                                  <ChevronDown className="h-3 w-3" />
                                )}
                                {t.direction}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-medium text-slate-300">
                              {formatCurrency(t.investment)}
                            </td>
                            <td className="py-3 px-2 text-slate-400 tabular-nums">
                              {formatPrice(t.entryPrice)}
                            </td>
                            <td
                              className={`py-3 px-2 font-semibold tabular-nums ${
                                inProfit ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {formatPrice(t.currentPrice)}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex flex-col items-center gap-1">
                                <div className="relative h-8 w-8">
                                  <svg
                                    className="h-8 w-8 -rotate-90"
                                    viewBox="0 0 36 36"
                                  >
                                    <circle
                                      cx="18"
                                      cy="18"
                                      r="15.9"
                                      fill="none"
                                      stroke="rgba(255,255,255,0.08)"
                                      strokeWidth="3"
                                    />
                                    <circle
                                      cx="18"
                                      cy="18"
                                      r="15.9"
                                      fill="none"
                                      stroke={
                                        remaining < 15 ? "#ef4444" : "#10b981"
                                      }
                                      strokeWidth="3"
                                      strokeDasharray={`${
                                        (1 - progress) * 100
                                      }, 100`}
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span
                                    className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums ${
                                      remaining < 15
                                        ? "text-red-400"
                                        : "text-emerald-400"
                                    }`}
                                  >
                                    {formatTime(Math.ceil(remaining))}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                                  inProfit
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {inProfit ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {inProfit ? "In Profit" : "In Loss"}
                              </span>
                            </td>
                            <td
                              className={`py-3 px-2 font-bold ${
                                unrealized >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {unrealized >= 0 ? "+" : ""}
                              {formatCurrency(unrealized)}
                            </td>
                            <td className="py-3 px-2">
                              <button
                                onClick={() => handleCloseTrade(t.id)}
                                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              >
                                Close
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-200">
                    Trade History
                  </h3>
                  <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-white/5">
                        <th className="py-2 px-2 font-medium">Asset</th>
                        <th className="py-2 px-2 font-medium">Direction</th>
                        <th className="py-2 px-2 font-medium">Amount</th>
                        <th className="py-2 px-2 font-medium">Payout</th>
                        <th className="py-2 px-2 font-medium">Result</th>
                        <th className="py-2 px-2 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-slate-500"
                          >
                            No trade history yet.
                          </td>
                        </tr>
                      )}
                      {tradeHistory.map((h) => (
                        <tr
                          key={h.id}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-6 w-6 shrink-0 rounded-full"
                                style={{
                                  backgroundColor: `${
                                    ASSETS.find((a) => a.symbol === h.asset)
                                      ?.color || "#888"
                                  }30`,
                                  color:
                                    ASSETS.find((a) => a.symbol === h.asset)
                                      ?.color || "#888",
                                }}
                              />
                              <span className="font-semibold text-slate-200">
                                {h.asset}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            <span
                              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                h.direction === "CALL"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {h.direction === "CALL" ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                              {h.direction}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 font-medium text-slate-300">
                            {formatCurrency(h.amount)}
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-emerald-400">
                            {formatCurrency(h.payout)}
                          </td>
                          <td className="py-2.5 px-2">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                                h.result === "won"
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {h.result === "won" ? (
                                <>
                                  <ChevronUp className="h-3 w-3" /> Won
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3" /> Lost
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-slate-500">
                            {h.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4 flex flex-col h-fit sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-100">
                Place Order
              </h2>
              <span className="text-sm font-bold text-blue-400">
                Payout: {Math.round(PAYOUT_RATE * 100)}%
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400 mb-2">
              Select Direction
            </p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => setDirection("CALL")}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3.5 font-bold transition-all ${
                  direction === "CALL"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/50"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                <ArrowUpRight className="h-6 w-6" />
                CALL
              </button>
              <button
                onClick={() => setDirection("PUT")}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3.5 font-bold transition-all ${
                  direction === "PUT"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20 ring-2 ring-red-400/50"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                <ArrowDownRight className="h-6 w-6" />
                PUT
              </button>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-950 p-3 mb-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Trend</p>
                  <p
                    className={`text-xs font-bold ${
                      indicators.trend === "Bullish"
                        ? "text-emerald-400"
                        : indicators.trend === "Bearish"
                          ? "text-red-400"
                          : "text-amber-400"
                    }`}
                  >
                    {indicators.trend}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">RSI</p>
                  <p className="text-xs font-bold text-slate-200 tabular-nums">
                    {indicators.rsi.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Signal</p>
                  <p
                    className={`text-xs font-bold ${
                      direction === "CALL" && indicators.trend === "Bullish"
                        ? "text-emerald-400"
                        : direction === "PUT" && indicators.trend === "Bearish"
                          ? "text-red-400"
                          : "text-amber-400"
                    }`}
                  >
                    {direction === "CALL" && indicators.trend === "Bullish"
                      ? "Align ✓"
                      : direction === "PUT" && indicators.trend === "Bearish"
                        ? "Align ✓"
                        : "Contrarian"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400">
                Investment Amount
              </p>
              <p className="text-xs text-slate-500">
                Balance: {formatCurrency(profile?.balance || 2450.75)}
              </p>
            </div>
            <div className="relative mb-3">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <DollarSign className="h-5 w-5" />
              </div>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-4 text-lg font-semibold text-slate-50 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {AMOUNT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setInvestment(preset.toString())}
                  className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                    investment === preset.toString()
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-slate-400 mb-2">
              Expiry Duration
            </p>
            <div className="grid grid-cols-6 gap-1.5 mb-5">
              {EXPIRY_OPTIONS.map((opt) => {
                const label = opt < 60 ? `${opt}s` : `${Math.floor(opt / 60)}m`;
                return (
                  <button
                    key={opt}
                    onClick={() => setExpirySec(opt)}
                    className={`rounded-lg py-2 text-xs font-semibold transition-colors ${
                      expirySec === opt
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-950 p-4 mb-4 text-center">
              <p className="text-xs text-slate-500 mb-1">
                You will get (Payout {Math.round(PAYOUT_RATE * 100)}%)
              </p>
              <p className="text-3xl font-bold text-emerald-400">
                {formatCurrency(isNaN(payoutAmount) ? 0 : payoutAmount)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Potential profit:{" "}
                <span className="text-emerald-400 font-semibold">
                  +
                  {formatCurrency(
                    (parseFloat(investment || "0") || 0) * PAYOUT_RATE,
                  )}
                </span>
              </p>
            </div>

            <button
              onClick={handlePlaceTrade}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] ${
                direction === "CALL"
                  ? "bg-emerald-600 shadow-emerald-600/30"
                  : "bg-red-600 shadow-red-600/30"
              }`}
            >
              <Zap className="h-5 w-5" />
              PLACE {direction} TRADE
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              Secure instant execution · Saved to database
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
