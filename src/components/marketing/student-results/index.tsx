import { ArrowUpRight, MessageCircle, Quote } from "lucide-react";
import { studentExperiences } from "@/data/mock/student-experiences";

export default function StudentResults() {
  // Duplicate the records to create a continuous scrolling track.
  const marqueeItems = [...studentExperiences, ...studentExperiences];

  return (
    <div className="relative overflow-hidden pb-16 pt-8 sm:pb-20">
      <div className="mx-auto mb-8 max-w-[1440px] px-5 text-center sm:px-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5B3DF5]">
          The QbankNurse learning experience
        </p>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-[#2D1B68] sm:text-2xl">
          Small steps. Stronger nursing knowledge.
        </h2>

        <p className="mt-2 text-[10px] font-medium text-[#938BA1]">
          Illustrative learner experiences · Sample content
        </p>
      </div>

      <div className="experience-marquee overflow-hidden">
        <div className="experience-track experience-track-left flex w-max gap-5">
          {marqueeItems.map((experience, index) => (
            <article
              key={`${experience.id}-${index}`}
              className="flex w-[300px] shrink-0 flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 shadow-[0_8px_30px_rgba(45,27,104,0.04)] transition-all duration-300 hover:border-[#D8CCFA] hover:shadow-[0_15px_35px_rgba(45,27,104,0.08)] sm:w-[350px]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E8DEFF]/60 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#5B3DF5]">
                    <MessageCircle size={12} />
                    {experience.category}
                  </span>

                  <Quote size={21} className="text-[#E8DEFF]" />
                </div>

                <p className="mt-5 text-[13px] font-medium leading-7 text-[#51476E]">
                  “{experience.quote}”
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#F0EDF4] pt-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${experience.background} text-sm font-extrabold text-[#2D1B68]`}
                  >
                    {experience.initials}
                  </span>

                  <div>
                    <p className="text-xs font-extrabold text-[#2D1B68]">
                      Sample learner
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#938BA1]">
                      Illustrative experience
                    </p>
                  </div>
                </div>

                <ArrowUpRight size={16} className="text-[#A69BBE]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}