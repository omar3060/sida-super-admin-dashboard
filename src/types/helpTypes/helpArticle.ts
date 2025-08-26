export interface HelpArticleData {
  arabic: {
    title: string;
    content: string;
    steps: string[];
  };
  english: {
    title: string;
    content: string;
    steps: string[];
  };
  image: {
    public_id: string;
    secure_url: string;
  };
  vedio: {
    public_id: string;
    secure_url: string;
  };
  cover: {
    public_id: string;
    secure_url: string;
  };
  _id: string;
  article: { arabic: string; english: string };
  __v: number;
}

export interface HelpArticlesResponse {
  message: string;
  articles: HelpArticleData[];
}

export interface HelpArticleFormData {
  arabic: {
    title: string;
    content: string;
    steps: string[];
  };
  english: {
    title: string;
    content: string;
    steps: string[];
  };
  image: File | null;
  vedio: File | null;
  article: { arabic: string; english: string };
  cover: File | null;
}
