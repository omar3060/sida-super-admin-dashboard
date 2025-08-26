export interface PlanLanguage {
  name: string;
  description: string;
  features: string[];
}

export interface Plan {
  _id: string;
  english: PlanLanguage;
  arabic: PlanLanguage;
  price: number;
  activeFeatures: number[];
  __v?: number;
}
