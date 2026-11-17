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
    emptyMessage:
      "Your saved exam flashcards will appear here.",
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
    <article className="dashboard-card flex min-w-0 items-start gap-3 rounded-2xl border border-[var(--dash-border)] p-4 transition hover:border-[#B7A8FF] sm:gap-4 sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#5B3DF5]">
        <BookOpen size={20} />
      </div>

      <div className="min-w-0 flex-1">
        {item.href ? (
          <Link
            href={item.href}
            className="dashboard-heading line-clamp-2 text-sm font-bold leading-6 transition hover:text-[#5B3DF5]"
          >
            {item.title}
          </Link>
        ) : (
          <h3 className="dashboard-heading line-clamp-2 text-sm font-bold leading-6">
            {item.title}
          </h3>
        )}

        {item.description && (
          <p className="dashboard-muted mt-1 line-clamp-2 text-sm leading-6">
            {item.description}
          </p>
        )}

        {metadata.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {metadata.map(([key, value]) => (
              <span
                key={key}
                className="rounded-lg bg-[#F1EDFF] px-2.5 py-1 text-[11px] font-semibold text-[#6046CE]"
              >
                {value}
              </span>
            ))}
          </div>
        )}

        <p className="dashboard-muted mt-3 text-xs">
          {formatSavedDate(item.savedAt)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item)}
        aria-label={`Remove ${item.title} from My Library`}
        title="Remove from library"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={17} />
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
    <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1440px] space-y-9 px-4 py-2 sm:px-6 lg:px-8">
      {/* PAGE HEADER */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="dashboard-accent-icon">
            <Library size={19} />
          </div>

          <span className="dashboard-section-label">
            YOUR PERSONAL COLLECTION
          </span>
        </div>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="dashboard-heading text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              My Library
            </h1>

            <p className="dashboard-muted mt-3 text-sm leading-7 sm:text-base">
              Everything you've saved to come back to — questions,
              flashcards, care plans and study topics.
            </p>
          </div>

          <div className="dashboard-card flex w-full items-center gap-4 rounded-2xl border p-4 sm:w-fit sm:min-w-[175px]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#5B3DF5]">
              <Bookmark size={21} />
            </div>

            <div>
              <p className="dashboard-heading text-2xl font-extrabold">
                {savedItems.length}
              </p>

              <p className="dashboard-muted text-xs">
                Total saved items
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION INTRODUCTION */}
      <section className="flex items-start gap-4 rounded-2xl border border-[#DED5FF] bg-[#F7F4FF] p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#5B3DF5]">
          <Sparkles size={19} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#39258F]">
            Your learning collection
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#685B9D]">
            Keep your important learning materials together.
            Save questions, study cards, care plans and topics
            as you explore QbankNurse.
          </p>
        </div>
      </section>

      {/* LIBRARY SECTIONS */}
      <div className="space-y-10">
        {librarySections.map((section) => {
          const sectionItems = savedItems.filter(
            (item) => item.type === section.type,
          );

          const Icon = section.icon;

          return (
            <section
              key={section.type}
              className="min-w-0 space-y-4"
            >
              {/* SECTION HEADER */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#5B3DF5]">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="dashboard-heading text-base font-extrabold sm:text-lg">
                      {section.title}
                    </h2>

                    <p className="dashboard-muted mt-1 hidden text-xs sm:block">
                      {section.description}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-[#F0EBFF] px-3 py-1.5 text-xs font-bold text-[#5B3DF5]">
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
                <div className="dashboard-card flex flex-col items-center rounded-2xl border border-dashed border-[var(--dash-border)] px-5 py-9 text-center sm:py-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F1FF] text-[#8065E8]">
                    <Icon size={22} />
                  </div>

                  <h3 className="dashboard-heading mt-4 text-sm font-bold">
                    Nothing saved here yet
                  </h3>

                  <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
                    {section.emptyMessage}
                  </p>

                  <Link
                    href={section.actionHref}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4930D4]"
                  >
                    {section.actionLabel}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-center gap-2 border-t border-[var(--dash-border)] pt-6 pb-3 text-center">
        <Bookmark size={14} className="shrink-0 text-[#8065E8]" />

        <p className="dashboard-muted text-xs">
          Your saved learning materials, organized in one place.
        </p>
      </div>
    </div>
  );
}