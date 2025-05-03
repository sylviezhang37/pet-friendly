import { Place } from "../domain/Place";
import { PlaceRepository } from "../repositories/PlaceRepository";

export interface AddPlaceInput {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  businessType?: string;
  googleMapsUrl?: string;
  allowsPet?: boolean;
}

export class AddPlaceUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

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
