export interface AboutUsFirstSectionLanguage {
  title: string;
  content: string;
}

export interface AboutUsFirstSectionImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface AboutUsFirstSection {
  _id: string;
  arabic: AboutUsFirstSectionLanguage;
  english: AboutUsFirstSectionLanguage;
  page: string;
  section: string;
  images: AboutUsFirstSectionImage[];
  __v?: number;
}
