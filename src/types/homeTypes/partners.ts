export interface PartnersLanguage {
  arabic: string;
  english: string;
}

export interface PartnerSlideImage {
  public_id: string;
  secure_url: string;
}

export interface PartnerSlide {
  _id: string;
  image: PartnerSlideImage;
}

export interface PartnersSlider {
  _id: string;
  page: string;
  section: string;
  title: string;
  content: string;
  slides: PartnerSlide[];
  __v?: number;
}

export interface ParsedPartnersSlider {
  _id: string;
  page: string;
  section: string;
  title: PartnersLanguage;
  content: PartnersLanguage;
  slides: PartnerSlide[];
  __v?: number;
}
