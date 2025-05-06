import { Place } from "../domain/Place";
import { PlacesRepository } from "../repositories/PlacesRepository";

export interface GetPlaceDetailsInput {
  id: string;
}

export interface GetPlaceDetailsOutput {
  place: Place | null;
}

export class GetPlaceDetails {
  constructor(private readonly placeRepository: PlacesRepository) {}

  async execute(input: GetPlaceDetailsInput): Promise<GetPlaceDetailsOutput> {
    const place = await this.placeRepository.findById(input.id);

    return {
      place,
    };
  }
}
