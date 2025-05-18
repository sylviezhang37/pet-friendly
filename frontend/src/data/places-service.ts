import { apiClient } from "@/data/api-client";
import { Place } from "@/models/models";
import {
  BackendPlace,
  NearbyPlacesParams,
  SearchPlaceParams,
} from "@/models/backend-models";

const mapToPlace = (data: BackendPlace): Place => ({
  id: data.id,
  name: data.name,
  address: data.address,
  coordinates: {
    lat: data.coordinates.lat,
    lng: data.coordinates.lng,
  },
  type: data.type,
  allowsPet: data.allowsPet,
  googleMapsUrl: data.googleMapsUrl,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  numConfirm: data.numConfirm,
  numDeny: data.numDeny,
  lastContributionType: data.lastContributionType,
  petFriendly: data.petFriendly,
});

export const placesService = {
  getNearbyPlaces: async (params: NearbyPlacesParams): Promise<Place[]> => {
    const data = await apiClient.get<{
      places: BackendPlace[];
      total: number;
      petFriendlyCount: number;
    }>("/api/v0/places/nearby", {
      params,
    });

    const { places, total, petFriendlyCount } = data;
    console.log(`Received ${total} places (${petFriendlyCount} pet friendly)`);

    return places.map((place: BackendPlace) => mapToPlace(place));
  },

  getPlaceById: async (id: string): Promise<Place> => {
    const place = await apiClient.get<BackendPlace>(`/api/v0/places/${id}`);
    return mapToPlace(place);
  },

  createPlace: async (place: Place): Promise<Place> => {
    const createdPlace = await apiClient.post<BackendPlace>(
      "/api/v0/places",
      place
    );
    return mapToPlace(createdPlace);
  },

  searchPlace: async (params: SearchPlaceParams): Promise<Place[]> => {
    const places = await apiClient.get<BackendPlace[]>(
      "/api/v0/places/search",
      params
    );
    return places.map(mapToPlace);
  },

  //   TODO: update req body
  updatePetFriendlyStatus: async (
    placeId: string,
    petFriendly: boolean
  ): Promise<Place> => {
    const updatedPlace = await apiClient.put<BackendPlace>(
      `/api/v0/places/${placeId}`,
      {
        petFriendly,
      }
    );
    return mapToPlace(updatedPlace);
  },
};

export default placesService;
