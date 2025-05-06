import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";

export interface GetPlaceDetailsInput {
  id: string;
}

export interface GetPlaceDetailsOutput {
  place: Place | null;
}

export class GetPlaceDetails {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(input: GetPlaceDetailsInput): Promise<GetPlaceDetailsOutput> {
    const place = await this.placeRepository.findById(input.id);

    return {
      place,
    };
  }
}
