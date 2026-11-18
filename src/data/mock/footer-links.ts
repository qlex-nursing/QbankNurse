export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: FooterLink[];
}

export const footerGroups: FooterGroup[] = [
  {
    title: "Get Started",
    links: [
      { label: "Create Account", href: "/register" },
      { label: "Browse Exams", href: "/#study-library" },
      { label: "Practice Questions", href: "/dashboard/custom-practice" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "ATI Preparation", href: "/dashboard/exams/rn/ati" },
      { label: "HESI Preparation", href: "/dashboard/study-library" },
      { label: "NCLEX Preparation", href: "/dashboard/exams/rn" },
      { label: "Study Library", href: "/#study-library" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About QbankNurse", href: "/" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/" },
      { label: "Privacy Policy", href: "/" },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
];

