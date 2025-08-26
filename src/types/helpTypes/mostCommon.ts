export interface MostCommonSlide {
  arabic: {
    title: string;
  };
  english: {
    title: string;
  };
  image: {
    public_id: string;
    secure_url: string;
  };
  text: string;
  _id: string;
}

export interface MostCommonData {
  slider: {
    title: {
      arabic: string;
      english: string;
    };
    _id: string;
    page: string;
    section: string;
    slides: MostCommonSlide[];
    __v: number;
  };
}

export interface MostCommonSlideFormData {
  arabic: {
    title: string;
  };
  english: {
    title: string;
  };
  image: {
    public_id: string;
    secure_url: string;
  } | null;
  text: string;
  _id?: string;
}
