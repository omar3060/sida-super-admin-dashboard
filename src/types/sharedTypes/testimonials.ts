export interface TestimonialImage {
  public_id: string;
  secure_url: string;
}

export interface TestimonialLanguage {
  text: string;
  name: string;
  company: string;
}

export interface Testimonial {
  _id: string;
  image: TestimonialImage;
  arabic: TestimonialLanguage;
  english: TestimonialLanguage;
  __v: number;
}

export interface TestimonialsResponse {
  testimonials: Testimonial[];
}

export interface TestimonialHeader {
  _id: string;
  image: TestimonialImage;
  arabic: {
    text: string;
    name: "header";
    company: string;
  };
  english: {
    text: string;
    name: "header";
    company: string;
  };
  __v: number;
}

export interface TestimonialCard {
  _id: string;
  image: TestimonialImage;
  arabic: TestimonialLanguage;
  english: TestimonialLanguage;
  __v: number;
}
