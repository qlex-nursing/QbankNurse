"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  Baby,
  Bone,
  BookOpen,
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
  Heart,
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

const categoryIcons: Record<string, React.ElementType> = {
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

export default function CarePlansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("category");
  const [activePlan, setActivePlan] = useState<CarePlan | null>(null);
  const [activeGuide, setActiveGuide] = useState<
    (typeof carePlanGuides)[number] | null
  >(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    carePlanCategories.map((category) => category.id),
  );

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
          [
            plan.title,
            plan.description,
            plan.diagnosis,
          ]
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

  const scrollToLibrary = () => {
    document.getElementById("care-plan-library")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1500px] space-y-10">
       {/* HERO */}
<section className="relative isolate overflow-hidden rounded-[24px] border border-[#DCD3FA] bg-gradient-to-br from-[#30256F] via-[#5141A5] to-[#8274CB] px-5 py-6 text-white shadow-[0_12px_30px_rgba(64,49,130,0.12)] sm:px-8 sm:py-8 lg:px-10">
  <div className="pointer-events-none absolute -right-20 -top-32 -z-10 h-72 w-72 rounded-full bg-[#C9BFFF]/20 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-[#A89BFF]/20 blur-3xl" />

  <div className="relative max-w-3xl">
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#F0EBFF]">
      <Sparkles size={13} />
      QbankNurse Learning Resources
    </div>

    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
        <HeartPulse size={24} strokeWidth={1.8} />
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        Nursing Care Plans
      </h1>
    </div>

    <p className="max-w-2xl text-sm leading-6 text-[#EAE5FF] sm:text-base">
      Explore structured nursing care plans, understand clinical diagnoses
      and strengthen your clinical reasoning — one patient problem at a time.
    </p>

    {/* Search */}
    <div className="mt-5 flex max-w-2xl items-center gap-3 rounded-xl border border-white/70 bg-white px-4 py-3 shadow-lg">
      <Search className="shrink-0 text-[#726B88]" size={19} />

      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search a condition or nursing diagnosis..."
        className="w-full bg-transparent text-sm text-[#211B3B] outline-none placeholder:text-[#898398]"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          aria-label="Clear search"
          className="rounded-lg p-1 text-[#746C8C] hover:bg-[#F0EDFA]"
        >
          <X size={17} />
        </button>
      )}
    </div>

    {/* Stats */}
    <div className="mt-4 flex flex-wrap gap-2">
      {[
        { icon: HeartPulse, label: "17 body systems" },
        { icon: ClipboardList, label: `${totalCarePlanCount} care plan entries` },
        { icon: BookOpen, label: `${carePlanGuides.length} learning guides` },
      ].map((stat) => (
        <div
          key={stat.label}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white sm:text-xs"
        >
          <stat.icon size={14} />
          {stat.label}
        </div>
      ))}
    </div>
  </div>

  <div className="pointer-events-none absolute bottom-5 right-8 hidden opacity-[0.07] lg:block">
    <HeartPulse size={145} strokeWidth={0.8} />
  </div>
</section>
        {/* FEATURED RESOURCE */}
        <section className="dashboard-card flex flex-col gap-6 rounded-[24px] border border-[#E4DCF9] bg-[#F8F6FF] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#6245D8]">
              <ShieldCheck size={17} />
              BUILD STRONGER CLINICAL REASONING
            </div>

            <h2 className="dashboard-heading text-xl font-extrabold sm:text-2xl">
              Make better care plans
            </h2>

            <p className="dashboard-muted mt-2 text-sm leading-6">
              Learn how to connect assessment findings, nursing diagnoses,
              patient goals and evidence-informed interventions into a
              structured care plan.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              document.getElementById("writing-guide")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="dashboard-primary-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-sm hover:-translate-y-0.5"
          >
            Explore the guide
            <ChevronRight size={17} />
          </button>
        </section>

        {/* QUICK GUIDES */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8065E8]">
              Start learning
            </p>

            <h2 className="dashboard-heading mt-2 text-2xl font-extrabold">
              Start with the guides
            </h2>

            <p className="dashboard-muted mt-2 text-sm">
              Build a strong foundation before exploring individual care plans.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {carePlanGuides.map((guide, index) => (
              <button
                key={guide.id}
                type="button"
                onClick={() => setActiveGuide(guide)}
                className="dashboard-card group overflow-hidden rounded-[20px] text-left"
              >
                <div
                  className={`h-1.5 ${
                    index === 0
                      ? "bg-gradient-to-r from-[#5B3DF5] to-[#A99AFF]"
                      : index === 1
                        ? "bg-gradient-to-r from-[#8066E9] to-[#C4B8FF]"
                        : "bg-gradient-to-r from-[#4F46A5] to-[#A99AFF]"
                  }`}
                />

                <div className="p-6">
                  <div className="dashboard-soft-icon mb-5 flex h-11 w-11 items-center justify-center rounded-xl">
                    <BookOpen size={20} />
                  </div>

                  <h3 className="dashboard-card-title text-base font-bold">
                    {guide.title}
                  </h3>

                  <p className="dashboard-muted mt-2 text-sm leading-6">
                    {guide.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8065E8] transition group-hover:gap-3">
                    Read guide
                    <ChevronRight size={17} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* LIBRARY */}
        <section id="care-plan-library" className="scroll-mt-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8065E8]">
                Explore conditions
              </p>

              <h2 className="dashboard-heading mt-2 text-2xl font-extrabold">
                Browse the library
              </h2>

              <p className="dashboard-muted mt-2 text-sm">
                Explore nursing care plans organized by body system.
              </p>
            </div>

            <div className="flex items-center gap-1 self-start rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-1 sm:self-auto">
              <button
                type="button"
                onClick={() => setSortMode("category")}
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

          {searchQuery && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-[#DCD3FA] bg-[#F4F0FF] px-4 py-3 text-sm text-[#5141A5]">
              <span>
                Showing {matchingPlanCount} matching sample care plans
              </span>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="font-bold underline underline-offset-4"
              >
                Clear
              </button>
            </div>
          )}

          {filteredCategories.length === 0 ? (
            <div className="dashboard-card rounded-2xl px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EDFF] text-[#8065E8]">
                <Search size={25} />
              </div>

              <h3 className="dashboard-heading mt-5 text-lg font-bold">
                No matching care plans found
              </h3>

              <p className="dashboard-muted mt-2 text-sm">
                Try another condition, diagnosis or keyword.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-5 rounded-xl bg-[#5B3DF5] px-5 py-2.5 text-sm font-bold text-white"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  expanded={expandedCategories.includes(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                  onSelectPlan={setActivePlan}
                />
              ))}
            </div>
          )}
        </section>

        {/* WRITING GUIDE */}
        <section id="writing-guide" className="scroll-mt-8 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8065E8]">
              Clinical learning
            </p>

            <h2 className="dashboard-heading mt-2 text-2xl font-extrabold">
              The ultimate guide to nursing care plans
            </h2>

            <p className="dashboard-muted mt-3 max-w-5xl text-sm leading-7">
              A nursing care plan is a structured approach to organizing
              patient assessment findings, nursing diagnoses, expected
              outcomes and interventions. It helps nurses plan, communicate
              and evaluate individualized patient care.
            </p>
          </div>

          {/* Information cards */}
          <div className="grid gap-5 lg:grid-cols-2">
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
                  to the specific needs, preferences and goals of one patient.
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
                  interventions and evaluation.
                </p>

                <p>
                  <strong>Four-column plan:</strong> Nursing diagnosis,
                  goals, interventions and evaluation.
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
            <h3 className="dashboard-heading mb-5 text-xl font-extrabold">
              Writing a care plan in 9 steps
            </h3>

            <div className="space-y-3">
              {carePlanWritingSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="dashboard-card flex gap-4 rounded-2xl p-5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8DEFF] text-sm font-extrabold text-[#5B3DF5]">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="dashboard-card-title font-bold">
                      {step.title}
                    </h4>

                    <p className="dashboard-muted mt-1 text-sm leading-6">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATIONAL NOTE */}
        <div className="flex gap-3 rounded-2xl border border-[#DCD3FA] bg-[#F4F0FF] p-5 text-sm text-[#5141A5]">
          <ShieldCheck className="mt-0.5 shrink-0" size={20} />

          <p className="leading-6">
            <strong>Learning reminder:</strong> These examples are for
            educational practice. Actual nursing diagnoses, interventions
            and patient goals must be individualized using current clinical
            assessment, professional standards and institutional protocols.
          </p>
        </div>
      </div>

      {/* CARE PLAN DETAIL MODAL */}
      {activePlan && (
        <CarePlanModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
        />
      )}

      {/* GUIDE MODAL */}
      {activeGuide && (
        <GuideModal
          guide={activeGuide}
          onClose={() => setActiveGuide(null)}
        />
      )}
    </div>
  );
}

/* =========================================
   CATEGORY SECTION
========================================= */

function CategorySection({
  category,
  expanded,
  onToggle,
  onSelectPlan,
}: {
  category: CarePlanCategory;
  expanded: boolean;
  onToggle: () => void;
  onSelectPlan: (plan: CarePlan) => void;
}) {
  const Icon = categoryIcons[category.icon] ?? HeartPulse;

  return (
    <section className="dashboard-card overflow-hidden rounded-[22px]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="dashboard-soft-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <Icon size={21} />
          </div>

          <div className="min-w-0">
            <h3 className="dashboard-card-title text-base font-extrabold sm:text-lg">
              {category.title}
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-[var(--dash-surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--dash-muted)] sm:inline-flex">
            {category.count} entries
          </span>

          <ChevronDown
            size={20}
            className={`dashboard-muted transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="grid gap-3 px-4 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6">
          {category.plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan)}
              className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#9B88F5] hover:shadow-md"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8065E8]" />

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[var(--dash-text)] transition-colors group-hover:text-[#8065E8]">
                  {plan.title}
                </span>

                <span className="mt-1 block text-xs leading-5 text-[var(--dash-muted)]">
                  {plan.description}
                </span>
              </span>

              <ChevronRight
                size={17}
                className="mt-1 shrink-0 text-[var(--dash-muted)] transition group-hover:translate-x-1 group-hover:text-[#8065E8]"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================
   INFORMATION CARD
========================================= */

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-card rounded-2xl p-6">
      <h3 className="dashboard-card-title mb-4 text-base font-extrabold">
        {title}
      </h3>

      <div className="dashboard-muted text-sm leading-6">
        {children}
      </div>
    </div>
  );
}

/* =========================================
   CARE PLAN DETAIL MODAL
========================================= */

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
        className="dashboard-theme dashboard-card max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[24px] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--dash-border)] p-5 sm:p-7">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8065E8]">
              <HeartPulse size={15} />
              Nursing care plan
            </div>

            <h2
              id="care-plan-title"
              className="dashboard-heading text-xl font-extrabold sm:text-2xl"
            >
              {plan.title}
            </h2>

            <p className="dashboard-muted mt-2 text-sm">
              {plan.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close care plan"
            className="dashboard-muted rounded-xl p-2 transition hover:bg-[var(--dash-surface-soft)]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-110px)] space-y-6 overflow-y-auto p-5 sm:p-7">
          <DetailSection title="Assessment cues" number="01">
            <ul className="space-y-2">
              {plan.assessment.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#8065E8]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Nursing diagnosis" number="02">
            <div className="rounded-xl border border-[#DCD3FA] bg-[#F4F0FF] p-4 text-sm leading-7 text-[#44367C]">
              {plan.diagnosis}
            </div>
          </DetailSection>

          <DetailSection title="Expected outcomes and goals" number="03">
            <ul className="space-y-2">
              {plan.goals.map((goal) => (
                <li key={goal} className="flex gap-2">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#8065E8]"
                  />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Nursing interventions and rationales" number="04">
            <div className="space-y-3">
              {plan.interventions.map((intervention, index) => (
                <div
                  key={intervention.action}
                  className="dashboard-inner-card rounded-xl p-4"
                >
                  <p className="dashboard-card-title text-sm font-bold">
                    {index + 1}. {intervention.action}
                  </p>

                  <p className="dashboard-muted mt-2 text-sm leading-6">
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

          <div className="rounded-xl border border-[#DCD3FA] bg-[#F4F0FF] p-4 text-xs leading-6 text-[#5141A5]">
            Educational example only. Always validate nursing diagnoses and
            interventions against the patient's current assessment and
            applicable clinical guidelines.
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8DEFF] text-xs font-extrabold text-[#5B3DF5]">
          {number}
        </span>

        <h3 className="dashboard-heading text-base font-extrabold">
          {title}
        </h3>
      </div>

      <div className="dashboard-muted pl-0 text-sm leading-7 sm:pl-11">
        {children}
      </div>
    </section>
  );
}

/* =========================================
   GUIDE MODAL
========================================= */

function GuideModal({
  guide,
  onClose,
}: {
  guide: (typeof carePlanGuides)[number];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#100D20]/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="dashboard-card w-full max-w-2xl rounded-[24px] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="dashboard-soft-icon mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <BookOpen size={22} />
            </div>

            <h2
              id="guide-title"
              className="dashboard-heading text-xl font-extrabold"
            >
              {guide.title}
            </h2>

            <p className="dashboard-muted mt-2 text-sm leading-6">
              {guide.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="dashboard-muted rounded-xl p-2 hover:bg-[var(--dash-surface-soft)]"
          >
            <X size={21} />
          </button>
        </div>

        <div className="my-6 h-px bg-[var(--dash-border)]" />

        <ol className="space-y-4">
          {guide.content.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8DEFF] text-xs font-extrabold text-[#5B3DF5]">
                {index + 1}
              </span>

              <p className="dashboard-muted pt-1 text-sm leading-6">
                {item}
              </p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="dashboard-primary-button mt-8 w-full rounded-xl px-5 py-3 text-sm font-bold"
        >
          Got it
        </button>
      </div>
    </div>
  );
}