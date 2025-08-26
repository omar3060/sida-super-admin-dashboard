export interface SidaOffersLanguage {
  title: string;
  content: string;
}

export interface SidaOffersSlide {
  _id: string;
  arabic: SidaOffersLanguage;
  english: SidaOffersLanguage;
  image: {
    public_id: string;
    secure_url: string;
  };
}

export interface SidaOffersSlider {
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
  slides: SidaOffersSlide[];
  __v: number;
}

export interface ParsedSidaOffersSlider {
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
  slides: SidaOffersSlide[];
  __v: number;
} 