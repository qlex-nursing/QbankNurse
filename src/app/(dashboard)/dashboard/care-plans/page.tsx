"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";

import {
  Activity,
  Baby,
  Bone,
  BookOpen,
  Bookmark,
  Brain,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Droplets,
  Eye,
  FlaskConical,
  Hand,
  HeartPulse,
  Search,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wind,
  X,
} from "lucide-react";

import {
  carePlanCategories,
  carePlanGuides,
  carePlanWritingSteps,
  totalCarePlanCount,
  type CarePlan,
  type CarePlanCategory,
} from "@/data/mock/dashboard/care-plans";

import {
  getSavedItems,
  subscribeToSavedItems,
  toggleSavedItem,
} from "@/lib/saved-items";

/* =========================================================
   ICONS & TYPES
========================================================= */

const categoryIcons: Record<string, ElementType> = {
  stethoscope: Stethoscope,
  heart: HeartPulse,
  flask: FlaskConical,
  activity: Activity,
  droplets: Droplets,
  bug: Bug,
  hand: Hand,
  baby: Baby,
  brain: Brain,
  bone: Bone,
  eye: Eye,
  wind: Wind,
  scissors: Scissors,
};

type SortMode = "category" | "alphabetical";

/* =========================================================
   MAIN PAGE
========================================================= */

export default function CarePlansPage() {
  const [savedPlanIds, setSavedPlanIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("category");

  const [activePlan, setActivePlan] = useState<CarePlan | null>(null);
  const [activeGuide, setActiveGuide] = useState<
    (typeof carePlanGuides)[number] | null
  >(null);

  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    carePlanCategories.map((category) => category.id),
  );

  /* ---------------------------------------------------------
     MY LIBRARY SYNC
  --------------------------------------------------------- */

  useEffect(() => {
    const syncSavedPlans = () => {
      const savedIds = getSavedItems()
        .filter((item) => item.type === "care-plan")
        .map((item) => item.id);

      setSavedPlanIds(savedIds);
    };

    syncSavedPlans();

    return subscribeToSavedItems(syncSavedPlans);
  }, []);

  const handleToggleSavePlan = (plan: CarePlan) => {
    toggleSavedItem({
      id: String(plan.id),
      type: "care-plan",
      title: plan.title,
      description: plan.description,
      href: "/dashboard/care-plans",
    });
  };

  /* ---------------------------------------------------------
     SEARCH & FILTERING
  --------------------------------------------------------- */

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    const results = carePlanCategories
      .map((category) => {
        if (!normalizedSearch) return category;

        const categoryMatches = [
          category.title,
          category.description,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

        const matchingPlans = category.plans.filter((plan) =>
          [plan.title, plan.description, plan.diagnosis]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch),
        );

        return {
          ...category,
          plans: categoryMatches ? category.plans : matchingPlans,
        };
      })
      .filter((category) => category.plans.length > 0);

    if (sortMode === "alphabetical") {
      return [...results].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    }

    return results;
  }, [normalizedSearch, sortMode]);

  const matchingPlanCount = filteredCategories.reduce(
    (total, category) => total + category.plans.length,
    0,
  );

  const toggleCategory = (id: string) => {
    setExpandedCategories((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const clearSearch = () => setSearchQuery("");

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate min-h-[165px] overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 text-white sm:px-8 lg:px-11">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full bg-[#8B75FF]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#5B3DF5]/20 blur-3xl" />

        <div className="pointer-events-none absolute right-16 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border border-white/[0.06] lg:block" />

        <div className="pointer-events-none absolute right-28 top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-white/[0.07] lg:block" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9BEFF]">
            <Sparkles size={13} />
            Clinical learning resources
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-[#C8BBFF]">
              <HeartPulse size={23} strokeWidth={1.8} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Nursing Care Plans
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Explore structured nursing care plans, understand clinical
            diagnoses, and strengthen your clinical reasoning — one patient
            problem at a time.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <HeroStat
              icon={HeartPulse}
              label="17 body systems"
            />

            <HeroStat
              icon={ClipboardList}
              label={`${totalCarePlanCount} care plan entries`}
            />

            <HeroStat
              icon={BookOpen}
              label={`${carePlanGuides.length} learning guides`}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-2 right-10 hidden text-white/[0.05] lg:block">
          <HeartPulse size={150} strokeWidth={0.8} />
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-[1500px] space-y-8 px-5 pb-8 sm:px-7 lg:px-9">
        {/* FEATURED RESOURCE */}

        <section className="dashboard-card relative overflow-hidden rounded-2xl p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#8066E9]/[0.06] blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-3xl">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8065E8]">
                <ShieldCheck size={16} />
                Build stronger clinical reasoning
              </div>

              <h2 className="dashboard-heading text-xl font-extrabold sm:text-2xl">
                Make better care plans
              </h2>

              <p className="dashboard-muted mt-2 text-sm leading-6">
                Learn how to connect assessment findings, nursing diagnoses,
                patient goals, and evidence-informed interventions into a
                structured care plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("writing-guide")}
              className="dashboard-primary-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5"
            >
              Explore the guide
              <ChevronRight size={17} />
            </button>
          </div>
        </section>

        {/* ===================================================
            QUICK GUIDES
        =================================================== */}

        <section>
          <SectionHeading
            eyebrow="Start learning"
            title="Start with the guides"
            description="Build a strong foundation before exploring individual care plans."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {carePlanGuides.map((guide, index) => (
              <button
                key={guide.id}
                type="button"
                onClick={() => setActiveGuide(guide)}
                className="dashboard-card group flex min-h-[205px] flex-col overflow-hidden rounded-xl text-left transition duration-200 hover:-translate-y-1 hover:border-[#A99AFF] hover:shadow-lg"
              >
                <div
                  className={`h-1 w-full ${
                    index === 0
                      ? "bg-gradient-to-r from-[#5B3DF5] to-[#A99AFF]"
                      : index === 1
                        ? "bg-gradient-to-r from-[#8066E9] to-[#C4B8FF]"
                        : "bg-gradient-to-r from-[#4F46A5] to-[#A99AFF]"
                  }`}
                />

                <div className="flex flex-1 flex-col p-4">
                  <div className="dashboard-soft-icon mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
                    <BookOpen size={19} />
                  </div>

                  <h3 className="dashboard-card-title text-sm font-bold">
                    {guide.title}
                  </h3>

                  <p className="dashboard-muted mt-2 flex-1 text-xs leading-5">
                    {guide.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#8065E8] transition-all group-hover:gap-3">
                    Read guide
                    <ChevronRight size={15} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ===================================================
            CARE PLAN LIBRARY
        =================================================== */}

        <section
          id="care-plan-library"
          className="scroll-mt-8"
        >
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Explore conditions"
              title="Browse the library"
              description="Explore nursing care plans organized by body system."
            />

            {/* Sort controls */}
            <div className="inline-flex self-start rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-1">
              <button
                type="button"
                onClick={() => setSortMode("category")}
                aria-pressed={sortMode === "category"}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  sortMode === "category"
                    ? "bg-[#5B3DF5] text-white shadow-sm"
                    : "dashboard-muted hover:bg-[var(--dash-surface-soft)]"
                }`}
              >
                By category
              </button>

              <button
                type="button"
                onClick={() => setSortMode("alphabetical")}
                aria-pressed={sortMode === "alphabetical"}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  sortMode === "alphabetical"
                    ? "bg-[#5B3DF5] text-white shadow-sm"
                    : "dashboard-muted hover:bg-[var(--dash-surface-soft)]"
                }`}
              >
                A–Z
              </button>
            </div>
          </div>

          {/* Search and results */}
          <div className="dashboard-card mb-5 rounded-xl p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 transition focus-within:border-[#9B88F5] focus-within:ring-2 focus-within:ring-[#8065E8]/10">
                <Search
                  size={18}
                  className="shrink-0 text-[var(--dash-muted)]"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search a condition or nursing diagnosis..."
                  className="w-full min-w-0 bg-transparent text-sm text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-muted)]"
                  aria-label="Search nursing care plans"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="rounded-lg p-1.5 text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface-soft)] hover:text-[var(--dash-text)]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 px-1 sm:justify-end">
                <span className="text-xs text-[var(--dash-muted)]">
                  {matchingPlanCount}{" "}
                  {matchingPlanCount === 1 ? "result" : "results"}
                </span>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-xs font-bold text-[#8065E8] transition hover:text-[#5B3DF5]"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#DCD3FA] bg-[#F4F0FF] px-4 py-3 text-xs text-[#5141A5]">
              <Search size={15} className="shrink-0" />
              <span>
                Showing {matchingPlanCount} matching sample care{" "}
                {matchingPlanCount === 1 ? "plan" : "plans"} for{" "}
                <strong>&ldquo;{searchQuery}&rdquo;</strong>
              </span>
            </div>
          )}

          {/* Empty state */}
          {filteredCategories.length === 0 ? (
            <div className="dashboard-card rounded-2xl px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EDFF] text-[#8065E8]">
                <Search size={25} />
              </div>

              <h3 className="dashboard-heading mt-5 text-lg font-bold">
                No matching care plans found
              </h3>

              <p className="dashboard-muted mt-2 text-sm">
                Try another condition, diagnosis, or keyword.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="dashboard-primary-button mt-5 rounded-xl px-5 py-2.5 text-sm font-bold"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  expanded={expandedCategories.includes(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                  onSelectPlan={setActivePlan}
                  savedPlanIds={savedPlanIds}
                  onToggleSave={handleToggleSavePlan}
                />
              ))}
            </div>
          )}
        </section>

        {/* ===================================================
            WRITING GUIDE
        =================================================== */}

        <section
          id="writing-guide"
          className="scroll-mt-8 space-y-6"
        >
          <div>
            <SectionHeading
              eyebrow="Clinical learning"
              title="The ultimate guide to nursing care plans"
              description="A nursing care plan is a structured approach to organizing patient assessment findings, nursing diagnoses, expected outcomes, and interventions. It helps nurses plan, communicate, and evaluate individualized patient care."
            />
          </div>

          {/* Information cards */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <InfoCard title="Types of care plans">
              <div className="space-y-3">
                <p>
                  <strong>Informal care plan:</strong> A plan of action that
                  guides moment-to-moment nursing care.
                </p>

                <p>
                  <strong>Formal care plan:</strong> A written or electronic
                  document that organizes patient care.
                </p>

                <p>
                  <strong>Standardized care plan:</strong> A pre-developed
                  framework for patients with similar care needs.
                </p>

                <p>
                  <strong>Individualized care plan:</strong> A plan adapted
                  to the specific needs, preferences, and goals of one patient.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Why care plans matter">
              <ul className="list-disc space-y-2 pl-5">
                <li>Organize and guide patient-centred nursing care.</li>
                <li>Support continuity of care between shifts.</li>
                <li>Help communicate patient needs across the care team.</li>
                <li>Provide a framework for evaluating patient outcomes.</li>
                <li>Encourage clinical reasoning and prioritization.</li>
              </ul>
            </InfoCard>

            <InfoCard title="Core components">
              <ul className="list-disc space-y-2 pl-5">
                <li>Patient assessment data.</li>
                <li>Nursing diagnoses and supporting evidence.</li>
                <li>Expected outcomes and patient goals.</li>
                <li>Nursing interventions.</li>
                <li>Rationales for interventions.</li>
                <li>Evaluation of patient outcomes.</li>
              </ul>
            </InfoCard>

            <InfoCard title="Common care-plan formats">
              <div className="space-y-3">
                <p>
                  <strong>Three-column plan:</strong> Nursing diagnosis,
                  interventions, and evaluation.
                </p>

                <p>
                  <strong>Four-column plan:</strong> Nursing diagnosis,
                  goals, interventions, and evaluation.
                </p>

                <p>
                  <strong>Expanded student plan:</strong> An educational
                  format that includes rationales for interventions.
                </p>
              </div>
            </InfoCard>
          </div>

          {/* Nine steps */}
          <div>
            <h3 className="dashboard-heading mb-4 text-xl font-extrabold">
              Writing a care plan in 9 steps
            </h3>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {carePlanWritingSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="dashboard-card flex gap-4 rounded-xl p-4 transition hover:border-[#A99AFF]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8DEFF] text-sm font-extrabold text-[#5B3DF5]">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className="dashboard-card-title text-sm font-bold">
                      {step.title}
                    </h4>

                    <p className="dashboard-muted mt-1 text-xs leading-5">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            EDUCATIONAL NOTE
        =================================================== */}

        <div className="dashboard-inner-card flex gap-3 rounded-xl p-4 sm:p-5">
          <ShieldCheck
            className="mt-0.5 shrink-0 text-[#8065E8]"
            size={20}
          />

          <p className="dashboard-muted text-xs leading-6 sm:text-sm">
            <strong className="dashboard-card-title">
              Learning reminder:
            </strong>{" "}
            These examples are for educational practice. Actual nursing
            diagnoses, interventions, and patient goals must be individualized
            using current clinical assessment, professional standards, and
            institutional protocols.
          </p>
        </div>
      </div>

      {/* =====================================================
          CARE PLAN DETAIL MODAL
      ===================================================== */}

      {activePlan && (
        <CarePlanModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
        />
      )}

      {/* =====================================================
          GUIDE MODAL
      ===================================================== */}

      {activeGuide && (
        <GuideModal
          guide={activeGuide}
          onClose={() => setActiveGuide(null)}
        />
      )}
    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  icon: Icon,
  label,
}: {
  icon: ElementType;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-semibold text-white/80 sm:text-xs">
      <Icon size={13} className="text-[#C8BBFF]" />
      {label}
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8065E8]">
        {eyebrow}
      </p>

      <h2 className="dashboard-heading mt-1.5 text-xl font-extrabold sm:text-2xl">
        {title}
      </h2>

      <p className="dashboard-muted mt-2 text-sm leading-6">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   CATEGORY SECTION
========================================================= */

function CategorySection({
  category,
  expanded,
  onToggle,
  onSelectPlan,
  savedPlanIds,
  onToggleSave,
}: {
  category: CarePlanCategory;
  expanded: boolean;
  onToggle: () => void;
  onSelectPlan: (plan: CarePlan) => void;
  savedPlanIds: string[];
  onToggleSave: (plan: CarePlan) => void;
}) {
  const Icon = categoryIcons[category.icon] ?? HeartPulse;

  return (
    <section className="dashboard-card overflow-hidden rounded-xl">
      {/* Category header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-[var(--dash-surface-soft)] sm:p-5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="dashboard-soft-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Icon size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="dashboard-card-title text-sm font-extrabold sm:text-base">
              {category.title}
            </h3>

            <p className="dashboard-muted mt-1 line-clamp-2 text-xs leading-5">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden rounded-full bg-[var(--dash-surface-soft)] px-3 py-1.5 text-[10px] font-semibold text-[var(--dash-muted)] sm:inline-flex">
            {category.count} entries
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-surface-soft)]">
            <ChevronDown
              size={17}
              className={`dashboard-muted transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </button>

      {/* Category plans */}
      {expanded && (
        <div className="grid grid-cols-1 gap-3 border-t border-[var(--dash-border)] bg-[var(--dash-surface-soft)]/40 p-3 sm:grid-cols-2 sm:p-4">
          {category.plans.map((plan) => {
            const isSaved = savedPlanIds.includes(String(plan.id));

            return (
              <div
                key={plan.id}
                className="group flex min-w-0 items-start gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[#9B88F5] hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#8065E8]" />

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold leading-5 text-[var(--dash-text)] transition-colors group-hover:text-[#8065E8] sm:text-sm">
                      {plan.title}
                    </span>

                    <span className="mt-1 block text-[11px] leading-5 text-[var(--dash-muted)]">
                      {plan.description}
                    </span>
                  </span>

                  <ChevronRight
                    size={16}
                    className="mt-1 shrink-0 text-[var(--dash-muted)] transition group-hover:translate-x-1 group-hover:text-[#8065E8]"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSave(plan)}
                  aria-label={
                    isSaved
                      ? `Remove ${plan.title} from My Library`
                      : `Save ${plan.title} to My Library`
                  }
                  title={
                    isSaved
                      ? "Remove from My Library"
                      : "Save to My Library"
                  }
                  className={`shrink-0 rounded-lg p-2 transition ${
                    isSaved
                      ? "bg-[#E8DEFF] text-[#5B3DF5]"
                      : "text-[var(--dash-muted)] hover:bg-[#F4F0FF] hover:text-[#5B3DF5]"
                  }`}
                >
                  <Bookmark
                    size={17}
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   INFORMATION CARD
========================================================= */

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="dashboard-card rounded-xl p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="dashboard-soft-icon flex h-8 w-8 items-center justify-center rounded-lg">
          <BookOpen size={16} />
        </div>

        <h3 className="dashboard-card-title text-sm font-extrabold">
          {title}
        </h3>
      </div>

      <div className="dashboard-muted text-xs leading-6 sm:text-sm">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   CARE PLAN DETAIL MODAL
========================================================= */

function CarePlanModal({
  plan,
  onClose,
}: {
  plan: CarePlan;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#100D20]/65 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="care-plan-title"
        className="dashboard-theme dashboard-card max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl sm:rounded-[24px]"
      >
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--dash-border)] p-4 sm:p-6">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8065E8]">
              <HeartPulse size={14} />
              Nursing care plan
            </div>

            <h2
              id="care-plan-title"
              className="dashboard-heading text-lg font-extrabold sm:text-2xl"
            >
              {plan.title}
            </h2>

            <p className="dashboard-muted mt-2 text-xs leading-5 sm:text-sm">
              {plan.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close care plan"
            className="dashboard-muted shrink-0 rounded-xl p-2 transition hover:bg-[var(--dash-surface-soft)]"
          >
            <X size={21} />
          </button>
        </div>

        {/* Modal content */}
        <div className="max-h-[calc(92vh-100px)] space-y-6 overflow-y-auto p-4 sm:p-6">
          <DetailSection title="Assessment cues" number="01">
            <ul className="space-y-2">
              {plan.assessment.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    size={16}
                    className="mt-1 shrink-0 text-[#8065E8]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Nursing diagnosis" number="02">
            <div className="rounded-xl border border-[#DCD3FA] bg-[#F4F0FF] p-4 text-xs leading-6 text-[#44367C] sm:text-sm">
              {plan.diagnosis}
            </div>
          </DetailSection>

          <DetailSection title="Expected outcomes and goals" number="03">
            <ul className="space-y-2">
              {plan.goals.map((goal) => (
                <li key={goal} className="flex gap-2">
                  <CheckCircle2
                    size={16}
                    className="mt-1 shrink-0 text-[#8065E8]"
                  />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection
            title="Nursing interventions and rationales"
            number="04"
          >
            <div className="space-y-3">
              {plan.interventions.map((intervention, index) => (
                <div
                  key={intervention.action}
                  className="dashboard-inner-card rounded-xl p-4"
                >
                  <p className="dashboard-card-title text-xs font-bold sm:text-sm">
                    {index + 1}. {intervention.action}
                  </p>

                  <p className="dashboard-muted mt-2 text-xs leading-6 sm:text-sm">
                    <strong className="dashboard-card-title">
                      Rationale:
                    </strong>{" "}
                    {intervention.rationale}
                  </p>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Evaluation" number="05">
            <p>{plan.evaluation}</p>
          </DetailSection>

          <div className="dashboard-inner-card rounded-xl p-4 text-xs leading-6">
            Educational example only. Always validate nursing diagnoses and
            interventions against the patient&apos;s current assessment and
            applicable clinical guidelines.
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8DEFF] text-[10px] font-extrabold text-[#5B3DF5]">
          {number}
        </span>

        <h3 className="dashboard-heading text-sm font-extrabold sm:text-base">
          {title}
        </h3>
      </div>

      <div className="dashboard-muted pl-0 text-xs leading-6 sm:pl-11 sm:text-sm sm:leading-7">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   GUIDE MODAL
========================================================= */

function GuideModal({
  guide,
  onClose,
}: {
  guide: (typeof carePlanGuides)[number];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#100D20]/65 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="dashboard-theme dashboard-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-5 shadow-2xl sm:rounded-[24px] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="dashboard-soft-icon mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
              <BookOpen size={21} />
            </div>

            <h2
              id="guide-title"
              className="dashboard-heading text-lg font-extrabold sm:text-xl"
            >
              {guide.title}
            </h2>

            <p className="dashboard-muted mt-2 text-xs leading-6 sm:text-sm">
              {guide.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="dashboard-muted shrink-0 rounded-xl p-2 transition hover:bg-[var(--dash-surface-soft)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="my-5 h-px bg-[var(--dash-border)]" />

        <ol className="space-y-4">
          {guide.content.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8DEFF] text-[10px] font-extrabold text-[#5B3DF5]">
                {index + 1}
              </span>

              <p className="dashboard-muted pt-1 text-xs leading-6 sm:text-sm">
                {item}
              </p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="dashboard-primary-button mt-7 w-full rounded-xl px-5 py-3 text-sm font-bold"
        >
          Got it
        </button>
      </div>
    </div>
  );
}