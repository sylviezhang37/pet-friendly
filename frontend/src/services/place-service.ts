import { apiClient } from "@/lib/api-client";
import { Place } from "@/lib/models";
import { BackendPlace, SearchPlaceParams } from "@/lib/backend-models";

const mapToPlace = (data: BackendPlace): Place => ({
  id: data.id,
  name: data.name,
  address: data.address,
  lat: data.lat,
  lng: data.lng,
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

export const placeService = {
  getNearbyPlaces: async (params: SearchPlaceParams): Promise<Place[]> => {
    const places = await apiClient.get<BackendPlace[]>(
      "/api/v0/places/nearby",
      params
    );
    return places.map(mapToPlace);
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

export default placeService;
