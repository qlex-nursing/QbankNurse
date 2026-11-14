import { Star } from "lucide-react";

import { studentStories } from "@/data/mock/student-success";

const accentStyles = {
  red: "bg-[#FCE4E9] text-[#C45D7C]",
  indigo: "bg-[#EAE4FF] text-[#6751C8]",
  apricot: "bg-[#FFF0DC] text-[#BD813D]",
  teal: "bg-[#E0F3EF] text-[#409987]",
};

export default function StudentStories() {
  return (
    <section className="bg-[#FFFCFA] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Heading */}
        <div className="mx-auto max-w-[600px] text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C46C99]">
            After the exam
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#2D1B68] sm:text-4xl lg:text-[44px]">
            Their study stories,
            <br />

            <span className="text-[#777087]">
              in their own words.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#777087]">
            Every learning journey is different. Here are some
            illustrative stories showing the experiences we want
            QNurse learners to have.
          </p>
        </div>

        {/* Stories */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {studentStories.map((story) => (
            <article
              key={story.id}
              className="flex h-full flex-col rounded-[22px] border border-[#EEE7EC] bg-white p-6 shadow-[0_5px_22px_rgba(45,27,104,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E5CBD9] hover:shadow-[0_15px_35px_rgba(45,27,104,0.07)] sm:p-7"
            >
              {/* Stars */}
              <div
                className="flex gap-1"
                aria-label="Illustrative five-star display"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className="fill-[#C46C99] text-[#C46C99]"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-5 flex-1 text-sm leading-7 text-[#716887]">
                &ldquo;{story.quote}&rdquo;
              </blockquote>

              {/* Learner details */}
              <div className="mt-7 flex items-center gap-3 border-t border-[#F0EAF0] pt-5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${accentStyles[story.accent]}`}
                >
                  {story.initials}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-xs font-extrabold text-[#2D1B68]">
                    {story.name}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-[#938BA1]">
                    {story.exam}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-[#B4AAB7]">
                Illustrative learner story
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}