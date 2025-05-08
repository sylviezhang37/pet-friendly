import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";

export interface PlaceIdInput {
  id: string;
}

export interface PlaceDetailsOutput {
  place: Place | null;
}

export class GetPlaceDetails {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(input: PlaceIdInput): Promise<PlaceDetailsOutput> {
    const place = await this.placeRepository.findById(input.id);

    return {
      place,
    };
  }
}
