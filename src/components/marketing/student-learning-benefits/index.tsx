import {
  Target,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Smartphone,
  CircleHelp,
} from "lucide-react";

import { studentLearningBenefits } from "@/data/mock/student-learning-benefits";

const icons = {
  target: Target,
  book: BookOpen,
  chart: ChartNoAxesColumnIncreasing,
  mobile: Smartphone,
  help: CircleHelp,
};

const accentStyles = {
  red: {
    icon: "bg-[#FFF0EF] text-[#E85D5D]",
  },
  teal: {
    icon: "bg-[#E9F8F7] text-[#22A6A8]",
  },
  blue: {
    icon: "bg-[#EEF4FF] text-[#4389E8]",
  },
  green: {
    icon: "bg-[#EAF8F1] text-[#36A985]",
  },
  purple: {
    icon: "bg-[#F5EDFF] text-[#A34DD8]",
  },
};

export default function StudentLearningBenefits() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F6FC] to-[#FFFCFA] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      {/* Subtle decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#E8DEFF]/25 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#FFD6A5]/15 blur-[100px]" />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2D1B68] sm:text-4xl lg:text-[42px]">
            Built around how nursing students study
          </h2>

          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#C46C99] sm:text-xs">
            Simple tools, meaningful feedback
          </p>
        </div>

        {/* Benefit cards */}
        <div className="mx-auto mt-12 grid max-w-[1040px] gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {studentLearningBenefits.map((benefit, index) => {
            const Icon = icons[benefit.icon];
            const styles = accentStyles[benefit.accent];

            return (
              <article
                key={benefit.id}
                className={`min-h-[218px] rounded-[23px] border border-[#EEE9F0] bg-white/95 p-6 shadow-[0_5px_22px_rgba(45,27,104,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#DDD2E8] hover:shadow-[0_15px_35px_rgba(45,27,104,0.07)] sm:p-7 lg:col-span-2 ${
                  index === 3 ? "lg:col-start-2" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                >
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="mt-7 text-base font-extrabold leading-6 text-[#2D1B68]">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-[#777087]">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}