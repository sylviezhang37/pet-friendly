export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BackendPlace {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
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

export interface SearchPlaceParams {
  query?: string;
  lat: number;
  lng: number;
}

export interface NearbyPlacesParams {
  lat: number;
  lng: number;
  radius?: number;
}

export interface NewUserRequest {
  username?: string;
  anonymous?: boolean;
}
