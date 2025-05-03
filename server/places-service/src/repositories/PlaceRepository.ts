import { Place } from "../domain/Place";
import { Coordinates } from "../domain/models";

export interface PlaceRepository {
  findById(id: number): Promise<Place | null>;
  findNearby(coordinates: Coordinates, radius: number): Promise<Place[]>;
  search(query: string, coordinates: Coordinates): Promise<Place[]>;
  save(place: Place): Promise<Place>;
  updatePetFriendlyStatus(
    placeId: number,
    confirmed: boolean
  ): Promise<Place | null>;
}
