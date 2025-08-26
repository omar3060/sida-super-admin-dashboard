export interface AboutUsFourthSectionLanguage {
  title: string;
  content: string;
}

export interface AboutUsFourthSectionImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface AboutUsFourthSection {
  _id: string;
  arabic: AboutUsFourthSectionLanguage;
  english: AboutUsFourthSectionLanguage;
  page: string;
  section: string;
  images: AboutUsFourthSectionImage[];
  __v?: number;
}
