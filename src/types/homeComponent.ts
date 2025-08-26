export interface HomeComponent {
  _id?: string;
  name: string;
  displayName: {
    english: string;
    arabic: string;
  };
  componentKey: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HomeComponentOrder {
  _id: string;
  order: number;
}

export interface HomeComponentUpdate {
  isActive?: boolean;
  order?: number;
}
