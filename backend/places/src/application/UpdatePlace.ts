import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";

export interface UpdatePlaceInput {
  id: string;
  address: string;
  num_confirm: number;
  num_deny: number;
  last_contribution_type: string;
  pet_friendly: boolean;
}

export class UpdatePlace {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(input: UpdatePlaceInput): Promise<Place | null> {
    return this.placeRepository.updatePlace(
      input.id,
      input.address,
      input.num_confirm,
      input.num_deny,
      input.last_contribution_type,
      input.pet_friendly
    );
  }
}
