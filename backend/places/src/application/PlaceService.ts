import { Coordinates } from "../domain/models";
import { Place } from "../domain/Place";
import { PlacesRepo } from "../repositories/PlacesRepo";
import { v4 as uuidv4 } from "uuid";

export interface CreatePlaceInput {
  id?: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  businessType?: string;
  googleMapsUrl?: string;
  allowsPet?: boolean | null;
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
  constructor(private readonly placeRepository: PlacesRepo) {}

  async getPlace(id: string): Promise<PlaceOutput> {
    const place = await this.placeRepository.findById(id);

    return { place };
  }

  async createPlace(input: CreatePlaceInput): Promise<PlaceOutput> {
    const newPlace = new Place({
      id: input.id || uuidv4(),
      name: input.name,
      address: input.address,
      coordinates: input.coordinates,
      businessType: input.businessType,
      googleMapsUrl: input.googleMapsUrl,
      allowsPet: input.allowsPet,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const place = await this.placeRepository.save(newPlace);

    console.log("placeService created place: ", place);

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

    console.log("placeService got coordinates: ", coordinates);

    const places = await this.placeRepository.findNearby(
      coordinates,
      input.radius
    );

    console.log("placeService retrieved places. ");

    const petFriendlyCount = places.filter((place) => place.petFriendly).length;

    let filteredPlaces = places;
    // if (input.onlyPetFriendly) {
    //   filteredPlaces = places.filter((place) => place.petFriendly);
    // }

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
