import { Place } from "../domain/Place";
import { PlaceRepository } from "../repositories/PlaceRepository";

export interface UpdatePetFriendlyStatusInput {
  placeId: number;
  confirmed: boolean;
}

export class UpdatePetFriendlyStatusUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(input: UpdatePetFriendlyStatusInput): Promise<Place | null> {
    return this.placeRepository.updatePetFriendlyStatus(
      input.placeId,
      input.confirmed
    );
  }
}
