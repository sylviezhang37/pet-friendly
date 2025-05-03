import { Place } from "../domain/Place";
import { Coordinates } from "../domain/models";

export interface PlacesProvider {
  findNearbyPlaces(coordinates: Coordinates, radius: number): Promise<Place[]>;
  getPlaceDetails(id: string): Promise<Place>;
  searchPlaces(query: string, coordinates: Coordinates): Promise<Place[]>;
}
