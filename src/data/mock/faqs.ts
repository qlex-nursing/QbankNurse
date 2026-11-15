export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "ati-exams",
    question: "What ATI exams do nursing students take?",
    answer:
      "ATI offers assessments across several nursing subjects, including Fundamentals, Medical-Surgical Nursing, Pharmacology, Maternal Newborn, Pediatrics, Mental Health, and more. The assessments required depend on your nursing programme.",
  },
  {
    id: "passing-score",
    question: "What's a passing score on an ATI proctored exam?",
    answer:
      "There isn't one universal passing score for every ATI proctored assessment. Performance expectations and required proficiency levels can vary by assessment and nursing programme. Check your school's guidelines for the requirements that apply to you.",
  },
  {
    id: "predictor",
    question:
      "What's the difference between ATI proctored exams and the Comprehensive Predictor?",
    answer:
      "ATI proctored assessments generally focus on particular nursing subjects or courses. The Comprehensive Predictor is designed to assess readiness across a broader range of nursing content. Your programme determines when and how these assessments are used.",
  },
  {
    id: "real-exam",
    question: "Are these questions the same as the real ATI exam?",
    answer:
      "No. QbankNurse practice questions are intended for learning and preparation. They should not be represented as actual ATI exam questions or as questions obtained from confidential exam materials.",
  },
  {
    id: "pricing",
    question: "Is QbankNurse free?",
    answer:
      "QbankNurse's access options and pricing will be published once the platform's plans are finalised. We'll make it clear which study resources are available for free and which require a subscription.",
  },
];