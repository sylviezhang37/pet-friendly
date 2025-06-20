import { Coordinates } from "./backend-models";

export interface Place {
  id: string;
  name: string;
  type: string;
  coordinates: Coordinates;
  googleMapsUrl: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  numConfirm: number;
  numDeny: number;
  lastContributionType: string;
  allowsPet: boolean;
  petFriendly: boolean;
}

export interface Review {
  id?: string;
  placeId: string;
  userId: string;
  username: string;
  petFriendly: boolean;
  comment: string;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  googleId: string;
  email: string;
  createdAt: Date;
}
