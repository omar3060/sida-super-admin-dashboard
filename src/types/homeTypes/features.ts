export interface FeaturesLanguage {
  title: string;
  content: string;
}

export interface FeaturesImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface Features {
  _id: string;
  arabic: FeaturesLanguage;
  english: FeaturesLanguage;
  page: string;
  section: string;
  images: FeaturesImage[];
  __v?: number;
}
