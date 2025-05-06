export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceData {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  businessType?: string | null;
  googleMapsUrl?: string | null;
  allowsPet?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
  numConfirm?: number;
  numDeny?: number;
  lastContributionType?: string | null;
  lastContributionDate?: Date | null;
  petFriendly?: boolean;
}
