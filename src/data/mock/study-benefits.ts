export interface StudyBenefit {
  id: string;
  title: string;
  icon: "clipboard" | "brain" | "target" | "message" | "credit-card";
  accent: "red" | "indigo" | "apricot";
}

export const studyBenefits: StudyBenefit[] = [
  {
    id: "question-practice",
    title: "A focused question bank for nursing practice",
    icon: "clipboard",
    accent: "red",
  },
  {
    id: "study-modes",
    title: "Different ways to approach your study sessions",
    icon: "brain",
    accent: "indigo",
  },
  {
    id: "ngn-formats",
    title: "Practice with Next Generation NCLEX formats",
    icon: "target",
    accent: "apricot",
  },
  {
    id: "answer-rationales",
    title: "Understand the reasoning behind each answer",
    icon: "message",
    accent: "red",
  },
  {
    id: "getting-started",
    title: "Explore your preparation options with ease",
    icon: "credit-card",
    accent: "indigo",
  },
];