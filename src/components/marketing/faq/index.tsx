"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { faqs } from "@/data/mock/faqs";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-[#FAF7F5] px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Heading */}
        <div className="text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#C46C99]">
            Before you begin
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2D1B68] sm:text-4xl lg:text-[46px]">
            A few helpful answers
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#777087] sm:text-base">
            The details nursing students ask about most.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <article
                key={faq.id}
                className={`overflow-hidden rounded-[20px] border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-[#E8C9D9] shadow-[0_8px_25px_rgba(45,27,104,0.045)]"
                    : "border-[#EAE4E0] shadow-[0_2px_5px_rgba(45,27,104,0.025)] hover:border-[#DCC9D5]"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex min-h-[68px] w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
                >
                  <span className="text-sm font-extrabold leading-6 text-[#2D1B68] sm:text-[15px]">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                      isOpen
                        ? "bg-[#FCE8F0] text-[#B34F83]"
                        : "bg-transparent text-[#51476E]"
                    }`}
                  >
                    <ChevronDown
                      size={19}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-[#F1EBEF] px-5 pb-6 pt-5 sm:px-7">
                      <p className="max-w-[950px] text-sm leading-7 text-[#777087]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}