import { Place, User, Review } from "./models";
import {
  BackendPlace,
  BackendReview,
  BackendUser,
  NewUserRequest,
  SearchPlaceParams,
} from "./backend-models";
import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:3000/api";

if (!API_URL) {
  throw new Error("API_URL environment variable is not defined.");
}

function mapToPlace(data: BackendPlace): Place {
  return {
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
  };
}

function mapToReview(data: BackendReview): Review {
  return {
    id: data.id,
    placeId: data.placeId,
    userId: data.userId,
    username: data.username,
    petFriendly: data.petFriendly,
    comment: data.comment,
    createdAt: data.createdAt,
  };
}

function mapToUser(data: BackendUser): User {
  return {
    id: data.id,
    username: data.username,
  };
}

export const apiClient = {
  getNearbyPlaces: async (params: SearchPlaceParams): Promise<Place[]> => {
    const response = await axios.get(
      `${API_URL}/api/v0/places/nearby?lat=${params.lat}&lng=${params.lng}&radius=${params.radius}`
    );
    const places: BackendPlace[] = response.data;
    return places.map(mapToPlace);
  },

  getPlaceById: async (id: string): Promise<Place> => {
    const response = await axios.get(`${API_URL}/api/v0/places/${id}`);
    return mapToPlace(response.data);
  },

  // TODO: check if this matches request body
  createPlace: async (place: Place): Promise<Place> => {
    const response = await axios.post(`${API_URL}/api/v0/places`, place);
    return mapToPlace(response.data);
  },

  searchPlace: async (params: SearchPlaceParams): Promise<Place[]> => {
    const response = await axios.get(
      `${API_URL}/api/v0/places/search?query=${params.query}&lat=${params.lat}&lng=${params.lng}`
    );
    const places: BackendPlace[] = response.data;
    return places.map(mapToPlace);
  },

  // update petfriendly status of a place
  // TODO: check if this matches request body
  updatePetFriendlyStatus: async (
    placeId: string,
    petFriendly: boolean
  ): Promise<Place> => {
    const response = await axios.put(`${API_URL}/api/v0/places/${placeId}`, {
      petFriendly,
    });
    return mapToPlace(response.data);
  },

  // TODO: check if this matches request body
  createReview: async (review: Review): Promise<Review> => {
    const response = await axios.post(`${API_URL}/api/v0/reviews`, review);
    return mapToReview(response.data);
  },

  // get reviews by place id
  getReviewsByPlaceId: async (placeId: string): Promise<Review[]> => {
    const response = await axios.get(`${API_URL}/api/v0/reviews/${placeId}`);
    return response.data.map(mapToReview);
  },

  // create new user with optional username and anonymous status
  createUser: async (reqBody: NewUserRequest): Promise<User> => {
    const response = await axios.post(`${API_URL}/api/v0/users`, reqBody);
    return mapToUser(response.data);
  },

  // get user by id
  getUser: async (id: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/api/v0/users/${id}`);
    return mapToUser(response.data);
  },
};
