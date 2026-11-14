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
      { label: "Practice Questions", href: "/study" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "ATI Preparation", href: "/exams/ati" },
      { label: "HESI Preparation", href: "/exams/hesi" },
      { label: "NCLEX Preparation", href: "/exams/nclex" },
      { label: "Study Library", href: "/#study-library" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About QNurse", href: "/about" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];