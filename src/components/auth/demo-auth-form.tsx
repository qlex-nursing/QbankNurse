"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { registerUser } from "@/lib/services/auth/registerservice";
import { login } from "@/lib/services/auth/loginservice";
import { getSafeReturnTo } from "@/lib/navigation";

interface DemoAuthFormProps {
  mode: "login" | "register";
}

export default function DemoAuthForm({ mode }: DemoAuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [agree, setAgree] = useState(false);
const [registrationSuccess, setRegistrationSuccess] = useState("");
  const [returnTo, setReturnTo] = useState<string | null>(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  setReturnTo(getSafeReturnTo(params.get("returnTo")));

  if (isRegister && params.get("email")) {
    setEmail(params.get("email") ?? "");
  }

  if (!isRegister && params.get("registered") === "1") {
    setEmail(params.get("email") ?? "");
    setRegistrationSuccess(
      "Your account has been created successfully. Please sign in to continue.",
    );
  }
}, [isRegister]);

 const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();
  setError("");
  setAccountNotFound(false);

  if (isRegister && !name.trim()) {
    setError("Please enter your username.");
    return;
  }

  if (!email.trim() || !email.includes("@")) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!password) {
    setError("Please enter your password.");
    return;
  }

  if (isRegister) {
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the terms to continue.");
      return;
    }
  }

    setLoading(true);

  try {
    if (isRegister) {
      const result = await registerUser({
        username: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        passwordConfirmation: confirmPassword,
        loginMethod: "password",
        agree: true,
        role: "Learner",
        dashboardName: "web",
        provider: "email",
        challenge: "register-skew8@lancasto",
      });

      if (result.error) {
        throw new Error(result.error);
      }

      router.push(
        `/login?registered=1&email=${encodeURIComponent(email.trim())}`,
      );
      return;
    }

    await login(email.trim(), password);
    router.push(returnTo ?? "/dashboard");
    return;

  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Authentication failed. Please try again.";

    const normalizedMessage = message.toLowerCase();

    const isUnknownAccount =
      normalizedMessage.includes("user not found") ||
      normalizedMessage.includes("account not found") ||
      normalizedMessage.includes("email not found") ||
      normalizedMessage.includes("email does not exist") ||
      normalizedMessage.includes("email is not registered") ||
      normalizedMessage.includes("user does not exist");

    setAccountNotFound(isUnknownAccount);

    setError(
      isUnknownAccount
        ? "We couldn't find an account with this email. Please create an account to continue."
        : message,
    );

  } finally {
    setLoading(false);
  }
};
  return (
    <main className="flex min-h-screen bg-[#F8F7FC]">
      {/* Left visual panel */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#211747] p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border-[70px] border-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-[#7659E8]/20 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
            <BookOpen size={23} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            QbankNurse
          </span>
        </Link>

        <div className="relative max-w-xl">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#E8DEFF]">
            Your nursing journey starts here
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight xl:text-5xl">
            Learn smarter.
            <br />
            Practice with purpose.
            <br />
            <span className="text-[#C9B9FF]">Become confident.</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
            Build your nursing knowledge, practise clinical questions and
            prepare for your next examination with QbankNurse.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              "Practice questions",
              "Study resources",
              "Clinical reasoning",
              "Learning progress",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-semibold text-white/80"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
         © 2026 QbankNurse. Learn with confidence.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 lg:w-1/2 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#2D1B68] lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
              <BookOpen size={20} />
            </span>
            QbankNurse
          </Link>

          <div className="mb-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#7B64CE]">
              {isRegister ? "Create your account" : "Welcome back"}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#251B48]">
              {isRegister ? "Join QbankNurse" : "Sign in to QbankNurse"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#817B91]">
              {isRegister
                ? "Registration is currently available in preview mode."
                : "Enter your details to continue to your learning dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-[#342B50]"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9991AA]"
                  />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    className="h-12 w-full rounded-xl border border-[#E5E0ED] bg-white pl-11 pr-4 text-sm text-[#30264E] outline-none transition focus:border-[#8B72ED] focus:ring-4 focus:ring-[#8B72ED]/10"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-[#342B50]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9991AA]"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-[#E5E0ED] bg-white pl-11 pr-4 text-sm text-[#30264E] outline-none transition focus:border-[#8B72ED] focus:ring-4 focus:ring-[#8B72ED]/10"
                />
              </div>
            </div>
            {isRegister && (
  <div>
    <label
      htmlFor="phone"
      className="mb-2 block text-sm font-bold text-[#342B50]"
    >
      Phone number
    </label>

    <input
      id="phone"
      type="tel"
      autoComplete="tel"
      value={phone}
      onChange={(event) => setPhone(event.target.value)}
      placeholder="+254 7XX XXX XXX"
      className="h-12 w-full rounded-xl border border-[#E5E0ED] bg-white px-4 text-sm text-[#30264E] outline-none transition focus:border-[#8B72ED] focus:ring-4 focus:ring-[#8B72ED]/10"
    />
  </div>
)}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-[#342B50]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9991AA]"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-[#E5E0ED] bg-white pl-11 pr-12 text-sm text-[#30264E] outline-none transition focus:border-[#8B72ED] focus:ring-4 focus:ring-[#8B72ED]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9991AA] hover:text-[#5B3DF5]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isRegister && (
  <div>
    <label
      htmlFor="confirmPassword"
      className="mb-2 block text-sm font-bold text-[#342B50]"
    >
      Confirm password
    </label>

    <input
      id="confirmPassword"
      type="password"
      autoComplete="new-password"
      value={confirmPassword}
      onChange={(event) => setConfirmPassword(event.target.value)}
      placeholder="Re-enter your password"
      className="h-12 w-full rounded-xl border border-[#E5E0ED] bg-white px-4 text-sm text-[#30264E] outline-none transition focus:border-[#8B72ED] focus:ring-4 focus:ring-[#8B72ED]/10"
    />
  </div>
)}

              <p className="mt-2 text-[11px] text-[#928BA0]">
             {isRegister
  ? "Create your student profile and explore your learning dashboard."
  : "Enter your registered learner credentials to continue."}
              </p>
            </div>


            {isRegister && (
  <label className="flex items-start gap-3 text-xs leading-5 text-[#817B91]">
    <input
      type="checkbox"
      checked={agree}
      onChange={(event) => setAgree(event.target.checked)}
      className="mt-1 h-4 w-4 rounded border-[#E5E0ED] accent-[#5B3DF5]"
    />
    <span>
      I agree to the terms of service and privacy policy.
    </span>
  </label>
)}

           {registrationSuccess && (
  <p
    role="status"
    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700"
  >
    {registrationSuccess}
  </p>
)}

{error && (
  <p
    role="alert"
    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
  >
    {error}
  </p>
)}

{accountNotFound && (
  <Link
    href={`/register?email=${encodeURIComponent(email.trim())}`}
    className="flex items-center justify-center gap-2 rounded-xl border border-[#D8CCFF] bg-[#F3EFFF] px-4 py-3 text-sm font-bold text-[#5B3DF5] transition hover:bg-[#E8DEFF]"
  >
    Create your QbankNurse account
    <ArrowRight size={16} />
  </Link>
)}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-5 text-sm font-extrabold text-white shadow-lg shadow-[#5B3DF5]/20 transition hover:-translate-y-0.5 hover:bg-[#4930D4] disabled:cursor-wait disabled:opacity-70"
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E8E3EF]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A39BAD]">
              or
            </span>
            <div className="h-px flex-1 bg-[#E8E3EF]" />
          </div>

          <p className="text-center text-sm text-[#817B91]">
            {isRegister ? "Already have an account?" : "New to QbankNurse?"}{" "}  
           <Link
  href={`${isRegister ? "/login" : "/register"}${
    returnTo
      ? `?returnTo=${encodeURIComponent(returnTo)}`
      : ""
  }`}
  className="font-extrabold text-[#5B3DF5] hover:underline"
>
              {isRegister ? "Log in" : "Create an account"}
            </Link>
          </p>

          <p className="mt-8 text-center text-[10px] leading-5 text-[#A39BAD]">
            Create your learner account and start your nursing preparation journey.
          </p>
        </div>
      </section>
    </main>
  );
}