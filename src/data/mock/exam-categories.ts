export interface ExamCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: "stethoscope" | "heart";
  accent: "indigo" | "red";
  features: string[];
  buttonLabel: string;
  href: string;
  tag: string;
}

export const examCategories: ExamCategory[] = [
  {
    id: "ati",
    title: "ATI Exams",
    subtitle: "From Fundamentals to Predictor",
    description:
      "Follow your ATI course sequence, strengthen clinical judgment, and use answer rationales to understand the decisions behind each answer.",
    icon: "stethoscope",
    accent: "indigo",
    features: [
      "ATI-style practice",
      "NGN question formats",
      "Detailed rationales",
    ],
    buttonLabel: "Open ATI Practice",
    href: "/dashboard/exams/rn/ati",
    tag: "ATI PREPARATION",
  },
  {
    id: "hesi",
    title: "HESI & Exit Exams",
    subtitle: "Specialty and exit-exam practice",
    description:
      "Prepare by specialty or practise for your exit examination, then review the reasoning behind every answer you submit.",
    icon: "heart",
    accent: "red",
    features: [
      "Specialty practice",
      "Exit exam preparation",
      "Review and rationales",
    ],
    buttonLabel: "Open HESI Practice",
    href: "/dashboard/study-library",
    tag: "HESI PREPARATION",
  },
];