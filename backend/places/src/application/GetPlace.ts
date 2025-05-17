import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";

export interface PlaceOutput {
  place: Place | null;
}

export class GetPlace {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(id: string): Promise<PlaceOutput> {
    const place = await this.placeRepository.findById(id);

    return {
      place,
    };
  }
}
