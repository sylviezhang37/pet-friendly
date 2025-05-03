import { PlaceData, PetFriendly } from "./models";

export class Place {
  public readonly id: number;
  public readonly name: string;
  public readonly address: string;
  public readonly coordinates: { lat: number; lng: number };
  public readonly businessType?: string;
  public readonly googleMapsUrl?: string;
  public readonly allowsPet?: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  private petFriendly: PetFriendly;

  constructor(data: PlaceData) {
    this.id = data.id;
    this.name = data.name;
    this.address = data.address;
    this.coordinates = data.coordinates;
    this.businessType = data.businessType;
    this.googleMapsUrl = data.googleMapsUrl;
    this.allowsPet = data.allowsPet;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.petFriendly = data.petFriendlyStatus || {
      confirmationCount: 0,
      lastConfirmationDate: null,
    };
  }

  public isPetFriendly(): boolean {
    return this.allowsPet || this.petFriendly.confirmationCount > 0;
  }

  public updatePetFriendlyStatus(confirmed: boolean): void {
    if (confirmed) {
      this.petFriendly.confirmationCount += 1;
      this.petFriendly.lastConfirmationDate = new Date();
    }
    (this as any).updatedAt = new Date();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      coordinates: this.coordinates,
      businessType: this.businessType,
      googleMapsUrl: this.googleMapsUrl,
      allowsPet: this.allowsPet,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isPetFriendly: this.isPetFriendly(),
      confirmationCount: this.petFriendly.confirmationCount,
    };
  }
}
