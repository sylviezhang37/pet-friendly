export interface Place {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

export interface Review {
  id: number;
  userId: string;
  username: string;
  confirm: boolean;
  comment: string;
  createdAt: string;
}
