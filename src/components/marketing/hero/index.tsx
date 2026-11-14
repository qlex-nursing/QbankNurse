"use client";

import { useState } from "react";
import Link from "next/link";
import StudentResults from "@/components/marketing/student-results";
import { heroQuestions } from "@/data/mock/hero-questions";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  HeartPulse,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";



export default function Hero() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const question = heroQuestions[questionIndex];
  const correct = selectedAnswer === question.answer;

  const submitAnswer = () => {
    if (!selectedAnswer || submitted) return;
    setSubmitted(true);
  };

  const nextQuestion = () => {
    setQuestionIndex((current) => (current + 1) % heroQuestions.length);
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  const restart = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#FFFCFA]">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[500px] w-[500px] rounded-full bg-[#E8DEFF]/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-48 left-[20%] -z-10 h-[400px] w-[400px] rounded-full bg-[#FFF275]/20 blur-3xl" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:px-12 lg:py-28">
        {/* LEFT: HERO MESSAGE */}
        <div className="max-w-[660px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8DEFF] bg-white px-4 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8DEFF] text-[#5B3DF5]">
              <Sparkles size={13} />
            </span>

            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2D1B68]">
              Your preparation, your progress
            </span>
          </div>

          <h1 className="mt-8 text-[43px] font-extrabold leading-[1.13] tracking-[-2.5px] text-[#2D1B68] sm:text-[56px] lg:text-[64px]">
            Prepare with purpose.
            <br />

            Take on{" "}
            <span className="text-[#5B3DF5]">ATI</span>
            <br />

            and{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#E85D5D]">HESI</span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded-full bg-[#FFD6A5]" />
            </span>

            <span className="text-[#2D1B68]"> with confidence.</span>
          </h1>

          <p className="mt-7 max-w-[550px] text-[15px] leading-8 text-[#777087] sm:text-[16px]">
            Turn your study time into meaningful progress with focused nursing
            exam practice, realistic questions, clinical reasoning and
            detailed explanations that help you understand the why behind
            every answer.
          </p>

         {/* Main actions */}
<div className="mt-9 flex flex-col gap-3 sm:flex-row">
  <Link
    href="#practice-preview"
    className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-[#FFD6A5] px-8 text-sm font-extrabold text-[#2D1B68] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFC98C] hover:shadow-md"
  >
    Try a Practice Test
    <ArrowRight
      size={17}
      className="transition-transform group-hover:translate-x-1"
    />
  </Link>

  <Link
    href="#exam-categories"
    className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full border border-[#E2DCEA] bg-white px-8 text-sm font-bold text-[#2D1B68] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5B3DF5] hover:bg-[#F8F5FF]"
  >
    Explore the Exam Library
    <ArrowRight size={17} />
  </Link>
</div>

          {/* Supporting points */}
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-[#ECE7F2] pt-7">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-[#5B3DF5]" />
              <span className="text-xs font-semibold text-[#625A73]">
                Practice with purpose
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Target size={17} className="text-[#E85D5D]" />
              <span className="text-xs font-semibold text-[#625A73]">
                Strengthen clinical reasoning
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE PRACTICE */}
        <div
  id="practice-preview"
  className="relative mx-auto w-full max-w-[570px] scroll-mt-28 lg:ml-auto"
>
          {/* Floating accent */}
          <div className="absolute -right-3 -top-5 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF275] text-[#2D1B68] shadow-lg shadow-[#2D1B68]/10 sm:-right-5">
            <HeartPulse size={27} />
          </div>

          <div className="overflow-hidden rounded-[26px] border border-[#E7E0EF] bg-white shadow-[0_25px_75px_rgba(45,27,104,0.10)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0EDF4] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D1B68] text-white">
                  <BookOpen size={20} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[#2D1B68]">
                    Practice Studio
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#938BA1]">
                    Interactive question preview
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#E8DEFF] px-3 py-1.5 text-[10px] font-extrabold text-[#5B3DF5]">
                DEMO
              </span>
            </div>

            {/* Progress */}
            <div className="px-5 pt-6 sm:px-7">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#51476E]">
                  Question {questionIndex + 1} of {heroQuestions.length}
                </span>

                <span className="text-xs font-bold text-[#5B3DF5]">
                  {Math.round(
                    ((questionIndex + 1) / heroQuestions.length) * 100,
                  )}
                  %
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0EDF5]">
                <div
                  className="h-full rounded-full bg-[#5B3DF5] transition-all duration-300"
                  style={{
                    width: `${((questionIndex + 1) / heroQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="px-5 pb-6 pt-7 sm:px-7">
              <span className="rounded-md bg-[#F1ECFF] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#5B3DF5]">
                {question.category}
              </span>

              <h2 className="mt-4 text-[15px] font-bold leading-7 text-[#2D1B68] sm:text-[16px]">
                {question.question}
              </h2>

              {/* Answer choices */}
              <div className="mt-6 space-y-3">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrectOption = question.answer === option.id;

                  let style =
                    "border-[#EAE6F0] bg-white hover:border-[#C5B5F0]";

                  if (isSelected && !submitted) {
                    style = "border-[#5B3DF5] bg-[#F7F4FF]";
                  }

                  if (submitted && isCorrectOption) {
                    style = "border-[#A8D38A] bg-[#F5FAF0]";
                  }

                  if (submitted && isSelected && !correct) {
                    style = "border-[#E7AAAA] bg-[#FFF5F5]";
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={submitted}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedAnswer(option.id)}
                      className={`flex min-h-[58px] w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors disabled:cursor-default ${style}`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                          submitted && isCorrectOption
                            ? "bg-[#5B3DF5] text-white"
                            : submitted && isSelected && !correct
                              ? "bg-[#D85B5B] text-white"
                              : isSelected
                                ? "bg-[#5B3DF5] text-white"
                                : "bg-[#F1EEF6] text-[#716984]"
                        }`}
                      >
                        {option.id}
                      </span>

                      <span className="flex-1 text-[11px] font-semibold leading-5 text-[#625A73] sm:text-xs">
                        {option.text}
                      </span>

                      {submitted && isCorrectOption && (
                        <Check size={17} className="shrink-0 text-[#5B3DF5]" />
                      )}

                      {submitted && isSelected && !correct && (
                        <X size={17} className="shrink-0 text-[#D85B5B]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer feedback */}
              {submitted && (
                <div
                  aria-live="polite"
                  className={`mt-5 rounded-xl border p-4 ${
                    correct
                      ? "border-[#D6C9FF] bg-[#F7F4FF]"
                      : "border-[#EBCFCF] bg-[#FFF7F7]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {correct ? (
                      <CheckCircle2 size={17} className="text-[#5B3DF5]" />
                    ) : (
                      <X size={17} className="text-[#C94C4C]" />
                    )}

                    <p className="text-xs font-extrabold text-[#2D1B68]">
                      {correct
                        ? "Excellent! That's correct."
                        : "Keep learning. Here's why."}
                    </p>
                  </div>

                  <p className="mt-3 text-[11px] font-extrabold text-[#51476E]">
                    Answer rationale
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#716984]">
                    {question.rationale}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between gap-3">
                {!submitted ? (
                  <>
                    <button
                      type="button"
                      disabled={!selectedAnswer}
                      onClick={() => setSelectedAnswer(null)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-bold text-[#817990] transition-colors hover:bg-[#F5F2F9] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <RotateCcw size={14} />
                      Clear
                    </button>

                    <button
                      type="button"
                      disabled={!selectedAnswer}
                      onClick={submitAnswer}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#5B3DF5] px-5 text-xs font-bold text-white transition-colors hover:bg-[#492BD8] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Check Answer
                      <ArrowRight size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-bold text-[#817990] transition-colors hover:bg-[#F5F2F9]"
                    >
                      <RotateCcw size={14} />
                      Restart
                    </button>

                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FFD6A5] px-5 text-xs font-extrabold text-[#2D1B68] transition-colors hover:bg-[#FFC98C]"
                    >
                      Next Question
                      <ArrowRight size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#F0EDF4] bg-[#FEFDFF] px-5 py-4 sm:px-7">
              <span className="text-[10px] font-semibold text-[#938BA1]">
                Learn at your own pace
              </span>

              <span className="text-[10px] font-extrabold text-[#5B3DF5]">
                QNurse Practice Studio
              </span>
            </div>
          </div>
        </div>
      </div>
      <StudentResults />
    </section>
  );
}