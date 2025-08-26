export interface FeatureTableSlideContent {
  title: string;
  content: string;
}

export interface FeatureTableSlide {
  arabic: FeatureTableSlideContent;
  english: FeatureTableSlideContent;
  image: {
    public_id: string;
    secure_url: string;
  };
  _id: string;
}

export interface FeatureTableSlider {
  _id: string;
  page: string;
  section: string;
  slides: FeatureTableSlide[];
  __v: number;
}

export interface FeatureTableSliderResponse {
  slider: FeatureTableSlider;
}

export interface AddFeatureTableSlideRequest {
  arabic: string;
  english: string;
  image: File;
}

export interface UpdateFeatureTableSlideRequest {
  arabic?: string;
  english?: string;
  image?: File;
}
