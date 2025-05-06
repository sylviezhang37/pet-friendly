import { PlaceData } from "./models";

export class Place {
  public readonly id: string;
  public readonly name: string;
  public readonly address: string;
  public readonly coordinates: { lat: number; lng: number };
  public readonly businessType?: string;
  public readonly googleMapsUrl?: string;
  public readonly allowsPet?: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly numConfirm: number;
  public readonly numDeny: number;
  public readonly lastContributionType: string | null;
  public readonly lastContributionDate: Date | null;
  public readonly petFriendly: boolean;

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
    this.numConfirm = data.numConfirm || 0;
    this.numDeny = data.numDeny || 0;
    this.lastContributionType = data.lastContributionType || null;
    this.lastContributionDate = data.lastContributionDate || null;
    this.petFriendly = this.isPetFriendly();
  }

  public isPetFriendly(): boolean {
    return this.allowsPet || this.numConfirm > 0;
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
      numConfirm: this.numConfirm,
      numDeny: this.numDeny,
      lastContributionType: this.lastContributionType,
      lastContributionDate: this.lastContributionDate,
      petFriendly: this.petFriendly,
    };
  }
}
