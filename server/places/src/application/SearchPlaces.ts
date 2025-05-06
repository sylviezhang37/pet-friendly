import { Place } from "../domain/Place";
import { PlaceRepository } from "../repositories/PlaceRepository";
import { PlacesProvider } from "../providers/PlacesProvider";
import { Coordinates } from "../domain/models";

export interface SearchPlacesInput {
  query: string;
  latitude: number;
  longitude: number;
}

export class SearchPlaces {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly placesProvider: PlacesProvider
  ) {}

  async execute(input: SearchPlacesInput): Promise<Place[]> {
    const coordinates: Coordinates = {
      lat: input.latitude,
      lng: input.longitude,
    };

    // first search in our database
    let places = await this.placeRepository.search(input.query, coordinates);

    // if not in db, search Google Maps
    if (places.length === 0) {
      const googlePlaces = await this.placesProvider.searchPlaces(
        input.query,
        coordinates
      );

      // save new places to our database
      for (const place of googlePlaces) {
        if (!places.some((p) => p.id === place.id)) {
          const savedPlace = await this.placeRepository.save(place);
          places.push(savedPlace);
        }
      }
    }

    return places;
  }
}
