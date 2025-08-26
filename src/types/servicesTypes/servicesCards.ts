export interface ServicesCardsLanguage {
  title: string;
  content: string;
}

export interface ServicesCardsSlide {
  _id: string;
  arabic: ServicesCardsLanguage;
  english: ServicesCardsLanguage;
  image: {
    public_id: string;
    secure_url: string;
  };
  text?: string;
}

export interface ServicesCardsSlider {
  _id: string;
  title: string;
  content: string;
  page: string;
  section: string;
  slides: ServicesCardsSlide[];
  __v: number;
}

export interface ParsedServicesCardsSlider {
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
  slides: ServicesCardsSlide[];
  __v: number;
}
