export interface AboutUsThirdSectionLanguage {
  title: string;
  content: string;
}

export interface AboutUsThirdSectionImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface AboutUsThirdSection {
  _id: string;
  arabic: AboutUsThirdSectionLanguage;
  english: AboutUsThirdSectionLanguage;
  page: string;
  section: string;
  images: AboutUsThirdSectionImage[];
  __v?: number;
}
