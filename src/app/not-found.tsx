"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Home,
  Plus,
  Stethoscope,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="qn-404 relative min-h-screen overflow-hidden bg-[#090D20] text-white">

      {/* Background atmosphere */}
      <div className="qn-404-glow qn-404-glow-one" />
      <div className="qn-404-glow qn-404-glow-two" />

      <div className="qn-404-grid" />

      {/* Background heartbeat */}
      <div className="pointer-events-none absolute inset-x-0 top-[48%] opacity-[0.09]">
        <svg viewBox="0 0 1440 150" className="w-full">
          <path
            d="M0 75 H280 L310 75 L340 35 L370 115 L405 5 L440 75 H650 L680 75 L710 40 L740 110 L775 5 L810 75 H1050 L1080 75 L1110 35 L1140 115 L1175 5 L1210 75 H1440"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-7 sm:px-10 lg:px-16">

        {/* Brand */}
        <header className="flex items-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#9B72FF] to-[#5B3DF5] shadow-lg shadow-purple-500/30">
              <HeartPulse size={24} />
            </div>

            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Qbank<span className="text-[#A78BFA]">Nurse</span>
            </span>
          </Link>
        </header>

        {/* Main content */}
        <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">

          {/* Left: Error message */}
          <section className="order-2 mx-auto w-full max-w-xl text-center lg:order-1 lg:mx-0 lg:text-left">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#A78BFA]" />

              <span className="text-xs font-bold tracking-[0.18em] text-[#C4B5FD]">
                404 · PAGE NOT FOUND
              </span>
            </div>

            <p className="text-7xl font-black tracking-[-0.07em] text-white sm:text-8xl lg:text-9xl">
              UH<span className="text-[#A78BFA]">-</span>OH!
            </p>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              WE LOST
              <span className="block bg-gradient-to-r from-[#C4B5FD] via-[#A78BFA] to-[#7C5CFA] bg-clip-text text-transparent">
                THIS PAGE.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-slate-400 sm:text-base lg:mx-0">
              Looks like this page has gone off the charts.
              Don't worry, your nursing journey is still
              on track. Let's get you back to where the
              learning happens.
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

              <Link
                href="/dashboard"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#5B3DF5] px-7 text-sm font-bold text-white shadow-xl shadow-purple-900/40 transition duration-300 hover:-translate-y-1 hover:shadow-purple-500/30"
              >
                <Home size={18} />

                Go to Dashboard

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <button
                type="button"
                onClick={goBack}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-7 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-500/10"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 text-xs text-slate-500 lg:justify-start">
              <Activity size={16} className="text-purple-400" />
              <span>YOUR JOURNEY TO BETTER NURSING STARTS HERE</span>
            </div>
          </section>

          {/* Right: Medical 404 illustration */}
          <section className="qn-404-scene order-1 relative mx-auto flex aspect-square w-full max-w-[570px] items-center justify-center lg:order-2">

            {/* Orbit rings */}
            <div className="qn-404-orbit qn-404-orbit-one" />
            <div className="qn-404-orbit qn-404-orbit-two" />

            {/* Floating medical cross */}
            <div className="qn-float absolute left-[10%] top-[18%] flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-500/10 text-purple-300 shadow-lg shadow-purple-500/10 backdrop-blur">
              <Plus size={27} />
            </div>

            {/* Floating heart */}
            <div className="qn-float-delayed absolute right-[12%] top-[13%] flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/20 bg-white/[0.06] text-[#C4B5FD] shadow-xl backdrop-blur">
              <HeartPulse size={27} />
            </div>

            {/* Main 404 typography */}
            <div className="relative z-10 flex items-center justify-center">
              <span className="select-none text-[10rem] font-black leading-none tracking-[-0.1em] text-transparent sm:text-[13rem] lg:text-[15rem]">
                4
              </span>

              {/* ECG monitor as the zero */}
              <div className="qn-monitor relative mx-[-10px] flex h-36 w-36 items-center justify-center rounded-full border-[8px] border-[#A78BFA] bg-[#151536] shadow-[0_0_35px_rgba(139,92,246,0.55),inset_0_0_30px_rgba(139,92,246,0.2)] sm:h-44 sm:w-44 lg:h-48 lg:w-48">
                <div className="absolute inset-2 rounded-full border border-purple-300/20 bg-[#11132D]" />

                <svg
                  viewBox="0 0 160 100"
                  className="relative z-10 w-[85%] overflow-visible"
                  aria-label="Animated ECG heartbeat"
                  role="img"
                >
                  <path
                    className="qn-ecg"
                    d="M0 50 H34 L47 50 L59 31 L71 73 L86 10 L101 50 H119 L130 50 L139 38 L147 61 L155 50 H160"
                    fill="none"
                    stroke="#D8B4FE"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <HeartPulse
                  size={20}
                  className="absolute bottom-5 right-5 text-purple-300"
                />
              </div>

              <span className="select-none text-[10rem] font-black leading-none tracking-[-0.1em] text-transparent sm:text-[13rem] lg:text-[15rem]">
                4
              </span>
            </div>

            {/* Stethoscope */}
            <div className="qn-float absolute bottom-[13%] left-[7%] z-20 flex h-28 w-28 rotate-[-18deg] items-center justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#28204D] to-[#11152E] text-[#BFA7FF] shadow-2xl shadow-purple-950/60 sm:h-32 sm:w-32">
              <Stethoscope size={76} strokeWidth={1.3} />
            </div>

            {/* Syringe */}
            <div className="qn-float-delayed absolute bottom-[17%] right-[8%] z-20 rotate-[35deg]">
              <svg
                viewBox="0 0 150 150"
                className="h-28 w-28 drop-shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:h-36 sm:w-36"
                fill="none"
                aria-label="Medical syringe"
                role="img"
              >
                <path
                  d="M28 112L105 35"
                  stroke="#A78BFA"
                  strokeWidth="17"
                  strokeLinecap="round"
                />

                <path
                  d="M28 112L105 35"
                  stroke="#E9D5FF"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                <path
                  d="M22 118L34 106"
                  stroke="#C4B5FD"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M92 22L118 48"
                  stroke="#A78BFA"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <path
                  d="M105 35L125 15"
                  stroke="#E9D5FF"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <path
                  d="M125 15L140 0"
                  stroke="#C4B5FD"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M49 91L60 102M64 76L75 87M79 61L90 72"
                  stroke="#6D4FEA"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Small floating particles */}
            <span className="qn-particle absolute left-[24%] top-[39%] h-2 w-2 rounded-full bg-purple-300" />
            <span className="qn-particle-delayed absolute right-[23%] top-[48%] h-2.5 w-2.5 rounded-full bg-indigo-300" />
            <span className="qn-particle absolute bottom-[29%] left-[35%] h-1.5 w-1.5 rounded-full bg-violet-200" />

            {/* Bottom glow */}
            <div className="absolute bottom-[9%] left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />

            {/* Floating status badge */}
            <div className="qn-float absolute right-[2%] top-[65%] z-30 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#171831]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                <Activity size={19} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  System status
                </p>

                <p className="text-xs font-bold text-white">
                  Learning is healthy
                </p>
              </div>

              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34D399]" />
            </div>
          </section>
        </div>

        {/* Bottom footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} QbankNurse. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <HeartPulse size={14} className="text-purple-400" />
            Built for the next generation of nurses.
          </p>
        </footer>
      </div>
    </main>
  );
}