export interface CofoundersLanguage {
  title: string;
  content: string;
}

export interface CofoundersSlide {
  _id: string;
  arabic: CofoundersLanguage;
  english: CofoundersLanguage;
  image: {
    public_id: string;
    secure_url: string;
  };
}

export interface CofoundersSlider {
  _id: string;
  title: string;
  content: string;
  page: string;
  section: string;
  slides: CofoundersSlide[];
  __v: number;
}

export interface ParsedCofoundersSlider {
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
  slides: CofoundersSlide[];
  __v: number;
}
