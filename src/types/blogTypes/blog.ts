export interface BlogSection {
  _id: string;
  title: {
    arabic: string;
    english: string;
  };
  content: {
    arabic: string[];
    english: string[];
  };
}

export interface Blog {
  _id: string;
  text: string;
  image?: {
    secure_url: string;
    public_id: string;
  };
  sections: BlogSection[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogsResponse {
  blogs: Blog[];
}

export interface BlogFormData {
  text: string;
  sections: Omit<BlogSection, "_id">[];
}

export interface SectionFormData {
  title: {
    arabic: string;
    english: string;
  };
  content: {
    arabic: string[];
    english: string[];
  };
}
