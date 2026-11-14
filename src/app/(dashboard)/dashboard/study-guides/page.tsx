"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  FileText,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";

import {
  studyGuideLectures,
  type GuideBlock,
  type StudyLecture,
} from "@/data/mock/dashboard/study-guides";

export default function StudyGuidesPage() {
  const [activeLecture, setActiveLecture] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const lecture = studyGuideLectures.find(
    (item) => item.id === activeLecture,
  ) as StudyLecture;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lectureParam = Number(params.get("lecture"));

    if (
      Number.isInteger(lectureParam) &&
      studyGuideLectures.some((item) => item.id === lectureParam)
    ) {
      setActiveLecture(lectureParam);
    }
  }, []);

  const changeLecture = (id: number) => {
    setActiveLecture(id);
    setSearchQuery("");

    const url = new URL(window.location.href);
    url.searchParams.set("lecture", String(id));

    window.history.replaceState({}, "", url.toString());

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const searchableSections = useMemo(() => {
    if (!lecture) return [];

    const query = searchQuery.trim().toLowerCase();

    if (!query) return lecture.sections;

    return lecture.sections.filter((section) => {
      const sectionText = [
        section.title,
        ...section.blocks.map((block) =>
          JSON.stringify(block),
        ),
      ]
        .join(" ")
        .toLowerCase();

      return sectionText.includes(query);
    });
  }, [lecture, searchQuery]);

  const shareLecture = async () => {
    const url = new URL(window.location.href);

    url.searchParams.set("lecture", String(activeLecture));

    try {
      await navigator.clipboard.writeText(url.toString());

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      window.prompt("Copy this lecture link:", url.toString());
    }
  };

  const previousLecture = () => {
    if (activeLecture > 1) {
      changeLecture(activeLecture - 1);
    }
  };

  const nextLecture = () => {
    if (activeLecture < 12) {
      changeLecture(activeLecture + 1);
    }
  };

  return (
    <div className="dashboard-content space-y-5">
      {/* Guide header */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#4930D1] to-[#5B3DF5] p-5 text-white shadow-md sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <BookOpen size={25} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold sm:text-2xl">
                  QNurse Study Notes
                </h1>

                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Demo
                </span>
              </div>

              <p className="mt-1 text-sm text-white/85">
                Nursing review notes organized into 12 lectures.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide">
              Lecture {activeLecture}
            </span>

            <button
              type="button"
              onClick={shareLecture}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}

              {copied ? "Link copied" : "Share"}
            </button>
          </div>
        </div>
      </section>

      {/* Lecture navigation */}
      <section className="dashboard-card rounded-2xl p-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {studyGuideLectures.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeLecture(item.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeLecture === item.id
                  ? "bg-[#5B3DF5] text-white shadow-sm"
                  : "dashboard-muted hover:bg-violet-50 hover:text-[#5B3DF5]"
              }`}
            >
              Lecture {item.id}
            </button>
          ))}
        </div>
      </section>

      {/* Lecture information */}
      <section className="dashboard-card overflow-hidden rounded-2xl">
        <div className="h-1.5 bg-[#5B3DF5]"/>

        <div className="space-y-6 p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[#B84F91] to-[#F5A623]" />

                <div>
                  <h2 className="dashboard-heading text-lg font-bold sm:text-xl">
                    Lecture {lecture.id}: {lecture.title}
                  </h2>

                  <p className="dashboard-muted mt-2 text-sm">
                    {lecture.sections.length > 0
                      ? `${lecture.sections.length} study sections`
                      : "Lecture content coming soon"}
                  </p>
                </div>
              </div>
            </div>

            <span className="dashboard-muted flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
              <Clock3 size={14} />
              {lecture.duration}
            </span>
          </div>

          {/* Search */}
          {lecture.sections.length > 0 && (
            <div className="relative">
              <Search
                size={17}
                className="dashboard-muted absolute left-4 top-1/2 -translate-y-1/2"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search within this lecture..."
                className="dashboard-search h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition focus:border-[#5B3DF5]"
              />
            </div>
          )}

          {/* Content */}
          {lecture.sections.length > 0 ? (
            <div className="rounded-2xl border border-[var(--guide-border)] p-4 sm:p-5 lg:p-6">
              <div className="mb-6 flex flex-col justify-between gap-2 border-b border-[var(--guide-border)] pb-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="dashboard-heading text-lg font-bold">
                    Lecture {lecture.id}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-[#5B3DF5]">
                    {lecture.title}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  Demonstration notes
                </span>
              </div>

              {searchableSections.length > 0 ? (
                <div className="grid gap-x-7 gap-y-8 lg:grid-cols-2">
                  {searchableSections.map((section) => (
                    <article
                      key={section.id}
                      className="min-w-0 space-y-4"
                    >
                      <h3 className="flex items-start gap-2 text-base font-bold text-[#0875C1]">
                        <span className="mt-1 text-[#F5A623]">
                          ›
                        </span>

                        {section.title}
                      </h3>

                      <div className="space-y-4">
                        {section.blocks.map((block, index) => (
                          <GuideContent
                            key={`${section.id}-${index}`}
                            block={block}
                          />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Search
                    size={30}
                    className="dashboard-muted mx-auto mb-3"
                  />

                  <h3 className="dashboard-heading font-semibold">
                    No matching notes found
                  </h3>

                  <p className="dashboard-muted mt-1 text-sm">
                    Try another keyword.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-[#5B3DF5]">
                <FileText size={27} />
              </div>

              <h3 className="dashboard-heading mt-5 text-lg font-bold">
                Lecture content coming soon
              </h3>

              <p className="dashboard-muted mx-auto mt-2 max-w-md text-sm leading-6">
                We're preparing the demonstration notes for this
                lecture. In the meantime, you can explore Lecture 1.
              </p>

              <button
                type="button"
                onClick={() => changeLecture(1)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B3DF5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4930D1]"
              >
                <BookOpen size={16} />
                Open Lecture 1
              </button>
            </div>
          )}

          {/* Demo disclaimer */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Sparkles
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Demonstration content
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                These notes demonstrate the QNurse reading experience.
                They are not official clinical guidance or a substitute
                for approved nursing education materials. Reference
                values and clinical information should be verified
                against authoritative educational resources.
              </p>
            </div>
          </div>

          {/* Lecture navigation buttons */}
          <div className="flex items-center justify-between gap-3 border-t border-[var(--guide-border)] pt-5">
            <button
              type="button"
              onClick={previousLecture}
              disabled={activeLecture === 1}
              className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              <span>Previous</span>
            </button>

            <span className="dashboard-muted text-xs font-medium">
              {activeLecture} of 12
            </span>

            <button
              type="button"
              onClick={nextLecture}
              disabled={activeLecture === 12}
              className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4930D1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Next Lecture</span>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------
   REUSABLE STUDY GUIDE CONTENT RENDERER
------------------------------------------------------- */

function GuideContent({
  block,
}: {
  block: GuideBlock;
}) {
  if (block.type === "heading") {
    return (
      <h4 className="pt-1 text-sm font-bold text-[#0875C1]">
        {block.title}
      </h4>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="dashboard-body text-sm leading-7">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";

    return (
      <ListTag
        className={`dashboard-body space-y-2 pl-5 text-sm leading-7 ${
          block.ordered ? "list-decimal" : "list-disc"
        }`}
      >
        {block.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ListTag>
    );
  }

 if (block.type === "callout") {
  return (
    <div className="guide-callout rounded-xl border p-4">
      {block.title && (
        <h4 className="guide-callout-title mb-2 text-sm font-bold">
          {block.title}
        </h4>
      )}

      <p className="guide-callout-text text-sm leading-7">
        {block.text}
      </p>
    </div>
  );
}

  if (block.type === "table") {
    return (
      <div className="min-w-0 space-y-2">
        {block.title && (
          <h4 className="text-sm font-semibold text-[#0875C1]">
            {block.title}
          </h4>
        )}

        <div className="overflow-x-auto rounded-lg border border-[#E5E1DC]">
          <table className="w-full min-w-[360px] border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#5B3DF5] text-white">
                {block.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border-r border-white/20 px-3 py-3 font-semibold last:border-r-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex % 2 === 0
                      ? "bg-[#FCF8FA]"
                      : "bg-white"
                  }
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-r border-t border-[#E5E1DC] px-3 py-2.5 leading-5 text-slate-700 last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}