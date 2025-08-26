// Footer Section Types
export interface FooterLanguage {
  title: string;
  content: string;
}

export interface FooterImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface FooterSection {
  _id: string;
  arabic: FooterLanguage;
  english: FooterLanguage;
  page: string;
  section: string;
  images: FooterImage[];
  __v?: number;
}

// Footer Links Types
export interface FooterLinkLanguage {
  title: string;
}

export interface FooterLink {
  _id: string;
  arabic: FooterLinkLanguage;
  english: FooterLinkLanguage;
  link: string;
  category: "company" | "services" | "support" | "contactus";
  __v?: number;
}

export interface FooterLinksResponse {
  message: string;
  links: FooterLink[];
}

// Social Media Links Types
export interface SocialLink {
  _id: string;
  link: string;
  icon: string;
  display: boolean;
  __v?: number;
}

export interface SocialLinksResponse {
  message: string;
  socialLinks: SocialLink[];
}

// Category Options
export const FOOTER_CATEGORIES = [
  { value: "company", label: "الشركة / Company" },
  { value: "services", label: "الخدمات / Services" },
  { value: "support", label: "الدعم / Support" },
  { value: "contactus", label: "تواصل معنا / Contact Us" },
] as const;
