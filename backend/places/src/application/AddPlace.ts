import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";
import { v4 as uuidv4 } from "uuid";

export interface PlaceInput {
  name: string;
  address: string;
  lat: number;
  lng: number;
  businessType?: string | null;
  googleMapsUrl?: string | null;
  allowsPet?: boolean | null;
}

export class AddPlace {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(input: PlaceInput): Promise<Place> {
    const place = new Place({
      id: uuidv4(),
      name: input.name,
      address: input.address,
      coordinates: {
        lat: input.lat,
        lng: input.lng,
      },
      businessType: input.businessType,
      googleMapsUrl: input.googleMapsUrl,
      allowsPet: input.allowsPet,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.placeRepository.save(place);
  }
}
