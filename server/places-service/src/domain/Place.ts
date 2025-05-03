import { PlaceData, PetFriendlyStatus } from "./models";

export class Place {
  public readonly id?: number;
  public readonly name: string;
  public readonly address: string;
  public readonly coordinates: { lat: number; lng: number };
  public readonly businessType?: string;
  public readonly placeId?: string;
  public readonly googleMapsUrl?: string;
  public readonly allowsPet?: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  private petFriendlyStatus: PetFriendlyStatus;

  constructor(data: PlaceData) {
    this.id = data.id;
    this.name = data.name;
    this.address = data.address;
    this.coordinates = data.coordinates;
    this.businessType = data.businessType;
    this.placeId = data.placeId;
    this.googleMapsUrl = data.googleMapsUrl;
    this.allowsPet = data.allowsPet;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.petFriendlyStatus = data.petFriendlyStatus || {
      confirmationCount: 0,
      lastConfirmationDate: null,
    };
  }

  public isPetFriendly(): boolean {
    return this.allowsPet || this.petFriendlyStatus.confirmationCount > 0;
  }

  public isRecentlyConfirmed(): boolean {
    if (!this.petFriendlyStatus.lastConfirmationDate) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.petFriendlyStatus.lastConfirmationDate > thirtyDaysAgo;
  }

  public updatePetFriendlyStatus(confirmed: boolean): void {
    if (confirmed) {
      this.petFriendlyStatus.confirmationCount += 1;
      this.petFriendlyStatus.lastConfirmationDate = new Date();
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
      placeId: this.placeId,
      googleMapsUrl: this.googleMapsUrl,
      allowsPet: this.allowsPet,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isPetFriendly: this.isPetFriendly(),
      isRecentlyConfirmed: this.isRecentlyConfirmed(),
      confirmationCount: this.petFriendlyStatus.confirmationCount,
    };
  }
}
