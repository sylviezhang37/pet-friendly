import { Coordinates } from "../domain/models";
import { Place } from "../domain/Place";
import { PlacesProvider } from "../providers/PlacesProvider";
import { PlacesRepo } from "../repositories/PlacesRepo";

export interface CreatePlaceInput {
  id?: string;
  // name: string;
  // address: string;
  // coordinates: Coordinates;
  // businessType?: string;
  // googleMapsUrl?: string;
  // allowsPet?: boolean | null;
}

export interface UpdatePlaceInput {
  id: string;
  address: string;
  num_confirm: number;
  num_deny: number;
  last_contribution_type: string;
  pet_friendly: boolean;
}

export interface PlaceOutput {
  place: Place | null;
}

// TODO: support filters + pagination
export interface NearbyPlacesInput {
  lat: number;
  lng: number;
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

export class PlaceService {
  constructor(
    private readonly placeRepository: PlacesRepo,
    private readonly placeProvider: PlacesProvider
  ) {}

  async getPlace(id: string): Promise<PlaceOutput> {
    const place = await this.placeRepository.findById(id);

    return { place };
  }

  async createOrGetPlace(input: CreatePlaceInput): Promise<PlaceOutput> {
    if (!input.id) {
      throw Error("Place id is required for createOrGetPlace");
    }

    if (input.id) {
      const place = await this.placeRepository.findById(input.id);
      if (place) return { place };
    }

    const newPlace = await this.placeProvider.getPlaceDetails(input.id);
    const place = await this.placeRepository.save(newPlace);
    return { place };
  }

  async updatePlace(input: UpdatePlaceInput): Promise<PlaceOutput> {
    const place = await this.placeRepository.updatePlace(
      input.id,
      input.address,
      input.num_confirm,
      input.num_deny,
      input.last_contribution_type,
      input.pet_friendly
    );
    return { place };
  }

  async getNearbyPlaces(input: NearbyPlacesInput): Promise<NearbyPlacesOutput> {
    const coordinates: Coordinates = {
      lat: input.lat,
      lng: input.lng,
    };

    const places = await this.placeRepository.findNearby(
      coordinates,
      input.radius
    );

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
      petFriendlyCount: filteredPlaces.length,
    };
  }
}
