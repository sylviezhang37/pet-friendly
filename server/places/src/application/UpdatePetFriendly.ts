import { Place } from "../domain/Place";
import { PlaceRepository } from "../repositories/PlaceRepository";

export interface UpdatePetFriendlyInput {
  id: string;
  confirmed: boolean;
  num_confirm: number;
  num_deny: number;
  last_contribution_type: string;
  last_contribution_date: Date;
}

export class UpdatePetFriendly {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(input: UpdatePetFriendlyInput): Promise<Place | null> {
    return this.placeRepository.updatePetFriendlyStatus(
      input.id,
      input.confirmed,
      input.num_confirm,
      input.num_deny,
      input.last_contribution_type,
      input.last_contribution_date
    );
  }
}
