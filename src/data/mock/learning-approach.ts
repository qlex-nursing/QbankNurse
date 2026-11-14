export interface LearningApproach {
  id: string;
  title: string;
  icon: "target" | "book" | "chart";
  accent: "red" | "apricot" | "indigo";
  points: string[];
}

export const learningApproaches: LearningApproach[] = [
  {
    id: "focused-practice",
    title: "Practice That Feels Focused",
    icon: "target",
    accent: "red",
    points: [
      "Practice nursing questions across different topics",
      "Explore different question formats",
      "Use timed sessions to practise pacing",
      "Build confidence through consistent practice",
    ],
  },
  {
    id: "understanding",
    title: "Review That Builds Understanding",
    icon: "book",
    accent: "apricot",
    points: [
      "Review explanations after answering",
      "Explore clinical case-based questions",
      "Strengthen your understanding of nursing concepts",
    ],
  },
  {
    id: "study-control",
    title: "A Study Rhythm You Control",
    icon: "chart",
    accent: "red",
    points: [
      "Keep track of your learning progress",
      "Organise practice by exam and topic",
      "Return to questions you want to review",
      "Build a consistent study routine",
    ],
  },
];