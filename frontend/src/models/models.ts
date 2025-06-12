import { Coordinates } from "./backend-models";

export interface Place {
  id: string;
  coordinates: Coordinates;
  name: string;
  type: string;
  allowsPet: boolean;
  googleMapsUrl: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
}
