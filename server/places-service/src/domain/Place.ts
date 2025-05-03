import { PlaceData, PetFriendly } from "./models";

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
    this.petFriendly = data.petFriendly || {
      numConfirm: 0,
      numDeny: 0,
      lastContributionType: null,
      lastContributionDate: null,
    };
  }

  public isPetFriendly(): boolean {
    return this.allowsPet || this.petFriendly.numConfirm > 0;
  }

  public updatePetFriendlyStatus(confirmed: boolean): void {
    if (confirmed) {
      this.petFriendly.numConfirm += 1;
      this.petFriendly.lastContributionDate = new Date();
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
      // TODO: think about how to handle this petfriendly object
      petFriendly: this.petFriendly,
      isPetFriendly: this.isPetFriendly(),
    };
  }
}
