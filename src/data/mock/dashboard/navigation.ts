import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Award,
  Library,
  ChartNoAxesColumnIncreasing,
  Bookmark,
  Compass,
  Layers,
  NotebookPen,
  MessageCircle,
  HeartPulse,
  Target,
  Calculator,
  Brain,
  CalendarDays,
  ClipboardList,
  UserRound,
  Settings,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href?: string;
  icon?: typeof LayoutDashboard;
  children?: DashboardNavItem[];
}

export interface DashboardNavGroup {
  title?: string;
  items: DashboardNavItem[];
}

export const dashboardNavigation: DashboardNavGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Exams",
    items: [
      {
        label: "RN Exams",
        href: "/dashboard/exams/rn",
        icon: GraduationCap,
      },
      {
        label: "LPN Exams",
        href: "/dashboard/exams/lpn",
        icon: BookOpen,
      },
      {
        label: "RN Exit",
        href: "/dashboard/study-library?filter=rn-exit",
        icon: Award,
      },
      {
        label: "LPN Exit",
        href: "/dashboard/study-library?filter=lpn-exit",
        icon: Award,
      },
    ],
  },
  {
    title: "Practice",
    items: [
      {
        label: "Study Library",
        href: "/dashboard/study-library",
        icon: Library,
      },
      {
        label: "Performance",
        href: "/dashboard/performance",
        icon: ChartNoAxesColumnIncreasing,
      },
      {
        label: "My Library",
        href: "/dashboard/my-library",
        icon: Bookmark,
      },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Study Hub", href: "/dashboard/study-hub", icon: Compass },
      { label: "Study Cards", href: "/dashboard/study-cards", icon: Layers },
      {
        label: "Study Guides",
        href: "/dashboard/study-guides",
        icon: NotebookPen,
      },
      {
        label: "Community",
        href: "/dashboard/community",
        icon: MessageCircle,
      },
      {
        label: "Nursing Care Plans",
        href: "/dashboard/care-plans",
        icon: HeartPulse,
      },
      {
        label: "Custom Practice",
        href: "/dashboard/custom-practice",
        icon: Target,
      },
      {
        label: "Flashcards",
        href: "/dashboard/flashcards",
        icon: BookOpen,
      },
      {
        label: "Calculators",
        href: "/dashboard/calculators",
        icon: Calculator,
      },
      {
        label: "AI Tutor",
        href: "/dashboard/ai-tutor",
        icon: Brain,
      },
      {
        label: "Study Planner",
        href: "/dashboard/study-planner",
        icon: CalendarDays,
      },
      {
        label: "All Subjects",
        href: "/dashboard/subjects",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "NCLEX",
    items: [
      {
        label: "NCLEX RN",
        href: "/dashboard/study-library?filter=nclex-rn",
        icon: ClipboardList,
      },
      {
        label: "NCLEX PN (LPN)",
        href: "/dashboard/study-library?filter=nclex-pn",
        icon: ClipboardList,
      },
      {
        label: "NCLEX Practice",
        href: "/dashboard/study-library?filter=nclex",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My Account", href: "/dashboard/account", icon: UserRound },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];