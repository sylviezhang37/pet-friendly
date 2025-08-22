import { apiClient } from "@/api/client";
import { Place } from "@/models/frontend";
import { BackendPlace, Coordinates } from "@/models/backend";

type PlacesResponse = {
  places: BackendPlace[];
  total: number;
  petFriendlyCount: number;
};

type PlaceResponse = {
  place: BackendPlace;
};

type NearbyPlacesParams = {
  lat: number;
  lng: number;
  radius?: number;
  onlyPetFriendly?: boolean;
};

type UpdatePlaceRequest = {
  address?: string;
  last_contribution_type: string;
  num_confirm: number;
  num_deny: number;
};

const mapToPlace = (data: BackendPlace): Place => ({
  id: data.id,
  name: data.name,
  address: data.address,
  coordinates: {
    lat: data.coordinates.lat,
    lng: data.coordinates.lng,
  },
  type: data.businessType,
  allowsPet: data.allowsPet,
  googleMapsUrl: data.googleMapsUrl,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
  numConfirm: data.numConfirm,
  numDeny: data.numDeny,
  lastContributionType: data.lastContributionType,
  petFriendly: data.petFriendly,
});

export const placesService = {
  getNearbyPlaces: async (params: NearbyPlacesParams): Promise<Place[]> => {
    const data = await apiClient.get<PlacesResponse>("/api/v0/places/nearby", {
      params,
    });

    const { places, total, petFriendlyCount } = data;
    console.log(`Getting ${total} places (${petFriendlyCount} pet friendly)`);

    return places.map((place: BackendPlace) => mapToPlace(place));
  },

  getPlaceById: async (id: string): Promise<Place> => {
    const { place } = await apiClient.get<PlaceResponse>(
      `/api/v0/places/${id}`
    );
    return mapToPlace(place);
  },

  createOrGetPlace: async (id: string): Promise<Place> => {
    const { place: createdPlace } = await apiClient.post<PlaceResponse>(
      "/api/v0/places",
      { id }
    );
    return mapToPlace(createdPlace);
  },

  searchAndCreatePlace: async (
    query: string,
    coordinates: Coordinates
  ): Promise<Place[]> => {
    const data = await apiClient.get<PlacesResponse>(
      `/api/v0/places/search?query=${query}&lat=${coordinates.lat}&lng=${coordinates.lng}`
    );
    const { places } = data;

    return places.map((place: BackendPlace) => mapToPlace(place));
  },

  updatePetFriendlyStatus: async (
    placeId: string,
    isPetFriendly: boolean,
    numConfirm: number,
    numDeny: number
  ): Promise<Place> => {
    const req: UpdatePlaceRequest = {
      last_contribution_type: isPetFriendly ? "confirm" : "deny",
      num_confirm: numConfirm,
      num_deny: numDeny,
    };

    const { place } = await apiClient.patch<PlaceResponse>(
      `/api/v0/places/${placeId}`,
      req
    );
    return mapToPlace(place);
  },
};

export default placesService;
