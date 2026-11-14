export const communityCategories = [
  "General",
  "Question",
  "NCLEX",
  "ATI",
  "HESI",
  "Study Tips",
  "Clinicals",
] as const;

export type CommunityCategory =
  (typeof communityCategories)[number];

export interface CommunityReply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  category: CommunityCategory;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  replies: CommunityReply[];
}

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: "post-001",
    category: "HESI",
    author: "Sunny Penguin 5819",
    title: "HESI",
    content:
      "Questions were spot on! I made a 91 on my HESI. This is your sign to join.",
    createdAt: "2026-10-20T10:30:00.000Z",
    replies: [],
  },
  {
    id: "post-002",
    category: "Question",
    author: "Sunny Robin 0987",
    title: "Is QNurse the best so far?",
    content:
      "I find QNurse to be so helpful with my studies. I have gained so much since I started using it. I highly recommend it!",
    createdAt: "2026-10-08T09:15:00.000Z",
    replies: [],
  },
  {
    id: "post-003",
    category: "Study Tips",
    author: "Bright Nurse 2041",
    title: "How do you stay consistent with studying?",
    content:
      "I'm trying to build a daily study routine while balancing clinicals. What has worked best for you?",
    createdAt: "2026-10-05T14:00:00.000Z",
    replies: [
      {
        id: "reply-001",
        author: "Calm Nurse 3321",
        content:
          "Short focused sessions helped me. I do 25 minutes of questions, then review the rationales.",
        createdAt: "2026-10-05T15:00:00.000Z",
      },
    ],
  },
];