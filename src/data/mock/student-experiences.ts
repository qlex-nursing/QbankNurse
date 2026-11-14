export interface StudentExperience {
  id: number;
  category: string;
  quote: string;
  initials: string;
  background: string;
}

export const studentExperiences: StudentExperience[] = [
  {
    id: 1,
    category: "Practice",
    quote:
      "Working through questions helps me identify what I understand and what I need to revisit.",
    initials: "S",
    background: "bg-[#E8DEFF]",
  },
  {
    id: 2,
    category: "Rationales",
    quote:
      "Understanding why an answer is correct makes studying feel more meaningful than memorising.",
    initials: "N",
    background: "bg-[#FFD6A5]",
  },
  {
    id: 3,
    category: "Study routine",
    quote:
      "Breaking my revision into focused sessions makes it easier to stay consistent with my studies.",
    initials: "J",
    background: "bg-[#FFF275]",
  },
  {
    id: 4,
    category: "Clinical reasoning",
    quote:
      "I want to get better at thinking through patient situations instead of simply guessing answers.",
    initials: "A",
    background: "bg-[#FCE1E1]",
  },
  {
    id: 5,
    category: "Learning",
    quote:
      "Reviewing explanations gives me another opportunity to connect nursing concepts to practice.",
    initials: "M",
    background: "bg-[#E1E8FF]",
  },
  {
    id: 6,
    category: "Preparation",
    quote:
      "Having a structured way to practise different topics helps me organise my exam preparation.",
    initials: "K",
    background: "bg-[#F8E7C9]",
  },
];