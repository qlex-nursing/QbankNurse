import Link from "next/link";
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

import { examCategories } from "@/data/mock/exam-categories";

const accentStyles = {
  indigo: {
    icon: "bg-[#F0EBFF] text-[#5B3DF5]",
    tag: "bg-[#F1ECFF] text-[#5B3DF5]",
    button: "bg-[#5B3DF5] hover:bg-[#492BD8]",
    border: "hover:border-[#B9A9FF]",
    dot: "bg-[#5B3DF5]",
  },
  red: {
    icon: "bg-[#FFF0EF] text-[#E85D5D]",
    tag: "bg-[#FFF0EF] text-[#D94E4E]",
    button: "bg-[#E85D5D] hover:bg-[#D94D4D]",
    border: "hover:border-[#F0B6B2]",
    dot: "bg-[#E85D5D]",
  },
};

export default function ExamCategories() {
  return (
    <section
      id="exam-categories"
      className="scroll-mt-24 border-t border-[#F0EAF2] bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <div className="mx-auto max-w-[650px] text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8B9CE]" />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C46C99]">
              Find your next study set
            </span>

            <span className="h-px w-9 bg-[#E8B9CE]" />
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2D1B68] sm:text-4xl lg:text-[42px]">
            Start with the exam in front of you
          </h2>

          <p className="mx-auto mt-5 max-w-[550px] text-sm leading-7 text-[#777087] sm:text-base">
            Pick a track, answer a few questions, and let your results
            guide what you review next.
          </p>
        </div>

        {/* Exam cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {examCategories.map((exam) => {
            const styles = accentStyles[exam.accent];

            const Icon =
              exam.icon === "stethoscope"
                ? Stethoscope
                : HeartPulse;

            return (
              <article
                key={exam.id}
                className={`group relative overflow-hidden rounded-[24px] border border-[#F0DCE7] bg-white p-6 shadow-[0_8px_30px_rgba(45,27,104,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(45,27,104,0.09)] sm:p-8 ${styles.border}`}
              >
                {/* Top accent */}
                <div
                  className={`absolute bottom-0 left-0 h-[5px] w-full ${styles.dot}`}
                />

                {/* Card heading */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <div>
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-[0.16em] ${styles.tag}`}
                    >
                      {exam.tag}
                    </span>

                    <h3 className="mt-1 text-xl font-extrabold text-[#2D1B68] sm:text-2xl">
                      {exam.title}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-[#777087]">
                      {exam.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-7 max-w-[650px] text-sm leading-7 text-[#777087]">
                  {exam.description}
                </p>

                {/* Features */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {exam.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-2 rounded-full border border-[#F0E6ED] bg-[#FCF7FA] px-3 py-2 text-[10px] font-semibold text-[#716887] sm:text-xs"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={exam.href}
                  className={`group/button mt-7 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl px-5 text-sm font-extrabold text-white transition-colors ${styles.button}`}
                >
                  {exam.buttonLabel}

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover/button:translate-x-1"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}