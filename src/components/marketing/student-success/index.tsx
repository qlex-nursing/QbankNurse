import {
  BookOpenCheck,
  ShieldCheck,
  Star,
} from "lucide-react";

import { studentSuccess } from "@/data/mock/student-success";

export default function StudentSuccess() {
  return (
    <section className="relative overflow-hidden bg-[#FBF3F7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      {/* Subtle decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#E8DEFF]/35 blur-[100px]" />

      <div className="relative mx-auto max-w-[1000px] text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.23em] text-[#C46C99]">
          Your progress matters
        </p>

        <div className="mt-4 text-[90px] font-black leading-none tracking-[-7px] text-[#2D1B68] sm:text-[120px]">
          {studentSuccess.percentage.slice(0, -1)}
          <span className="text-[#D66F9F]">
            %
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-[470px] text-sm leading-7 text-[#777087] sm:text-base">
          {studentSuccess.message}
        </p>

        <p className="mt-3 text-[10px] text-[#A39AAA]">
          {studentSuccess.disclaimer}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {studentSuccess.highlights.map((highlight, index) => {
            const icons = [
              BookOpenCheck,
              Star,
              ShieldCheck,
            ];

            const Icon = icons[index];

            return (
              <div
                key={highlight}
                className="flex items-center gap-2 text-xs font-semibold text-[#716887]"
              >
                <Icon
                  size={16}
                  className="shrink-0 text-[#B66B96]"
                />

                {highlight}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}