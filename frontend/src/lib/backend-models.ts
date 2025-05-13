export interface BackendPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  allowsPet: boolean;
  googleMapsUrl: string;
  createdAt: string;
  updatedAt: string;
  numConfirm: number;
  numDeny: number;
  lastContributionType: string;
  petFriendly: boolean;
}

export interface BackendReview {
  id: string;
  placeId: string;
  userId: string;
  username: string;
  petFriendly: boolean;
  comment: string;
  createdAt: string;
}

export interface BackendUser {
  id: string;
  username: string;
  anonymous: boolean;
  createdAt: string;
}
