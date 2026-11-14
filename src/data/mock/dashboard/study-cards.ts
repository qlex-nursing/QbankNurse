export interface StudyCard {
  id: string;
  subject: string;
  topic: string;
  question: string;
  answer: string;
  explanation: string;
}

export const studyCards: StudyCard[] = [
  {
    id: "card-001",
    subject: "Fundamentals",
    topic: "Patient Safety",
    question: "What is the first action a nurse should take when a patient begins to fall?",
    answer: "Lower the patient to the floor while protecting their head.",
    explanation:
      "Do not attempt to hold the patient upright. Guide them safely to the floor and assess for injury.",
  },
  {
    id: "card-002",
    subject: "Fundamentals",
    topic: "Infection Control",
    question: "What type of precautions are required for a patient with pulmonary tuberculosis?",
    answer: "Airborne precautions.",
    explanation:
      "Use a fit-tested N95 respirator or equivalent, appropriate room ventilation and other facility-required airborne precautions.",
  },
  {
    id: "card-003",
    subject: "Fundamentals",
    topic: "Vital Signs",
    question: "What is the commonly accepted normal resting respiratory rate for a healthy adult?",
    answer: "12–20 breaths per minute.",
    explanation:
      "Respiratory rate should be assessed for rate, rhythm, depth and effort.",
  },
  {
    id: "card-004",
    subject: "Pharmacology",
    topic: "Medication Safety",
    question: "Which laboratory value should be monitored closely when a patient takes warfarin?",
    answer: "International Normalized Ratio (INR).",
    explanation:
      "INR monitoring helps assess the anticoagulant effect of warfarin and guide dosing.",
  },
  {
    id: "card-005",
    subject: "Pharmacology",
    topic: "Cardiovascular Drugs",
    question: "What should a nurse assess before administering a beta blocker?",
    answer: "Heart rate and blood pressure.",
    explanation:
      "Beta blockers can lower heart rate and blood pressure. Follow the medication order and facility parameters before administration.",
  },
  {
    id: "card-006",
    subject: "Pharmacology",
    topic: "Medication Administration",
    question: "What is the antidote commonly used for opioid-induced respiratory depression?",
    answer: "Naloxone.",
    explanation:
      "Naloxone reverses opioid effects. Continue monitoring because its duration may be shorter than that of the opioid.",
  },
  {
    id: "card-007",
    subject: "Medical-Surgical",
    topic: "Cardiovascular",
    question: "What is a common symptom of left-sided heart failure?",
    answer: "Pulmonary congestion and shortness of breath.",
    explanation:
      "Left-sided heart failure can cause blood to back up into the pulmonary circulation, leading to dyspnea and crackles.",
  },
  {
    id: "card-008",
    subject: "Medical-Surgical",
    topic: "Endocrine",
    question: "Which electrolyte imbalance is commonly associated with diabetic ketoacidosis?",
    answer: "Potassium imbalance.",
    explanation:
      "Serum potassium may initially be normal or elevated despite total-body potassium depletion. Monitor levels closely during treatment.",
  },
  {
    id: "card-009",
    subject: "Medical-Surgical",
    topic: "Respiratory",
    question: "What position can help improve breathing in a patient experiencing dyspnea?",
    answer: "High-Fowler's position, if tolerated.",
    explanation:
      "Upright positioning can improve chest expansion and ease the work of breathing.",
  },
  {
    id: "card-010",
    subject: "Maternal-Newborn",
    topic: "Pregnancy",
    question: "What is the usual duration of a full-term pregnancy?",
    answer: "Approximately 40 weeks from the first day of the last menstrual period.",
    explanation:
      "Pregnancy dating conventionally begins on the first day of the last menstrual period.",
  },
  {
    id: "card-011",
    subject: "Maternal-Newborn",
    topic: "Postpartum",
    question: "What should a nurse assess first when a postpartum patient has heavy vaginal bleeding?",
    answer: "Uterine tone and fundal firmness.",
    explanation:
      "A boggy uterus may indicate uterine atony, a common cause of postpartum hemorrhage. Activate the appropriate clinical response.",
  },
  {
    id: "card-012",
    subject: "Maternal-Newborn",
    topic: "Newborn Care",
    question: "What is the normal range of a newborn's resting heart rate?",
    answer: "Approximately 100–160 beats per minute.",
    explanation:
      "Interpret the heart rate alongside the newborn's activity, condition and other vital signs.",
  },
];

export const studyCardSubjects = [
  "All subjects",
  ...Array.from(new Set(studyCards.map((card) => card.subject))),
];