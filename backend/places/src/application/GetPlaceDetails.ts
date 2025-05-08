import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";

export interface PlaceDetailsOutput {
  place: Place | null;
}

export class GetPlaceDetails {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(id: string): Promise<PlaceDetailsOutput> {
    const place = await this.placeRepository.findById(id);

    return {
      place,
    };
  }
}
