export interface Place {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: string;
  allowsPet: boolean;
  googleMapsUrl: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  numConfirm: number;
  numDeny: number;
  lastContributionType: string;
  petFriendly: boolean;
}

export interface Review {
  id?: number;
  placeId: string;
  userId: string;
  username: string;
  petFriendly: boolean;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
}
