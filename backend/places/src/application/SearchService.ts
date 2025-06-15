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
    console.log("searching in repo");
    let foundPlaces = await this.placeRepository.search(
      input.query,
      coordinates
    );

    console.log("repo search result:", foundPlaces);

    // if not in db, search Google Maps
    if (foundPlaces.length === 0) {
      console.log("searching in maps api");
      const googlePlaces = await this.placesProvider.searchPlaces(
        input.query,
        coordinates
      );

      console.log("found new place: ", googlePlaces);
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
