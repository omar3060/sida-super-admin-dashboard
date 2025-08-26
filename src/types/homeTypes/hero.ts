export interface HeroLanguage {
  title: string;
  content: string;
}

export interface HeroImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface Hero {
  _id: string;
  arabic: HeroLanguage;
  english: HeroLanguage;
  page: string;
  section: string;
  images: HeroImage[];
  __v?: number;
}
