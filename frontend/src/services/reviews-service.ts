import { apiClient } from "@/lib/api-client";
import { Review } from "@/lib/models";
import { BackendReview } from "@/lib/backend-models";

const mapToReview = (data: BackendReview): Review => ({
  id: data.id,
  placeId: data.placeId,
  userId: data.userId,
  username: data.username,
  petFriendly: data.petFriendly,
  comment: data.comment,
  createdAt: data.createdAt,
});

export const reviewsService = {
  createReview: async (review: Review): Promise<Review> => {
    const createdReview = await apiClient.post<BackendReview>(
      "/api/v0/reviews",
      review
    );
    return mapToReview(createdReview);
  },

  getReviewsByPlaceId: async (placeId: string): Promise<Review[]> => {
    const reviews = await apiClient.get<BackendReview[]>(
      `/api/v0/reviews/${placeId}`
    );
    return reviews.map(mapToReview);
  },
};

export default reviewsService;
