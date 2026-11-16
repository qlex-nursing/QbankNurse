import { practiceQuestions } from "@/data/mock/dashboard/practice-questions";

export type StudyTrack = "RN" | "LPN" | "NCLEX";

export type StudySetStatus = "available" | "coming-soon";

export interface StudySet {
  id: string;
  title: string;
  programme: string;
  track: StudyTrack;
  description: string;
  questionCount: number;
  rating: number;
  reviews: number;
  status: StudySetStatus;
  subjectSlug?: string;
  tags: string[];
}

const pharmacologyQuestionCount =
  practiceQuestions.pharmacology?.length ?? 0;

export const studySets: StudySet[] = [
  {
    id: "rn-ati-pharmacology",
    title: "ATI RN Pharmacology Practice",
    programme: "RN ATI",
    track: "RN",
    description:
      "Practise medication administration, drug classifications, pharmacological principles and safe nursing interventions.",
    questionCount: pharmacologyQuestionCount,
    rating: 4.8,
    reviews: 1857,
    status: "available",
    subjectSlug: "pharmacology",
    tags: ["ATI", "RN", "Pharmacology"],
  },
  {
    id: "rn-ati-comprehensive-predictor",
    title: "RN Comprehensive Predictor 2026 Proctored Exam",
    programme: "RN Exit ATI",
    track: "RN",
    description:
      "Comprehensive nursing assessment covering essential RN examination content.",
    questionCount: 0,
    rating: 4.8,
    reviews: 1932,
    status: "coming-soon",
    tags: ["ATI", "RN", "Exit"],
  },
  {
    id: "rn-ati-vati-predictor",
    title: "ATI RN Vati Comprehensive Predictor",
    programme: "RN Exit ATI",
    track: "RN",
    description:
      "Prepare for the RN comprehensive predictor with a structured examination experience.",
    questionCount: 0,
    rating: 4.9,
    reviews: 1298,
    status: "coming-soon",
    tags: ["ATI", "RN", "VATI"],
  },
  {
    id: "rn-hesi-exit",
    title: "HESI RN Exit Examination",
    programme: "RN Exit HESI",
    track: "RN",
    description:
      "Prepare for the HESI RN exit examination and strengthen clinical judgment.",
    questionCount: 0,
    rating: 4.8,
    reviews: 1200,
    status: "coming-soon",
    tags: ["HESI", "RN", "Exit"],
  },
  {
    id: "lpn-ati-predictor",
    title: "ATI PN Comprehensive Predictor 2026",
    programme: "LPN Exit ATI",
    track: "LPN",
    description:
      "Prepare for the practical nursing comprehensive predictor examination.",
    questionCount: 0,
    rating: 4.8,
    reviews: 2156,
    status: "coming-soon",
    tags: ["ATI", "LPN", "PN"],
  },
  {
    id: "lpn-hesi-exit",
    title: "HESI PN Exit Examination",
    programme: "LPN Exit HESI",
    track: "LPN",
    description:
      "Review practical nursing concepts and prepare for the HESI PN exit examination.",
    questionCount: 0,
    rating: 4.7,
    reviews: 1847,
    status: "coming-soon",
    tags: ["HESI", "LPN", "PN"],
  },
  {
    id: "nclex-rn-readiness",
    title: "NCLEX-RN Readiness Test",
    programme: "NCLEX RN",
    track: "NCLEX",
    description:
      "Prepare for the NCLEX-RN examination with nursing knowledge and clinical judgment practice.",
    questionCount: 0,
    rating: 4.9,
    reviews: 1298,
    status: "coming-soon",
    tags: ["NCLEX", "RN"],
  },
  {
    id: "nclex-pn-readiness",
    title: "NCLEX-PN Readiness Test",
    programme: "NCLEX PN",
    track: "NCLEX",
    description:
      "Strengthen practical nursing knowledge and prepare for the NCLEX-PN examination.",
    questionCount: 0,
    rating: 4.8,
    reviews: 1523,
    status: "coming-soon",
    tags: ["NCLEX", "PN", "LPN"],
  },
];

export const studyLibraryFilters = [
  "All",
  "RN Exams",
  "LPN Exams",
  "NCLEX",
  "Dosage Calculations",
] as const;