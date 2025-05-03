export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PetFriendly {
  confirmationCount: number;
  lastConfirmationDate: Date | null;
}

export interface PlaceData {
  id: number;
  name: string;
  address: string;
  coordinates: Coordinates;
  businessType?: string;
  googleMapsUrl?: string;
  allowsPet?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  petFriendlyStatus?: PetFriendly;
}
