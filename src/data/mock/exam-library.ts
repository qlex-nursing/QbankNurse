export interface ExamSet {
  id: string;
  title: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  views: number;
  isFree: boolean;
  hasRationales: boolean;
  hasNgn: boolean;
  href: string;
}

export const examLibrary: ExamSet[] = [
  {
    id: "ati-fundamentals",
    title: "ATI Fundamentals",
    category: "Fundamentals",
    description:
      "Foundational nursing concepts covering patient safety, infection control, vital signs, and the nursing process.",
    rating: 4.8,
    reviews: 3783,
    views: 31000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/fundamentals",
  },
  {
    id: "ati-medical-surgical",
    title: "ATI Adult Medical-Surgical",
    category: "Core Series",
    description:
      "Care of adult patients across major body systems, including cardiovascular, respiratory, renal, endocrine, and GI conditions.",
    rating: 4.7,
    reviews: 2290,
    views: 54000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/medical-surgical",
  },
  {
    id: "ati-pharmacology",
    title: "ATI Pharmacology",
    category: "Core Series",
    description:
      "Drug classifications, mechanisms of action, side effects, and nursing implications for safe medication administration.",
    rating: 4.8,
    reviews: 1857,
    views: 51000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/pharmacology",
  },
  {
    id: "ati-dosage-calculations",
    title: "ATI Dosage Calculations",
    category: "Nursing Math",
    description:
      "Medication math covering oral and IV dosages, drip rates, unit conversions, and weight-based dosing.",
    rating: 4.8,
    reviews: 261,
    views: 51000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/dosage-calculations",
  },
  {
    id: "ati-maternal-newborn",
    title: "ATI Maternal Newborn",
    category: "Specialties",
    description:
      "Antepartum, intrapartum, postpartum, and newborn care, including pregnancy and labor complications.",
    rating: 4.6,
    reviews: 1123,
    views: 37000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/maternal-newborn",
  },
  {
    id: "ati-pediatrics",
    title: "ATI Pediatrics",
    category: "Specialties",
    description:
      "Nursing care of children, growth and development milestones, pediatric illness, and family-centered care.",
    rating: 4.7,
    reviews: 1329,
    views: 36000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/pediatrics",
  },
  {
    id: "ati-mental-health",
    title: "ATI Mental Health",
    category: "Specialties",
    description:
      "Psychiatric disorders, therapeutic communication, crisis intervention, and ethical issues in psychiatric care.",
    rating: 4.7,
    reviews: 1933,
    views: 16000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/mental-health",
  },
  {
    id: "ati-community-health",
    title: "ATI Community Health",
    category: "Specialties",
    description:
      "Population health, epidemiology, health promotion, and care of vulnerable populations outside the hospital.",
    rating: 4.9,
    reviews: 2827,
    views: 40000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/community-health",
  },
  {
    id: "ati-leadership",
    title: "ATI Leadership",
    category: "Core Series",
    description:
      "Delegation, prioritization, and management principles nurses apply in clinical settings.",
    rating: 4.8,
    reviews: 3416,
    views: 23000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/leadership",
  },
  {
    id: "ati-nutrition",
    title: "ATI Nutrition",
    category: "Fundamentals",
    description:
      "Therapeutic diets, nutrient deficiencies, enteral and parenteral nutrition, and patient education.",
    rating: 4.9,
    reviews: 235,
    views: 12000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/nutrition",
  },
  {
    id: "ati-comprehensive-predictor",
    title: "ATI Comprehensive Predictor",
    category: "Exit Exam",
    description:
      "A comprehensive nursing assessment covering multiple content areas to help learners evaluate their exam readiness.",
    rating: 4.9,
    reviews: 4192,
    views: 41000,
    isFree: true,
    hasRationales: true,
    hasNgn: true,
    href: "/exams/ati/comprehensive-predictor",
  },
];