import {
  Target,
  Layers,
  BookOpen,
  Calculator,
  Brain,
  CalendarDays,
  HeartPulse,
  NotebookPen,
  MessageCircle,
} from "lucide-react";

export const examPreparationOptions = [
  {
    title: "NCLEX preparation",
    description: "Practice exams and rationales",
    href: "/dashboard/nclex/practice",
    available: false,
  },
  {
    title: "ATI preparation",
    description: "Practice exams and rationales",
    href: "/dashboard/study-library",
    available: true,
  },
  // {
  //   title: "HESI preparation",
  //   description: "Practice exams and rationales",
  //   href: "/dashboard/exams/hesi/a2",
  //   available: false,
  // },
  // {
  //   title: "TEAS preparation",
  //   description: "TEAS practice and preparation",
  //   href: "/dashboard/teas",
  //   available: false,
  // },
];

export const studyTools = [
  {
    title: "Custom Practice",
    description: "Pick a subject, number of questions and mode.",
    href: "/dashboard/custom-practice",
    icon: Target,
    available: false,
  },
  {
    title: "Study Cards",
    description: "Review nursing concepts with interactive cards.",
    href: "/dashboard/study-cards",
    icon: Layers,
    available: true,
  },
  {
    title: "Exam Flashcards",
    description: "Flip cards to reinforce important exam concepts.",
    href: "/dashboard/flashcards",
    icon: BookOpen,
    available: false,
  },
  {
    title: "Nursing Tools",
    description: "Dosage, IV drip rates, conversions and BMI.",
    href: "/dashboard/calculators",
    icon: Calculator,
    available: false,
  },
  {
    title: "AI Nursing Tutor",
    description: "Understand nursing concepts in plain language.",
    href: "/dashboard/ai-tutor",
    icon: Brain,
    available: false,
  },
  {
    title: "Study Planner",
    description: "Organize your learning and daily study targets.",
    href: "/dashboard/study-planner",
    icon: CalendarDays,
    available: false,
  },
  {
    title: "Care Plans",
    description: "Explore nursing diagnoses, goals and interventions.",
    href: "/dashboard/care-plans",
    icon: HeartPulse,
    available: false,
  },
  {
    title: "Study Guides",
    description: "Explore structured nursing notes and summaries.",
    href: "/dashboard/study-guides",
    icon: NotebookPen,
    available: true,
  },
  {
    title: "Community",
    description: "Connect and learn with other nursing students.",
    href: "/dashboard/community",
    icon: MessageCircle,
    available: false,
  },
];