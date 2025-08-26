export interface BlogsLanguage {
  title: string;
  description: string;
}

export interface BlogsSlider {
  _id: string;
  title: string;
  content: string;
  slides: BlogsSlide[];
}

export interface BlogsSlide {
  _id: string;
  image: {
    secure_url: string;
    public_id: string;
  };
  arabic: BlogsLanguage;
  english: BlogsLanguage;
}

export interface ParsedBlogsSlider {
  _id: string;
  title: {
    arabic: string;
    english: string;
  };
  content: {
    arabic: string;
    english: string;
  };
  slides: BlogsSlide[];
}
