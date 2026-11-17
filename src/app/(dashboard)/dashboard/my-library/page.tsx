"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Bookmark,
  BookOpen,
  BookMarked,
  ClipboardList,
  FileQuestion,
  Layers,
  Library,
  NotebookText,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  getSavedItems,
  removeSavedItem,
  subscribeToSavedItems,
  type SavedItem,
  type SavedItemType,
} from "@/lib/saved-items";

interface LibrarySection {
  type: SavedItemType;
  title: string;
  description: string;
  emptyMessage: string;
  actionLabel: string;
  actionHref: string;
  icon: LucideIcon;
}

const librarySections: LibrarySection[] = [
  {
    type: "question",
    title: "Saved Questions",
    description: "Questions bookmarked during practice.",
    emptyMessage:
      "Questions you bookmark while practising will appear here.",
    actionLabel: "Explore questions",
    actionHref: "/dashboard/study-library",
    icon: FileQuestion,
  },
  {
    type: "exam-flashcard",
    title: "Saved Exam Flashcards",
    description: "Important concepts saved for exam revision.",
    emptyMessage: "Your saved exam flashcards will appear here.",
    actionLabel: "Explore flashcards",
    actionHref: "/dashboard/flashcards",
    icon: BookMarked,
  },
  {
    type: "study-card",
    title: "Saved Study Cards",
    description: "Nursing concepts you want to revisit.",
    emptyMessage:
      "Save a Study Card to keep it in your personal collection.",
    actionLabel: "Explore Study Cards",
    actionHref: "/dashboard/study-cards",
    icon: Layers,
  },
  {
    type: "care-plan",
    title: "Saved Care Plans",
    description: "Your bookmarked nursing care plans.",
    emptyMessage:
      "Bookmark care plans to access them quickly whenever you need them.",
    actionLabel: "Explore Care Plans",
    actionHref: "/dashboard/care-plans",
    icon: ClipboardList,
  },
  {
    type: "study-topic",
    title: "Saved Study Topics",
    description: "Subjects you've added to your learning collection.",
    emptyMessage:
      "Save subjects from your Study Hub to find them here.",
    actionLabel: "Explore Study Hub",
    actionHref: "/dashboard/study-hub",
    icon: NotebookText,
  },
];

function formatSavedDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Saved";
  }

  return `Saved ${parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function SavedItemCard({
  item,
  onRemove,
}: {
  item: SavedItem;
  onRemove: (item: SavedItem) => void;
}) {
  const metadata = Object.entries(item.metadata ?? {}).filter(
    ([key]) => key !== "subjectId",
  );

  return (
    <article className="dashboard-card flex min-w-0 items-start gap-3 rounded-xl border border-[var(--dash-border)] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B7A8FF] hover:shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EBFF] text-[#5B3DF5]">
        <BookOpen size={17} />
      </div>

      <div className="min-w-0 flex-1">
        {item.href ? (
          <Link
            href={item.href}
            className="dashboard-heading line-clamp-2 text-sm font-bold leading-5 transition hover:text-[#5B3DF5]"
          >
            {item.title}
          </Link>
        ) : (
          <h3 className="dashboard-heading line-clamp-2 text-sm font-bold leading-5">
            {item.title}
          </h3>
        )}

        {item.description && (
          <p className="dashboard-muted mt-1 line-clamp-2 text-xs leading-5">
            {item.description}
          </p>
        )}

        {metadata.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {metadata.map(([key, value]) => (
              <span
                key={key}
                className="rounded-md bg-[#F1EDFF] px-2 py-1 text-[10px] font-semibold text-[#6046CE]"
              >
                {value}
              </span>
            ))}
          </div>
        )}

        <p className="dashboard-muted mt-2 text-[10px]">
          {formatSavedDate(item.savedAt)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item)}
        aria-label={`Remove ${item.title} from My Library`}
        title="Remove from library"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={15} />
      </button>
    </article>
  );
}

export default function MyLibraryPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const syncSavedItems = () => {
      setSavedItems(getSavedItems());
    };

    syncSavedItems();

    return subscribeToSavedItems(syncSavedItems);
  }, []);

  const handleRemove = (item: SavedItem) => {
    removeSavedItem(item.id, item.type);
  };

  return (
    <main className="w-full pb-8">
      {/* SLIM MY LIBRARY HERO */}
      <section className="relative isolate flex min-h-[175px] w-full items-center overflow-hidden bg-[#17263F] px-5 py-6 text-white sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -right-4 -bottom-32 h-56 w-56 rounded-full border border-white/[0.04]" />

        <div className="relative z-10 flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-[#B9A9FF]">
              <Library size={13} />
              YOUR PERSONAL COLLECTION
            </span>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              My Library
              <span className="text-[#B9A9FF]">.</span>
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/65">
              Everything you've saved to come back to — questions,
              flashcards, care plans and study topics.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B9A9FF]/15 text-[#B9A9FF]">
              <Bookmark size={17} />
            </div>

            <div>
              <p className="text-xl font-extrabold leading-none text-white">
                {savedItems.length}
              </p>

              <p className="mt-1 text-[10px] font-medium text-white/55">
                Total saved items
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PAGE CONTENT */}
      <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1600px] space-y-7 px-5 py-7 sm:px-7 lg:px-9">

        {/* COLLECTION INTRODUCTION */}
        <section className="dashboard-inner-card flex items-start gap-3 rounded-xl border p-3.5 sm:p-4">
          <div className="dashboard-accent-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Sparkles size={17} />
          </div>

          <div>
            <h2 className="dashboard-heading text-sm font-bold">
              Your learning collection
            </h2>

            <p className="dashboard-muted mt-1 text-xs leading-5">
              Keep your important learning materials together. Save
              questions, study cards, care plans and topics as you explore
              QbankNurse.
            </p>
          </div>
        </section>

        {/* LIBRARY SECTIONS */}
        <div className="space-y-7">
          {librarySections.map((section) => {
            const sectionItems = savedItems.filter(
              (item) => item.type === section.type,
            );

            const Icon = section.icon;

            return (
              <section
                key={section.type}
                className="min-w-0 space-y-3"
              >
                {/* SECTION HEADER */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EBFF] text-[#5B3DF5]">
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="dashboard-heading text-sm font-extrabold sm:text-base">
                        {section.title}
                      </h2>

                      <p className="dashboard-muted mt-0.5 hidden text-[11px] sm:block">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#F0EBFF] px-2.5 py-1 text-[10px] font-bold text-[#5B3DF5]">
                    {sectionItems.length}
                  </span>
                </div>

                {/* SECTION CONTENT */}
                {sectionItems.length > 0 ? (
                  <div className="grid min-w-0 gap-3 xl:grid-cols-2">
                    {sectionItems.map((item) => (
                      <SavedItemCard
                        key={`${item.type}-${item.id}`}
                        item={item}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="dashboard-card flex flex-col items-center rounded-xl border border-dashed border-[var(--dash-border)] px-5 py-7 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F1FF] text-[#8065E8]">
                      <Icon size={19} />
                    </div>

                    <h3 className="dashboard-heading mt-3 text-sm font-bold">
                      Nothing saved here yet
                    </h3>

                    <p className="dashboard-muted mt-1.5 max-w-sm text-xs leading-5">
                      {section.emptyMessage}
                    </p>

                    <Link
                      href={section.actionHref}
                      className="dashboard-primary-button mt-4 inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition hover:-translate-y-0.5"
                    >
                      {section.actionLabel}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 border-t border-[var(--dash-border)] pt-5 pb-2 text-center">
          <Bookmark size={13} className="shrink-0 text-[#8065E8]" />

          <p className="dashboard-muted text-[11px]">
            Your saved learning materials, organized in one place.
          </p>
        </div>
      </div>
    </main>
  );
}