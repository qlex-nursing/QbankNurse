export const studentSuccess = {
  percentage: "96%",
  message: "A little progress every day can lead to a stronger exam-day mindset.",
  disclaimer: "Illustrative demonstration statistic — not verified QbankNurse results.",
  highlights: [
    "Detailed explanations after practice",
    "Different ways to prepare",
    "A learning experience built around nursing students",
  ],
};

export interface StudentStory {
  id: string;
  initials: string;
  name: string;
  exam: string;
  quote: string;
  accent: "red" | "indigo" | "apricot" | "teal";
}

export const studentStories: StudentStory[] = [
  {
    id: "story-1",
    initials: "IT",
    name: "Sample Learner 01",
    exam: "ATI Comprehensive Predictor",
    quote:
      "Working through structured questions and reviewing the explanations helped me understand where I needed to improve.",
    accent: "red",
  },
  {
    id: "story-2",
    initials: "KC",
    name: "Sample Learner 02",
    exam: "HESI Exit Exam",
    quote:
      "Having explanations alongside practice questions makes it easier to understand why an answer is correct.",
    accent: "teal",
  },
  {
    id: "story-3",
    initials: "MM",
    name: "Sample Learner 03",
    exam: "ATI Medical-Surgical",
    quote:
      "Practising different nursing topics helped me become more comfortable working through clinical questions.",
    accent: "indigo",
  },
  {
    id: "story-4",
    initials: "JN",
    name: "Sample Learner 04",
    exam: "NCLEX-RN Preparation",
    quote:
      "Following a consistent study routine helped me organise my revision and focus on the areas I needed to revisit.",
    accent: "apricot",
  },
  {
    id: "story-5",
    initials: "AS",
    name: "Sample Learner 05",
    exam: "ATI Pharmacology",
    quote:
      "The rationales are an important part of practice because they help connect nursing concepts to clinical decisions.",
    accent: "red",
  },
  {
    id: "story-6",
    initials: "DM",
    name: "Sample Learner 06",
    exam: "HESI Specialty Practice",
    quote:
      "Being able to practise different subjects in one place gives me a clearer structure for my study sessions.",
    accent: "teal",
  },
];