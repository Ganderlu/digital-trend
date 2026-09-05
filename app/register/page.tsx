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
        <ol className="grid grid-cols-4 gap-2 sm:gap-4">
          {STEPS.map((s) => {
            const active = step === s.num;
            const done = step > s.num;
            const ring = active
              ? "ring-4 ring-emerald-500/25"
              : done
                ? "ring-0"
                : "ring-0";
            const bg = active
              ? "bg-emerald-500 text-white border-emerald-400"
              : done
                ? "bg-emerald-500 text-white border-emerald-400"
                : "bg-slate-800 text-slate-400 border-white/5";
            return (
              <li
                key={s.num}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 transition-all ${bg} ${ring}`}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  ) : (
                    <span className="text-sm font-black">{s.num}</span>
                  )}
                </div>
                <div className="mt-2">
                  <p
                    className={`text-[11px] sm:text-xs font-bold ${
                      active
                        ? "text-white"
                        : done
                          ? "text-emerald-300"
                          : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-500 hidden sm:block">
                    {s.subtitle}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
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

      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24 min-h-screen">
        <section className="grid w-full max-w-5xl gap-12 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] transition-colors duration-300">
          {/* Left column: info */}
          <div className="relative flex flex-col justify-between">
            <div>
              <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <Rocket className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                  Create Your Account
                </span>
              </div>
              <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
                Join TeveXtra and start building your portfolio.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Open a verified trading account in minutes. Complete 4 simple
                steps to fund, trade, and monitor your investments with
                institutional-grade security and full regulatory compliance.
              </p>
              <div className="mt-10 space-y-4">
                {[
                  {
                    title: "KYC-verified accounts for secure withdrawals",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Instant deposit methods and multi-currency support",
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
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <b.icon className="h-4 w-4 text-emerald-400" />
                      <span>{b.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              {referredBy && (
                <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent p-4 max-w-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
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

            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
              Security notice: Your data is encrypted end-to-end and never
              shared with third parties.
            </p>
          </div>

          {/* Right column: form */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/70 to-slate-900/60 backdrop-blur p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] transition-colors duration-300">
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
                    title="Profile Image Verification"
                    subtitle="Upload a clear photo of yourself so we can verify your account"
                  />
                  <div className="grid gap-6 sm:grid-cols-[1fr_1fr]">
                    <div
                      onClick={handleFilePickClick}
                      className={`group relative cursor-pointer rounded-3xl border-2 border-dashed transition-all overflow-hidden ${
                        profileImageDataUrl
                          ? "border-emerald-500/40 bg-slate-950/40"
                          : "border-white/15 bg-slate-950/50 hover:border-emerald-500/50 hover:bg-slate-950/80"
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
                        <div className="relative aspect-square">
                          <img
                            src={profileImageDataUrl}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                            crossOrigin="anonymous"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                          <div className="absolute left-4 bottom-4 right-4 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black text-white truncate max-w-[180px]">
                                {profileFileName || "Your photo"}
                              </p>
                              <p className="text-[11px] text-emerald-300 mt-0.5 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Selected for verification
                              </p>
                            </div>
                            <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                              Ready
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square flex flex-col items-center justify-center p-8 text-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-white/5 group-hover:scale-105 transition-transform">
                            <Upload className="h-7 w-7 text-emerald-400" />
                          </div>
                          <p className="text-base font-black text-white">
                            Click to upload your photo
                          </p>
                          <p className="mt-1 text-xs text-slate-400 max-w-xs">
                            JPG, PNG or WEBP · Max 5MB · Clear, well-lit selfie
                            recommended
                          </p>
                          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                            <Camera className="h-3 w-3" />
                            Choose file
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/50 p-5">
                        <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-400" />
                          Photo requirements
                        </h3>
                        <ul className="space-y-2.5">
                          {[
                            "Clear, high-resolution photo of your face",
                            "Good lighting, no sunglasses or masks",
                            "Front-facing, eyes open and visible",
                            "JPG, PNG, or WEBP format under 5MB",
                          ].map((t) => (
                            <li
                              key={t}
                              className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                            >
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                        <h3 className="text-sm font-black text-amber-300 mb-1.5 flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4" />
                          Why we need this
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Your photo is used solely for identity verification
                          per KYC/AML regulations. It helps secure your account
                          against fraud and ensures withdrawals are processed
                          smoothly. You can replace it anytime from your
                          dashboard.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleFilePickClick}
                        className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-black text-emerald-300 transition-all hover:bg-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        {profileImageDataUrl ? (
                          <>
                            <Camera className="h-4 w-4" />
                            Choose a different photo
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Select photo from device
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-4">
                {stepError && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5">
                    <p className="text-xs font-bold text-red-300 leading-relaxed">
                      {stepError}
                    </p>
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                    <p className="text-xs font-bold text-emerald-300 leading-relaxed">
                      {success}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-slate-500 font-bold tracking-wide order-2 sm:order-1">
                    Step {step} of 4
                  </div>
                  <div className="flex gap-3 justify-end order-1 sm:order-2">
                    {step > 1 && !submitting && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900 px-5 py-3.5 text-sm font-black text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
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
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : submitting ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 opacity-90 cursor-wait">
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {uploadingImage
                          ? "Uploading verification photo..."
                          : "Creating your secure account..."}
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Create Account & Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-8 border-t border-white/5 pt-6 text-center">
              <p className="text-sm text-slate-500">
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
