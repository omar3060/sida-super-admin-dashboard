export interface WhoWeServeLanguage {
  title: string;
  content: string;
}

export interface WhoWeServeSlide {
  _id: string;
  arabic: WhoWeServeLanguage;
  english: WhoWeServeLanguage;
  image: {
    public_id: string;
    secure_url: string;
  };
  text?: string;
}

export interface WhoWeServeSlider {
  _id: string;
  title: string;
  page: string;
  section: string;
  slides: WhoWeServeSlide[];
  __v: number;
}

export interface ParsedWhoWeServeSlider {
  _id: string;
  title: {
    arabic: string;
    english: string;
  };
  page: string;
  section: string;
  slides: WhoWeServeSlide[];
  __v: number;
}
