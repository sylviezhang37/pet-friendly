import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";
import { PlacesProvider } from "../providers/PlacesProvider";
import { Coordinates } from "../domain/models";

export interface SearchInput {
  query: string;
  lat: number;
  lng: number;
}

export class SearchService {
  constructor(
    private readonly placeRepository: PlacesRepo,
    private readonly placesProvider: PlacesProvider
  ) {}

  async execute(input: SearchInput): Promise<Place[]> {
    const coordinates: Coordinates = {
      lat: input.lat,
      lng: input.lng,
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
