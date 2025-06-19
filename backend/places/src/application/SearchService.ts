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

    // TODO: figure out how to sort by best match
    // first search in our database
    let foundPlaces: Place[] = await this.placeRepository.search(
      input.query,
      coordinates
    );

    if (foundPlaces.length === 0) {
      const googlePlaces = await this.placesProvider.searchPlaces(
        input.query,
        coordinates
      );
      foundPlaces.push(...googlePlaces);

      // save new places to our database
      // for (const place of googlePlaces) {
      //   if (!places.some((p) => p.id === place.id)) {
      //     const savedPlace = await this.placeRepository.save(place);
      //     places.push(savedPlace);
      //   }
      // }
    }

    return { places: foundPlaces };
  }
}
