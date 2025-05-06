import { Place } from "../domain/Place";
import { PlaceRepository } from "../repositories/PlaceRepository";
import { Coordinates } from "../domain/models";

export interface FindNearbyPlacesInput {
  latitude: number;
  longitude: number;
  radius: number;
  filters?: {
    businessType?: string;
  };
  onlyPetFriendly?: boolean;
}

export interface FindNearbyPlacesOutput {
  places: Place[];
  total: number;
  petFriendlyCount: number;
}

export class FindNearbyPlaces {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(input: FindNearbyPlacesInput): Promise<FindNearbyPlacesOutput> {
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
