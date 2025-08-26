export interface ServicesLanguage {
  title: string;
  content: string;
}

export interface ServicesSlide {
  _id: string;
  arabic: ServicesLanguage;
  english: ServicesLanguage;
  image: {
    public_id: string;
    secure_url: string;
  };
  text?: string;
}

export interface ServicesSlider {
  _id: string;
  title: string;
  page: string;
  section: string;
  slides: ServicesSlide[];
  __v: number;
}

export interface ParsedServicesSlider {
  _id: string;
  title: {
    arabic: string;
    english: string;
  };
  page: string;
  section: string;
  slides: ServicesSlide[];
  __v: number;
}
