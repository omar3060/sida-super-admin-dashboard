export interface ServiceFeaturesSlide {
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

export interface ServiceFeaturesData {
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
    slides: ServiceFeaturesSlide[];
    __v: number;
  };
}

export interface ServiceFeaturesSlideFormData {
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
  } | null;
  text: string;
  _id?: string;
}
