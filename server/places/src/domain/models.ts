export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PetFriendly {
  numConfirm: number;
  numDeny: number;
  lastContributionType: "confirm" | "deny" | null;
  lastContributionDate: Date | null;
}

export interface PlaceData {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  businessType?: string;
  googleMapsUrl?: string;
  allowsPet?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  numConfirm?: number;
  numDeny?: number;
  lastContributionType?: string | null;
  lastContributionDate?: Date | null;
  petFriendly?: boolean;
}
