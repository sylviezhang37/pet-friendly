import { Place, User, Review } from "./domain";

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

function mapToPlace(response: any): Place {
  return {
    id: response.id,
    name: response.name,
    address: response.address,
    lat: response.lat,
    lng: response.lng,
    type: response.type,
    allowsPet: response.allowsPet,
    googleMapsUrl: response.googleMapsUrl,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    numConfirm: response.numConfirm,
    numDeny: response.numDeny,
    lastContributionType: response.lastContributionType,
    petFriendly: response.petFriendly,
  };
}

function mapToReview(response: any): Review {
  return {
    id: response.id,
    placeId: response.placeId,
    userId: response.userId,
    username: response.username,
    petFriendly: response.petFriendly,
    comment: response.comment,
    createdAt: response.createdAt,
  };
}

function mapToUser(response: any): User {
  return {
    id: response.id,
    username: response.username,
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
