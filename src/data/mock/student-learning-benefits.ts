export interface StudentLearningBenefit {
  id: string;
  title: string;
  description: string;
  icon: "target" | "book" | "chart" | "mobile" | "help";
  accent: "red" | "teal" | "blue" | "green" | "purple";
}

export const studentLearningBenefits: StudentLearningBenefit[] = [
  {
    id: "readiness",
    title: "See Your Readiness Grow",
    description:
      "Compare recent scores and identify the exam topics that deserve another round of practice.",
    icon: "target",
    accent: "red",
  },
  {
    id: "clinical-reasoning",
    title: "Learn the Clinical Why",
    description:
      "Use detailed rationales and clinical takeaways to understand the reasoning behind each answer.",
    icon: "book",
    accent: "teal",
  },
  {
    id: "weak-spots",
    title: "Find Your Weak Spots",
    description:
      "Topic-level feedback helps identify areas where focused review can make a difference.",
    icon: "chart",
    accent: "blue",
  },
  {
    id: "flexible-study",
    title: "Keep Studying Wherever You Are",
    description:
      "Move between your phone, tablet, and computer with a consistent study experience.",
    icon: "mobile",
    accent: "green",
  },
  {
    id: "support",
    title: "Help When You Need It",
    description:
      "Find guidance and support when something interrupts your learning experience.",
    icon: "help",
    accent: "purple",
  },
];