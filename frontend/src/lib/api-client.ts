import { Place, User, Review } from "./models";
import { BackendPlace, BackendReview, BackendUser } from "./backend-models";

const API_URL = process.env.API_URL || "http://localhost:3000/api";

if (!API_URL) {
  throw new Error("API_URL environment variable is not defined.");
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
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
  // TODO: get places within coordinates
  // TODO: get place by id
  // TODO: create new place
  // TODO: search place with query with coordinates
  // TODO: update petfriendly status of a place
  // TODO: create new review
  // TODO: get reviews by place id
  // TODO: create new user with optional username
  // TODO: get user by id
};
