export interface ImageComparisonImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface ImageComparisonContent {
  title: string;
  content: string;
}

export interface ImageComparison {
  arabic: ImageComparisonContent;
  english: ImageComparisonContent;
  _id: string;
  page: string;
  section: string;
  images: ImageComparisonImage[];
  __v: number;
}

export interface ImageComparisonResponse {
  section: ImageComparison;
} 