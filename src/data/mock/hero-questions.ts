export interface HeroQuestion {
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  answer: string;
  rationale: string;
}

export const heroQuestions: HeroQuestion[] = [
  {
    category: "Patient Assessment",
    question:
      "A patient suddenly reports difficulty breathing. What should the nurse do first?",
    options: [
      { id: "A", text: "Administer the prescribed medication." },
      { id: "B", text: "Assess the patient's respiratory status." },
      { id: "C", text: "Notify the healthcare provider." },
      { id: "D", text: "Document the reported symptoms." },
    ],
    answer: "B",
    rationale:
      "A sudden change in breathing requires immediate assessment. The nurse should first evaluate respiratory status to determine the severity of the problem and guide appropriate interventions.",
  },
  {
    category: "Infection Prevention",
    question:
      "Which action is appropriate when caring for a patient under contact precautions?",
    options: [
      { id: "A", text: "Wear the required gown and gloves." },
      { id: "B", text: "Wear a surgical mask only." },
      { id: "C", text: "Use sterile gloves for every interaction." },
      { id: "D", text: "Skip hand hygiene when gloves are worn." },
    ],
    answer: "A",
    rationale:
      "Contact precautions generally require a gown and gloves when entering the patient's care environment. Hand hygiene remains essential before and after patient contact.",
  },
  {
    category: "Medication Safety",
    question:
      "Which action best helps prevent medication administration errors?",
    options: [
      { id: "A", text: "Identify patients by their room number." },
      { id: "B", text: "Prepare medications for several patients together." },
      { id: "C", text: "Verify identity using approved identifiers." },
      { id: "D", text: "Ask another patient to confirm an identity." },
    ],
    answer: "C",
    rationale:
      "Approved patient identifiers help ensure medication is administered to the correct person. Room numbers are not reliable patient identifiers.",
  },
];