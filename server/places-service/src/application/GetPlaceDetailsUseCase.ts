import { Place } from "../domain/Place";
import { PlaceRepository } from "../repositories/PlaceRepository";

export interface GetPlaceDetailsInput {
  id: number;
}

export interface GetPlaceDetailsOutput {
  place: Place | null;
}

export class GetPlaceDetailsUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(input: GetPlaceDetailsInput): Promise<GetPlaceDetailsOutput> {
    const place = await this.placeRepository.findById(input.id);

    return {
      place,
    };
  }
}
