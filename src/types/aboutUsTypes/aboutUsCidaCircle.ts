export interface AboutUsCidaCircleLanguage {
  title: string;
  content: string;
}

export interface AboutUsCidaCircleImage {
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface AboutUsCidaCircle {
  _id: string;
  arabic: AboutUsCidaCircleLanguage;
  english: AboutUsCidaCircleLanguage;
  page: string;
  section: string;
  images?: AboutUsCidaCircleImage[];
  __v?: number;
}
