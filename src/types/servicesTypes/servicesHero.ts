export interface ServicesHeroLanguage {
  title: string;
  content: string;
}

export interface ServicesHeroImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface ServicesHero {
  _id: string;
  arabic: ServicesHeroLanguage;
  english: ServicesHeroLanguage;
  page: string;
  section: string;
  images: ServicesHeroImage[];
  __v?: number;
}
