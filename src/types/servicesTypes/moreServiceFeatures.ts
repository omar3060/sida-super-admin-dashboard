export interface MoreServiceFeaturesSlide {
  arabic: {
    title: string;
    content: string;
  };
  english: {
    title: string;
    content: string;
  };
  image: {
    public_id: string;
    secure_url: string;
  };
  text: string;
  _id: string;
}

export interface MoreServiceFeaturesData {
  slider: {
    title: {
      arabic: string;
      english: string;
    };
    content: {
      arabic: string;
      english: string;
    };
    _id: string;
    page: string;
    section: string;
    slides: MoreServiceFeaturesSlide[];
    __v: number;
  };
}

export interface MoreServiceFeaturesSlideFormData {
  arabic: {
    title: string;
    content: string;
  };
  english: {
    title: string;
    content: string;
  };
  image: File | null;
  text: string;
}
