import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";
import { Coordinates } from "../domain/models";

export interface NearbyPlacesInput {
  latitude: number;
  longitude: number;
  radius: number;
  filters?: {
    businessType?: string;
  };
  onlyPetFriendly?: boolean;
}

export interface NearbyPlacesOutput {
  places: Place[];
  total: number;
  petFriendlyCount: number;
}

export class FindNearbyPlaces {
  constructor(private readonly placeRepository: PlacesRepo) {}

  async execute(input: NearbyPlacesInput): Promise<NearbyPlacesOutput> {
    const coordinates: Coordinates = {
      lat: input.latitude,
      lng: input.longitude,
    };

    const places = await this.placeRepository.findNearby(
      coordinates,
      input.radius
    );

    const petFriendlyCount = places.filter((place) => place.petFriendly).length;

    let filteredPlaces = places;
    if (input.onlyPetFriendly) {
      filteredPlaces = places.filter((place) => place.petFriendly);
    }

    if (input.filters?.businessType) {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.businessType === input.filters?.businessType
      );
    }

    return {
      places: filteredPlaces,
      total: places.length,
      petFriendlyCount,
    };
  }
}
