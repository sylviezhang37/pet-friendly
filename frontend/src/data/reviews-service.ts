import { apiClient } from "@/data/api-client";
import { Review } from "@/models/models";
import { BackendReview } from "@/models/backend-models";

type ReviewsResponse = {
  reviews: BackendReview[];
};

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
    console.log("reviewsService getting reviews for placeId: ", placeId);
    const data = await apiClient.get<ReviewsResponse>(
      `/api/v0/reviews/${placeId}`
    );
    const { reviews } = data;
    return reviews.map((review: BackendReview) => mapToReview(review));
  },
};

export default reviewsService;
