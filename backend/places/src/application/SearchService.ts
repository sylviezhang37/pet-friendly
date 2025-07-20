import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";
import { PlacesProvider } from "../providers/PlacesProvider";
import { Coordinates } from "../domain/models";

export interface SearchInput {
  query: string;
  lat: number;
  lng: number;
}

export interface PlacesOutput {
  places: Place[];
}

export class SearchService {
  constructor(
    private readonly placeRepository: PlacesRepo,
    private readonly placesProvider: PlacesProvider
  ) {}

  async execute(input: SearchInput): Promise<PlacesOutput> {
    const coordinates: Coordinates = {
      lat: input.lat,
      lng: input.lng,
    };

    // first search in our database
    let foundPlaces: Place[] = await this.placeRepository.search(
      input.query,
      coordinates
    );

    // only save a google-returned place if user selects it (in client)
    if (foundPlaces.length <= 2) {
      const googlePlaces: Place[] = await this.placesProvider.searchPlaces(
        input.query,
        coordinates
      );

      const foundPlaceIds = new Set(foundPlaces.map((place) => place.id));
      const newGooglePlaces = googlePlaces.filter(
        (place) => !foundPlaceIds.has(place.id)
      );
      foundPlaces.push(...newGooglePlaces);
    }

    return { places: foundPlaces };
  }
}
