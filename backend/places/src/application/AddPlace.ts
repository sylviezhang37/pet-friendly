import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";

export interface AddPlaceInput {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  businessType?: string | null;
  googleMapsUrl?: string | null;
  allowsPet?: boolean | null;
}

export class AddPlace {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(input: AddPlaceInput): Promise<Place> {
    const place = new Place({
      id: input.id,
      name: input.name,
      address: input.address,
      coordinates: {
        lat: input.latitude,
        lng: input.longitude,
      },
      businessType: input.businessType,
      googleMapsUrl: input.googleMapsUrl,
      allowsPet: input.allowsPet,
    });

    return this.placeRepository.save(place);
  }
}
