import {
  Brain,
  ClipboardList,
  CreditCard,
  MessageSquare,
  Target,
} from "lucide-react";

import { studyBenefits } from "@/data/mock/study-benefits";

const icons = {
  clipboard: ClipboardList,
  brain: Brain,
  target: Target,
  message: MessageSquare,
  "credit-card": CreditCard,
};

const accentStyles = {
  red: {
    icon: "bg-[#FFF0EF] text-[#E85D5D]",
    hover: "hover:border-[#F0B6B2]",
  },
  indigo: {
    icon: "bg-[#F0EBFF] text-[#5B3DF5]",
    hover: "hover:border-[#C8BAFF]",
  },
  apricot: {
    icon: "bg-[#FFF5E9] text-[#D58A42]",
    hover: "hover:border-[#F5D0A5]",
  },
};

export default function StudyBenefits() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Section heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#E8B9CE]" />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C46C99]">
              Inside every study session
            </span>

            <span className="h-px w-8 bg-[#E8B9CE]" />
          </div>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#2D1B68] sm:text-3xl">
            Learn the why behind every answer
          </h2>
        </div>

        {/* Benefits grid */}
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {studyBenefits.map((benefit, index) => {
            const Icon = icons[benefit.icon];
            const styles = accentStyles[benefit.accent];

            return (
              <article
                key={benefit.id}
                className={`flex min-h-[86px] items-center gap-4 rounded-2xl border border-[#F0EAF0] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(45,27,104,0.05)] sm:p-5 lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""} ${styles.hover}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </div>

                <h3 className="text-sm font-bold leading-6 text-[#51476E]">
                  {benefit.title}
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}