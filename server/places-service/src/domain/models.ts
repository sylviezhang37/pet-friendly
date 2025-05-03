export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PetFriendlyStatus {
  confirmationCount: number;
  lastConfirmationDate: Date | null;
}

export interface PlaceData {
  id?: number;
  name: string;
  address: string;
  coordinates: Coordinates;
  businessType?: string;
  placeId?: string;
  googleMapsUrl?: string;
  allowsPet?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  petFriendlyStatus?: PetFriendlyStatus;
}
