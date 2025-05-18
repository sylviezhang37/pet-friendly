import { Coordinates } from "./backend-models";

export interface Place {
  id: string;
  coordinates: Coordinates;
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
  id?: string;
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
