export interface LeadersLanguage {
  title: string;
  content: string;
}

export interface LeadersSlide {
  _id: string;
  arabic: LeadersLanguage;
  english: LeadersLanguage;
  image: {
    public_id: string;
    secure_url: string;
  };
}

export interface LeadersSlider {
  _id: string;
  title: string;
  content: string;
  page: string;
  section: string;
  slides: LeadersSlide[];
  __v: number;
}

export interface ParsedLeadersSlider {
  _id: string;
  title: {
    arabic: string;
    english: string;
  };
  content: {
    arabic: string;
    english: string;
  };
  page: string;
  section: string;
  slides: LeadersSlide[];
  __v: number;
}
