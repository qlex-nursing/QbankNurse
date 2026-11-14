import {
  ArrowRight,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Target,
} from "lucide-react";

import { learningApproaches } from "@/data/mock/learning-approach";

const icons = {
  target: Target,
  book: BookOpen,
  chart: ChartNoAxesColumnIncreasing,
};

const accentStyles = {
  red: {
    icon: "bg-[#FFF0EF] text-[#E85D5D]",
    check: "text-[#E85D5D]",
    hover: "hover:border-[#F0C5C2]",
  },
  apricot: {
    icon: "bg-[#FFF5E9] text-[#D58A42]",
    check: "text-[#D58A42]",
    hover: "hover:border-[#F5D0A5]",
  },
  indigo: {
    icon: "bg-[#F0EBFF] text-[#5B3DF5]",
    check: "text-[#5B3DF5]",
    hover: "hover:border-[#C8BAFF]",
  },
};

export default function LearningApproach() {
  return (
    <section className="bg-[#F7F7FA] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Heading */}
        <div className="mx-auto max-w-[650px] text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C46C99]">
            A clearer way to prepare
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#2D1B68] sm:text-4xl">
            Practice. Understand. Return
            <br className="hidden sm:block" />
            Stronger the Next Time.
          </h2>

          <p className="mx-auto mt-5 max-w-[570px] text-sm leading-7 text-[#777087] sm:text-base">
            Move from answering to understanding with clinical practice,
            useful feedback, and a simple view of your progress.
          </p>
        </div>

        {/* Learning cards */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {learningApproaches.map((approach) => {
            const Icon = icons[approach.icon];
            const styles = accentStyles[approach.accent];

            return (
              <article
                key={approach.id}
                className={`rounded-[22px] border border-[#ECE7ED] bg-white p-6 shadow-[0_8px_28px_rgba(45,27,104,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(45,27,104,0.075)] sm:p-7 ${styles.hover}`}
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.icon}`}
                >
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-lg font-extrabold leading-7 text-[#2D1B68]">
                  {approach.title}
                </h3>

                {/* Points */}
                <ul className="mt-5 space-y-3.5">
                  {approach.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5"
                    >
                      <CheckCircle2
                        size={15}
                        className={`mt-0.5 shrink-0 ${styles.check}`}
                      />

                      <span className="text-xs leading-5 text-[#777087]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}