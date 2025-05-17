import { Place } from "../domain/Place";
import { Coordinates } from "../domain/models";

export interface PlacesRepo {
  findById(id: string): Promise<Place | null>;
  findNearby(coordinates: Coordinates, radius: number): Promise<Place[]>;
  search(query: string, coordinates: Coordinates): Promise<Place[]>;
  save(place: Place): Promise<Place>;
  updatePlace(
    id: string,
    address: string,
    num_confirm: number,
    num_deny: number,
    last_contribution_type: string,
    pet_friendly: boolean
  ): Promise<Place | null>;
}
