"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { examLibrary, type ExamSet } from "@/data/mock/exam-library";

const categoryStyles: Record<string, string> = {
  Fundamentals: "bg-[#FCE8F0] text-[#B34F83]",
  "Core Series": "bg-[#E8DEFF] text-[#5B3DF5]",
  Specialties: "bg-[#FCE8F0] text-[#B34F83]",
  "Nursing Math": "bg-[#FFF0D9] text-[#B77927]",
  "Exit Exam": "bg-[#FFF0D9] text-[#B77927]",
};

function formatCount(value: number) {
  return `${Math.round(value / 1000)}K`;
}

function ExamPreview({
  exam,
  onClose,
}: {
  exam: ExamSet;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2D1B68]/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-preview-title"
        className="w-full max-w-lg rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${
                categoryStyles[exam.category] ??
                "bg-[#F1ECFF] text-[#5B3DF5]"
              }`}
            >
              {exam.category}
            </span>

            <h3
              id="exam-preview-title"
              className="mt-4 text-xl font-extrabold text-[#2D1B68]"
            >
              {exam.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F2F8] text-[#716887] transition-colors hover:bg-[#E8DEFF] hover:text-[#5B3DF5]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-5 text-sm leading-7 text-[#777087]">
          {exam.description}
        </p>

        <div className="mt-6 space-y-3 rounded-2xl bg-[#FCFAFD] p-4">
          <div className="flex items-center gap-3 text-sm text-[#51476E]">
            <CheckCircle2 size={17} className="text-[#5B3DF5]" />
            Answer explanations included
          </div>

          <div className="flex items-center gap-3 text-sm text-[#51476E]">
            <CheckCircle2 size={17} className="text-[#5B3DF5]" />
            NGN practice formats
          </div>

          <div className="flex items-center gap-3 text-sm text-[#51476E]">
            <CheckCircle2 size={17} className="text-[#5B3DF5]" />
            Study at your own pace
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href={exam.href}
            onClick={onClose}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-5 text-sm font-extrabold text-white transition-colors hover:bg-[#492BD8]"
          >
            Open study set
            <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-xl border border-[#E8E1EE] px-5 text-sm font-bold text-[#716887] transition-colors hover:bg-[#F8F5FA]"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamLibrary() {
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState<ExamSet | null>(null);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return examLibrary;

    return examLibrary.filter((exam) => {
      return (
        exam.title.toLowerCase().includes(query) ||
        exam.category.toLowerCase().includes(query) ||
        exam.description.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <section
      id="study-library"
      className="scroll-mt-24 bg-[#FFFCFA] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Heading and search */}
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex rounded-full bg-[#FCE8F0] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#B34F83]">
              Choose a study set
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2D1B68] sm:text-4xl">
              Find the exam you need today
            </h2>

            <p className="mt-3 max-w-[600px] text-sm leading-6 text-[#777087]">
              Browse by course, practise at your own pace, and review the
              reasoning behind every answer.
            </p>
          </div>

          <div className="relative w-full lg:max-w-[340px]">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#938BA1]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find Pharmacology, Pediatrics, and more..."
              aria-label="Search study sets"
              className="h-12 w-full rounded-xl border border-[#E8E1E9] bg-white pl-11 pr-4 text-xs text-[#2D1B68] shadow-sm outline-none transition-all placeholder:text-[#AAA2B2] focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10"
            />
          </div>
        </div>

        {/* Results information */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#938BA1]">
            {filteredExams.length} study{" "}
            {filteredExams.length === 1 ? "set" : "sets"} available
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs font-bold text-[#5B3DF5] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Exam cards */}
        {filteredExams.length > 0 ? (
          <div className="mt-5 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredExams.map((exam) => (
              <article
                key={exam.id}
                className="flex min-w-0 flex-col rounded-[20px] border border-[#EAE4E9] bg-white p-4 shadow-[0_5px_18px_rgba(45,27,104,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E8C5D7] hover:shadow-[0_15px_35px_rgba(45,27,104,0.08)]"
              >
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`max-w-[70%] truncate rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${
                      categoryStyles[exam.category] ??
                      "bg-[#F1ECFF] text-[#5B3DF5]"
                    }`}
                  >
                    {exam.category}
                  </span>

                  {exam.isFree && (
                    <span className="shrink-0 rounded-full bg-[#FFF5E8] px-2.5 py-1 text-[9px] font-bold text-[#A66A20]">
                      ★ Free
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-4 min-h-[44px] text-[14px] font-extrabold leading-6 text-[#2D1B68]">
                  {exam.title}
                </h3>

                {/* Demo statistics */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#817990]">
                  <span className="inline-flex items-center gap-1">
                    <Star
                      size={11}
                      className="fill-[#D58A42] text-[#D58A42]"
                    />
                    {exam.rating.toFixed(1)} ({exam.reviews.toLocaleString()})
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Eye size={11} />
                    {formatCount(exam.views)} views
                  </span>
                </div>

                {/* Capabilities */}
                <div className="mt-4 space-y-2">
                  {exam.hasRationales && (
                    <div className="flex items-center gap-2 text-[10px] font-medium text-[#716887]">
                      <FileText size={12} className="shrink-0" />
                      Answer reasoning included
                    </div>
                  )}

                  {exam.hasNgn && (
                    <div className="flex items-center gap-2 text-[10px] font-medium text-[#716887]">
                      <CheckCircle2
                        size={12}
                        className="shrink-0 text-[#C46C99]"
                      />
                      NGN practice formats
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 flex-1 text-[11px] leading-[1.7] text-[#777087]">
                  {exam.description}
                </p>

                {/* Actions */}
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExam(exam)}
                    className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#FCE8F0] px-3 text-xs font-bold text-[#B34F83] transition-colors hover:bg-[#F7D7E5]"
                  >
                    <Sparkles size={13} />
                    Preview the set
                  </button>

                  <Link
                    href={exam.href}
                    className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-3 text-xs font-extrabold text-white transition-colors hover:bg-[#492BD8]"
                  >
                    Open {exam.title}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[#DDD4E8] bg-white px-5 py-16 text-center">
            <Search size={28} className="mx-auto text-[#AAA1B2]" />

            <h3 className="mt-4 text-base font-extrabold text-[#2D1B68]">
              No study sets found
            </h3>

            <p className="mt-2 text-sm text-[#777087]">
              Try another subject or search using a different keyword.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 text-sm font-bold text-[#5B3DF5] hover:underline"
            >
              View all study sets
            </button>
          </div>
        )}

        {/* Demo data disclosure */}
        <p className="mt-7 text-center text-[10px] text-[#AAA2B2]">
          Demonstration catalogue — ratings, views and availability are sample data.
        </p>
      </div>

      {selectedExam && (
        <ExamPreview
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </section>
  );
}