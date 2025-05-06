import { Place } from "../domain/Place";
import { Coordinates } from "../domain/models";

export interface PlacesRepository {
  findById(id: string): Promise<Place | null>;
  findNearby(coordinates: Coordinates, radius: number): Promise<Place[]>;
  search(query: string, coordinates: Coordinates): Promise<Place[]>;
  save(place: Place): Promise<Place>;
  updatePetFriendlyStatus(
    id: string,
    pet_friendly: boolean,
    num_confirm: number,
    num_deny: number,
    last_contribution_type: string,
    last_contribution_date: Date
  ): Promise<Place | null>;
}
