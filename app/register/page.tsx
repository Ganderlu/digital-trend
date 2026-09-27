"use client";

import {
  useState,
  useRef,
  type FormEvent,
  useEffect,
  Suspense,
  useMemo,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";
import geoData, {
  type ICountry,
  type IState,
  type ICity,
} from "countries-states-cities";
import {
  Rocket,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
  Sparkles,
  User,
  MapPin,
  Lock,
  Camera,
  Upload,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  UserRound,
  Globe,
  Phone,
  Hash,
  ShieldAlert,
  KeyRound,
  ChevronDown,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  {
    num: 1,
    title: "Personal Info",
    subtitle: "Basic details",
    Icon: UserRound,
  },
  {
    num: 2,
    title: "Location",
    subtitle: "Regional settings",
    Icon: MapPin,
  },
  {
    num: 3,
    title: "Security",
    subtitle: "Account protection",
    Icon: ShieldCheck,
  },
  {
    num: 4,
    title: "Verification",
    subtitle: "Profile photo",
    Icon: Camera,
  },
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [stepError, setStepError] = useState<string>("");

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState<number | null>(null);
  const [state, setState] = useState("");
  const [stateId, setStateId] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("English");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [profileImageDataUrl, setProfileImageDataUrl] = useState<string | null>(
    null,
  );
  const [profileFileName, setProfileFileName] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [referredBy, setReferredBy] = useState<string | null>(null);

  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState<boolean | null>(null);

  const countriesList = useMemo<ICountry[]>(
    () =>
      geoData.getAllCountries().sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const statesList = useMemo<IState[]>(() => {
    if (countryId == null) return [];
    return geoData
      .getStatesOfCountry(countryId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countryId]);
  const citiesList = useMemo<ICity[]>(() => {
    if (stateId == null) return [];
    return geoData
      .getCitiesOfState(stateId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [stateId]);

  const selectBase =
    "w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 pr-10 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500/40 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed";

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) setReferredBy(refCode);
  }, [searchParams]);

  const passwordScore = useMemo(() => {
    let s = 0;
    if (!password) return s;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const passwordColor =
    passwordScore >= 5
      ? "bg-emerald-500"
      : passwordScore >= 4
        ? "bg-sky-500"
        : passwordScore >= 3
          ? "bg-amber-500"
          : passwordScore >= 1
            ? "bg-orange-500"
            : "bg-slate-700";
  const passwordLabel =
    passwordScore >= 5
      ? "Strong"
      : passwordScore >= 4
        ? "Good"
        : passwordScore >= 3
          ? "Fair"
          : passwordScore >= 1
            ? "Weak"
            : "";
  const passwordLabelColor =
    passwordScore >= 5
      ? "text-emerald-400"
      : passwordScore >= 4
        ? "text-sky-400"
        : passwordScore >= 3
          ? "text-amber-400"
          : passwordScore >= 1
            ? "text-orange-400"
            : "text-slate-500";

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameTaken(null);
      setUsernameChecking(false);
      return;
    }
    const t = setTimeout(async () => {
      setUsernameChecking(true);
      try {
        const res = await fetch(
          `/api/users/check-username?username=${encodeURIComponent(username)}`,
        );
        const data = await res.json();
        if (data?.success && data?.checked) {
          setUsernameTaken(!data.available);
        } else {
          setUsernameTaken(null);
        }
      } catch {
        setUsernameTaken(null);
      } finally {
        setUsernameChecking(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [username]);

  function validateStep1(): string | null {
    const u = username.trim();
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    const ph = phone.trim();

    if (!u) return "Trading username is required.";
    if (u.length < 3) return "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9_.-]+$/.test(u))
      return "Username can only contain letters, numbers, and _ . -";
    if (usernameTaken) return "This username is already taken.";
    if (!fn) return "First name is required.";
    if (!ln) return "Last name is required.";
    if (!em) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
      return "Please enter a valid email address.";
    if (!ph) return "Phone number is required.";
    if (ph.replace(/\D/g, "").length < 7)
      return "Please enter a valid phone number.";
    return null;
  }

  function validateStep2(): string | null {
    if (!country.trim()) return "Country is required.";
    if (!state.trim()) return "State / Region is required.";
    if (!city.trim()) return "City is required.";
    return null;
  }

  function validateStep3(): string | null {
    if (!password) return "Password is required.";
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (passwordScore < 3)
      return "Password is too weak. Add uppercase, numbers, or symbols.";
    if (password !== confirmPassword)
      return "Passwords do not match. Please re-enter.";
    if (!acceptedTerms)
      return "You must accept the terms and policies to continue.";
    return null;
  }

  function validateStep4(): string | null {
    if (!profileImageDataUrl)
      return "Please upload a clear profile photo for verification.";
    return null;
  }

  function nextStep() {
    setStepError("");
    let err: string | null = null;
    if (step === 1) err = validateStep1();
    else if (step === 2) err = validateStep2();
    else if (step === 3) err = validateStep3();
    if (err) {
      setStepError(err);
      return;
    }
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }

  function prevStep() {
    setStepError("");
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  function handleFilePickClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setStepError("Please choose an image file (JPG, PNG, etc).");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setStepError("Image is too large. Max size is 5MB.");
      return;
    }
    setProfileFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setProfileImageDataUrl(result);
        setStepError("");
      }
    };
    reader.onerror = () => setStepError("Could not read selected image.");
    reader.readAsDataURL(f);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStepError("");
    setSuccess("");

    const step4Err = validateStep4();
    if (step4Err) {
      setStepError(step4Err);
      return;
    }

    setSubmitting(true);
    try {
      let locationData: Record<string, any> = {};
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          locationData = {
            ip: data.ip,
            cityAuto: data.city,
            regionAuto: data.region,
            countryAuto: data.country_name,
            provider: data.org,
          };
        }
      } catch (geoError) {
        console.error("Geolocation fetch failed:", geoError);
      }

      const auth = getFirebaseAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const uid = userCredential.user.uid;

      let photoURL: string | undefined;
      let photoPublicId: string | undefined;

      if (profileImageDataUrl) {
        setUploadingImage(true);
        try {
          const uploadRes = await fetch("/api/cloudinary/upload-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: profileImageDataUrl,
              userId: uid,
            }),
          });
          const uploadData = await uploadRes.json();
          if (uploadData?.success && uploadData?.data?.url) {
            photoURL = uploadData.data.url;
            photoPublicId = uploadData.data.publicId;
          } else {
            console.warn("Profile image upload reported failure:", uploadData);
          }
        } catch (uploadErr) {
          console.error("Profile image upload failed:", uploadErr);
        } finally {
          setUploadingImage(false);
        }
      }

      const token = await userCredential.user.getIdToken();

      const registerRes = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          usernameDisplay: username.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country.trim(),
          state: state.trim(),
          city: city.trim(),
          language: language.trim(),
          referredBy: referredBy || null,
          registrationLocation: locationData,
          photoURL: photoURL || null,
          photoPublicId: photoPublicId || null,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerData?.success) {
        throw new Error(
          registerData?.error || "Failed to create user profile.",
        );
      }

      try {
        const constructedName = `${firstName.trim()} ${lastName.trim()}`.trim();
        await updateProfile(userCredential.user, {
          displayName: constructedName || username.trim(),
          photoURL: photoURL || null,
        });
      } catch (profileErr) {
        console.warn("Firebase Auth profile update skipped:", profileErr);
      }

      if (photoURL) {
        try {
          const LS_KEY = "user:profile-photo-url:" + uid;
          const LS_PUBLIC_ID_KEY = "user:profile-photo-public-id:" + uid;
          window.localStorage.setItem(LS_KEY, photoURL);
          if (photoPublicId) {
            window.localStorage.setItem(LS_PUBLIC_ID_KEY, photoPublicId);
          }
          window.dispatchEvent(
            new CustomEvent("profile-photo-updated", {
              detail: { userId: uid },
            }),
          );
        } catch (lsErr) {
          console.warn("LocalStorage photo cache save skipped:", lsErr);
        }
      }

      try {
        await fetch("/api/notifications/welcome", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {}

      setSuccess(
        "Account created successfully! Your profile photo is pending verification. Redirecting to login...",
      );
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 3500);
    } catch (registrationError: unknown) {
      if (
        typeof registrationError === "object" &&
        registrationError &&
        "message" in registrationError
      ) {
        const msg = String((registrationError as { message: unknown }).message);
        if (
          msg.includes("email-already-in-use") ||
          msg.includes("auth/email-already-in-use")
        ) {
          setStepError(
            "This email is already registered. Please sign in instead.",
          );
        } else {
          setStepError(msg);
        }
      } else {
        setStepError("Something went wrong while creating your account.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function StepIndicator() {
    return (
      <div className="mb-7">
        <ol className="relative grid grid-cols-4 gap-1 sm:gap-3">
          {STEPS.map((s, idx) => {
            const active = step === s.num;
            const done = step > s.num;
            const ring = active
              ? "ring-4 ring-emerald-500/25"
              : done
                ? "ring-0"
                : "ring-0";
            const bg = active
              ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
              : done
                ? "bg-emerald-500 text-white border-emerald-400"
                : "bg-slate-800/80 text-slate-400 border-white/10";
            const showConnector = idx < STEPS.length - 1;
            const connectorDone = done;
            return (
              <li
                key={s.num}
                className="relative flex flex-col items-center text-center"
              >
                {showConnector && (
                  <div
                    className={`pointer-events-none absolute left-[calc(50%+18px)] top-[22px] right-[-50%] hidden sm:block h-0.5 ${
                      connectorDone ? "bg-emerald-500" : "bg-slate-800"
                    }`}
                    aria-hidden
                  />
                )}
                <div
                  className={`relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border-2 transition-all ${bg} ${ring}`}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <s.Icon
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      strokeWidth={2.4}
                    />
                  )}
                </div>
                <div className="mt-2 w-full">
                  <p
                    className={`text-[10px] sm:text-xs font-black tracking-tight ${
                      active
                        ? "text-white"
                        : done
                          ? "text-emerald-300"
                          : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="hidden sm:block text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {s.subtitle}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-5 grid grid-cols-3 gap-1.5 sm:gap-4">
          <div
            className={`h-1 rounded-full ${
              step > 1 ? "bg-emerald-500" : "bg-slate-800"
            }`}
          />
          <div
            className={`h-1 rounded-full ${
              step > 2 ? "bg-emerald-500" : "bg-slate-800"
            }`}
          />
          <div
            className={`h-1 rounded-full ${
              step > 3 ? "bg-emerald-500" : "bg-slate-800"
            }`}
          />
        </div>
      </div>
    );
  }

  function StepHeaderCard({
    icon,
    title,
    subtitle,
  }: {
    icon: any;
    title: string;
    subtitle: string;
  }) {
    const Icon = icon;
    return (
      <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/70 border border-white/5">
            <Icon className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-500/40 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-500/10";
  const labelBase =
    "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden transition-colors duration-300 relative">
      <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-3 py-10 sm:px-6 sm:py-16 md:py-24 min-h-screen">
        <section className="relative grid w-full max-w-5xl gap-6 md:gap-12 rounded-3xl sm:rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/85 via-slate-900/65 to-slate-900/85 backdrop-blur-sm p-4 sm:p-8 md:p-10 lg:grid-cols-[1.05fr_0.95fr] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] transition-colors duration-300">
          {/* Left column: info (hidden on mobile, gives more space to form) */}
          <div className="hidden lg:flex lg:flex-col lg:justify-between rounded-[2rem] border border-white/5 bg-gradient-to-br from-emerald-500/5 via-slate-900/10 to-indigo-500/5 p-7">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <Rocket className="h-3 w-3 text-emerald-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-400">
                  Create Your Account
                </span>
              </div>
              <h1 className="text-balance text-3xl font-black tracking-tight text-white xl:text-4xl leading-[1.08]">
                Join TeveXtra and start building your portfolio.
              </h1>
              <p className="mt-5 text-[14px] leading-relaxed text-slate-400">
                Open a verified trading account in minutes. Complete 4 simple
                steps to fund, trade, and monitor your investments with
                institutional-grade security and full regulatory compliance.
              </p>

              <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                    Membership benefits
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      title: "KYC-verified accounts for secure withdrawals",
                      icon: ShieldCheck,
                    },
                    {
                      title:
                        "Instant deposit methods and multi-currency support",
                      icon: CreditCard,
                    },
                    {
                      title: "Professional dashboard with real-time analytics",
                      icon: TrendingUp,
                    },
                    {
                      title: "Earn rewards through our referral program",
                      icon: Sparkles,
                    },
                  ].map((b) => (
                    <div key={b.title} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500" />
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 leading-snug">
                        <b.icon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>{b.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {referredBy && (
                <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                        Referred by
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        Code:{" "}
                        <span className="text-emerald-400">{referredBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Your data is encrypted end-to-end and stored on ISO 27001
                  certified servers. TeveXtra never shares your personal
                  information with unaffiliated third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile-only: compact top intro */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-emerald-500/15 border border-emerald-500/25">
                  <Rocket className="h-3 w-3 text-emerald-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Join TeveXtra
                </span>
              </div>
              {referredBy && (
                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
                  <span className="text-[10px] font-bold text-emerald-300">
                    Ref: {referredBy}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
              Build your investment portfolio in 4 steps.
            </h1>
          </div>

          {/* Right column: form */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/70 to-slate-900/60 backdrop-blur-sm p-4 sm:p-7 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] transition-colors duration-300">
            {/* Decorative corner ring */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/25 via-teal-500/10 to-transparent blur-2xl opacity-70" />

            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Complete Registration
                </h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  4 Steps
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All fields are required unless marked optional.
              </p>
            </div>

            <StepIndicator />

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="animate-[fadeIn_.3s_ease]">
                  <StepHeaderCard
                    icon={UserRound}
                    title="Personal Information"
                    subtitle="Create your trading profile"
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="reg-username" className={labelBase}>
                        <Hash className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        Trading Username <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-username"
                          type="text"
                          placeholder="Choose username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={`${inputBase} pr-10 ${
                            usernameTaken
                              ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                              : usernameTaken === false && username.length >= 3
                                ? "border-emerald-500/40 focus:border-emerald-500/50 focus:ring-emerald-500/15"
                                : ""
                          }`}
                        />
                        <div className="absolute inset-y-0 right-3 my-auto flex items-center">
                          {usernameChecking && (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          )}
                          {!usernameChecking &&
                            usernameTaken !== null &&
                            username.length >= 3 &&
                            (usernameTaken ? (
                              <ShieldAlert className="h-4 w-4 text-red-400" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-fullname" className={labelBase}>
                        <User className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          id="reg-first"
                          type="text"
                          placeholder="First"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputBase}
                        />
                        <input
                          id="reg-last"
                          type="text"
                          placeholder="Last"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputBase}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-email" className={labelBase}>
                        <ShieldCheck className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-phone" className={labelBase}>
                        <Phone className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        placeholder="+595 992 336 717"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputBase}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-[fadeIn_.3s_ease]">
                  <StepHeaderCard
                    icon={MapPin}
                    title="Location & Regional Settings"
                    subtitle="Select your country, region, and city for accurate KYC compliance"
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="reg-country" className={labelBase}>
                        <Globe className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        Country <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="reg-country"
                          value={countryId?.toString() ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) {
                              setCountryId(null);
                              setCountry("");
                              setStateId(null);
                              setState("");
                              setCity("");
                              return;
                            }
                            const id = Number(val);
                            const chosen = countriesList.find(
                              (c) => c.id === id,
                            );
                            setCountryId(id);
                            setCountry(chosen?.name || "");
                            setStateId(null);
                            setState("");
                            setCity("");
                          }}
                          className={selectBase}
                        >
                          <option value="" className="bg-slate-900">
                            — Select your country —
                          </option>
                          {countriesList.map((c) => (
                            <option
                              key={c.id}
                              value={c.id}
                              className="bg-slate-900"
                            >
                              {c.emoji} {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-state" className={labelBase}>
                        <MapPin className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        State / Region <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="reg-state"
                          value={stateId?.toString() ?? ""}
                          disabled={countryId == null}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) {
                              setStateId(null);
                              setState("");
                              setCity("");
                              return;
                            }
                            const id = Number(val);
                            const chosen = statesList.find((s) => s.id === id);
                            setStateId(id);
                            setState(chosen?.name || "");
                            setCity("");
                          }}
                          className={selectBase}
                        >
                          <option value="" className="bg-slate-900">
                            {countryId == null
                              ? "— Choose a country first —"
                              : statesList.length === 0
                                ? "— No regions available —"
                                : "— Select state / region —"}
                          </option>
                          {statesList.map((s) => (
                            <option
                              key={s.id}
                              value={s.id}
                              className="bg-slate-900"
                            >
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-city" className={labelBase}>
                        City <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="reg-city"
                          value={city}
                          disabled={stateId == null}
                          onChange={(e) => setCity(e.target.value)}
                          className={selectBase}
                        >
                          <option value="" className="bg-slate-900">
                            {stateId == null
                              ? "— Choose a region first —"
                              : citiesList.length === 0
                                ? "— No cities available —"
                                : "— Select city —"}
                          </option>
                          {citiesList.map((c) => (
                            <option
                              key={c.id}
                              value={c.name}
                              className="bg-slate-900"
                            >
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="reg-language" className={labelBase}>
                        Preferred Language
                      </label>
                      <div className="relative">
                        <select
                          id="reg-language"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className={selectBase}
                        >
                          {[
                            "English",
                            "Spanish",
                            "French",
                            "German",
                            "Portuguese",
                            "Italian",
                            "Russian",
                            "Arabic",
                            "Chinese",
                            "Japanese",
                            "Korean",
                          ].map((l) => (
                            <option key={l} value={l} className="bg-slate-900">
                              {l}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-[fadeIn_.3s_ease]">
                  <StepHeaderCard
                    icon={ShieldCheck}
                    title="Account Security"
                    subtitle="Protect your account with a strong password"
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="reg-password" className={labelBase}>
                        <KeyRound className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`${inputBase} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-emerald-400 transition-colors"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-slate-500">Strength</span>
                            <span className={`font-bold ${passwordLabelColor}`}>
                              {passwordLabel}
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <div
                                key={n}
                                className={`h-1.5 rounded-full ${
                                  n <= passwordScore
                                    ? passwordColor
                                    : "bg-slate-800"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="reg-confirm" className={labelBase}>
                        <Lock className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-emerald-400" />
                        Confirm Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`${inputBase} pr-12 ${
                            confirmPassword && confirmPassword !== password
                              ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                              : confirmPassword && confirmPassword === password
                                ? "border-emerald-500/40 focus:border-emerald-500/50 focus:ring-emerald-500/15"
                                : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-emerald-400 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                          {confirmPassword === password ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">
                                Passwords match
                              </span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                              <span className="text-red-400 font-bold">
                                Passwords do not match
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <label
                          htmlFor="reg-terms"
                          className="flex items-start gap-3 cursor-pointer select-none"
                        >
                          <input
                            id="reg-terms"
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded-md border-white/10 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 accent-emerald-500"
                          />
                          <div className="text-xs leading-relaxed text-slate-400">
                            <span className="font-bold text-slate-300">
                              I agree{" "}
                            </span>
                            to the platform&apos;s Terms of Service, Privacy
                            Policy, Risk Disclosure, and consent to electronic
                            communications regarding my account. I confirm I am
                            at least 18 years old.
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="animate-[fadeIn_.3s_ease]">
                  <StepHeaderCard
                    icon={Camera}
                    title="Profile Photo Verification"
                    subtitle="Final step — upload a clear photo to secure your account and enable withdrawals"
                  />

                  <div className="mb-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex-shrink-0">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white">
                          This unlocks full account access
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          Verified members can deposit, withdraw, and
                          participate in the referral rewards program
                          immediately.
                        </p>
                      </div>
                      <div className="ml-auto hidden sm:flex flex-shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                          Final step
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] xl:gap-7">
                    {/* Avatar upload column */}
                    <div className="flex flex-col items-center">
                      <div
                        onClick={handleFilePickClick}
                        className={`group relative cursor-pointer transition-all select-none ${
                          profileImageDataUrl ? "" : "hover:-translate-y-0.5"
                        }`}
                      >
                        <div
                          className={`relative flex items-center justify-center transition-all ${
                            profileImageDataUrl
                              ? "rounded-full border-4 border-emerald-500/40 bg-slate-950 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.35)]"
                              : "rounded-full border-[3px] border-dashed border-white/15 bg-slate-950/70 hover:border-emerald-500/40 hover:bg-slate-950"
                          } ${
                            profileImageDataUrl
                              ? "h-48 w-48 sm:h-56 sm:w-56"
                              : "h-48 w-48 sm:h-56 sm:w-56"
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelected}
                          />
                          {profileImageDataUrl ? (
                            <>
                              <img
                                src={profileImageDataUrl}
                                alt="Profile preview"
                                className="h-full w-full rounded-full object-cover"
                                crossOrigin="anonymous"
                              />
                              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                              <div className="absolute -bottom-1.5 right-1">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 border-4 border-slate-950">
                                  <CheckCircle2 className="h-5 w-5" />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFilePickClick();
                                }}
                                className="absolute -top-2 -right-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-white/10 text-white/80 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
                                aria-label="Replace photo"
                              >
                                <Camera className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/5 border border-white/10 group-hover:scale-105 transition-transform">
                                <UserRound
                                  className="h-8 w-8 text-emerald-400/80"
                                  strokeWidth={1.6}
                                />
                              </div>
                              <p className="text-sm font-black text-white leading-tight">
                                Your profile photo
                              </p>
                              <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed max-w-[180px]">
                                Tap to upload a clear, front-facing selfie
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 w-full max-w-xs">
                        <button
                          type="button"
                          onClick={handleFilePickClick}
                          className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black transition-all active:translate-y-0 ${
                            profileImageDataUrl
                              ? "border border-white/10 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 hover:brightness-110 hover:-translate-y-0.5"
                          }`}
                        >
                          {profileImageDataUrl ? (
                            <>
                              <Upload className="h-4 w-4" />
                              Choose a different photo
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4" />
                              Upload verification photo
                            </>
                          )}
                        </button>
                        {profileFileName && (
                          <div className="mt-3 flex items-center justify-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 max-w-[280px] truncate">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                              <span className="text-[11px] font-bold text-emerald-300 truncate">
                                {profileFileName}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info column: requirements + tips + why */}
                    <div className="space-y-4">
                      {/* Requirements */}
                      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-black text-white flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/25">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                            Photo requirements
                          </h3>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            KYC compliant
                          </span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                          {[
                            "Clear, high-resolution photo",
                            "Good natural lighting",
                            "No sunglasses or face masks",
                            "Front-facing, eyes visible",
                            "No hats or heavy filters",
                            "JPG / PNG / WEBP under 5MB",
                          ].map((t) => (
                            <li
                              key={t}
                              className="flex items-center gap-2 text-[11px] text-slate-300 leading-snug"
                            >
                              <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                                <span className="block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              </span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div className="rounded-2xl border border-sky-500/15 bg-sky-500/5 p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/25 flex-shrink-0">
                            <Sparkles className="h-4 w-4 text-sky-400" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-black text-white mb-1.5">
                              Quick tips for instant approval
                            </h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Use a plain, well-lit background (white or neutral
                              wall is ideal). Selfies are fine — this is not a
                              passport photo. You&apos;ll receive confirmation
                              via email within minutes.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Why we need this */}
                      <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/25 flex-shrink-0">
                            <ShieldAlert className="h-4 w-4 text-amber-400" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-black text-amber-300 mb-1.5">
                              Why we require this
                            </h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Your photo enables KYC verification per global
                              anti-fraud and AML regulations. It ensures only
                              <em className="not-italic text-slate-300 font-semibold">
                                {" "}
                                you
                              </em>{" "}
                              can approve withdrawals on your account. It&apos;s
                              encrypted and never shared publicly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-4">
                {stepError && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs font-bold text-red-300 leading-relaxed">
                        {stepError}
                      </p>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs font-bold text-emerald-300 leading-relaxed">
                        {success}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-slate-500 font-bold tracking-wide order-2 sm:order-1">
                    Step {step} of 4
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 justify-stretch sm:justify-end order-1 sm:order-2 w-full sm:w-auto">
                    {step > 1 && !submitting && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-slate-900 px-6 py-3.5 text-sm font-black text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </button>
                    )}
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={submitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : submitting ? (
                      <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 opacity-90 cursor-wait">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {uploadingImage
                          ? "Uploading photo..."
                          : "Creating your account..."}
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Create My Verified Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-7 border-t border-white/5 pt-5 text-center">
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-black text-emerald-400 hover:underline hover:text-emerald-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </>
  );
}
