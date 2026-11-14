export interface RecentExam {
  id: number;
  title: string;
  questions: number;
  answered: number;
  updatedAt: string;
}

export interface StudyCategory {
  id: number;
  title: string;
  program: string;
  questions: number;
  rating: number;
  reviews: number;
  description: string;
  accent: "red" | "indigo" | "apricot" | "green";
}

export const dashboardStats = {
  questionsPractised: 0,
  completedExams: 0,
  studyStreak: 0,
};

export const recentExams: RecentExam[] = [
  {
    id: 1,
    title: "ATI Medical-Surgical Practice",
    questions: 51,
    answered: 0,
    updatedAt: "Not started",
  },
  {
    id: 2,
    title: "ATI Maternal-Newborn Practice",
    questions: 58,
    answered: 0,
    updatedAt: "Not started",
  },
  {
    id: 3,
    title: "NCLEX-RN Readiness Test",
    questions: 150,
    answered: 0,
    updatedAt: "Not started",
  },
];

export const studyCategories: StudyCategory[] = [
  {
    id: 1,
    title: "Medical-Surgical",
    program: "RN ATI",
    questions: 4411,
    rating: 4.8,
    reviews: 1808,
    description:
      "Comprehensive medical-surgical nursing across major body systems and clinical conditions.",
    accent: "red",
  },
  {
    id: 2,
    title: "Maternal-Newborn",
    program: "RN ATI",
    questions: 2200,
    rating: 4.7,
    reviews: 164,
    description:
      "Maternal care, pregnancy, childbirth, postpartum and newborn nursing.",
    accent: "green",
  },
  {
    id: 3,
    title: "Fundamentals",
    program: "RN ATI",
    questions: 3079,
    rating: 4.8,
    reviews: 1130,
    description:
      "Core nursing fundamentals, patient safety, assessment and infection control.",
    accent: "apricot",
  },
  {
    id: 4,
    title: "Pharmacology",
    program: "RN ATI",
    questions: 2555,
    rating: 4.6,
    reviews: 2362,
    description:
      "Drug classifications, medication mechanisms, side effects and nursing implications.",
    accent: "indigo",
  },
  {
    id: 5,
    title: "Obstetrics and Pediatrics",
    program: "RN ATI",
    questions: 2801,
    rating: 4.7,
    reviews: 969,
    description:
      "Pregnancy, childbirth, pediatric growth and family-centred nursing care.",
    accent: "red",
  },
  {
    id: 6,
    title: "Mental Health",
    program: "RN ATI",
    questions: 3495,
    rating: 4.7,
    reviews: 121,
    description:
      "Psychiatric nursing, therapeutic communication and mental health conditions.",
    accent: "green",
  },
  {
    id: 7,
    title: "Dosage Calculations",
    program: "RN ATI",
    questions: 1350,
    rating: 4.8,
    reviews: 2779,
    description:
      "Medication dosage calculations, IV drip rates and safe administration.",
    accent: "apricot",
  },
  {
    id: 8,
    title: "Leadership",
    program: "RN ATI",
    questions: 2131,
    rating: 4.7,
    reviews: 1569,
    description:
      "Nursing leadership, management, delegation and professional practice.",
    accent: "indigo",
  },
  {
    id: 9,
    title: "Capstone",
    program: "RN ATI",
    questions: 1393,
    rating: 4.6,
    reviews: 1807,
    description:
      "Integrated nursing review to strengthen clinical knowledge and readiness.",
    accent: "red",
  },
  {
    id: 10,
    title: "Community Health",
    program: "RN ATI",
    questions: 981,
    rating: 5.0,
    reviews: 2847,
    description:
      "Population health, epidemiology and community-based nursing practice.",
    accent: "green",
  },
  {
    id: 11,
    title: "Adult Health",
    program: "RN ATI",
    questions: 566,
    rating: 4.5,
    reviews: 1054,
    description:
      "Adult health nursing across the lifespan and health-illness continuum.",
    accent: "apricot",
  },
  {
    id: 12,
    title: "Nutrition",
    program: "RN ATI",
    questions: 358,
    rating: 4.5,
    reviews: 1152,
    description:
      "Nutrition principles, therapeutic diets and patient education.",
    accent: "indigo",
  },
];