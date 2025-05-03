import { Place } from "../domain/Place";
import { PlaceRepository } from "../repositories/PlaceRepository";

export interface UpdatePetFriendlyInput {
  placeId: number;
  confirmed: boolean;
}

export class UpdatePetFriendlyUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(input: UpdatePetFriendlyInput): Promise<Place | null> {
    return this.placeRepository.updatePetFriendlyStatus(
      input.placeId,
      input.confirmed
    );
  }
}
