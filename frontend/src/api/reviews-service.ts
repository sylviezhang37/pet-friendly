import { apiClient } from "@/api/client";
import { Review } from "@/models/models";
import { BackendReview } from "@/models/backend-models";

type ReviewsResponse = {
  reviews: BackendReview[];
};

type ReviewResponse = {
  review: BackendReview;
};

const mapToReview = (data: BackendReview): Review => ({
  id: data.id,
  placeId: data.placeId,
  userId: data.userId,
  username: data.username,
  petFriendly: data.petFriendly,
  comment: data.comment,
  createdAt: new Date(data.createdAt),
});

export const reviewsService = {
  createReview: async (review: Review): Promise<Review> => {
    const { review: createdReview } = await apiClient.post<ReviewResponse>(
      "/api/v0/reviews",
      review
    );
    return mapToReview(createdReview);
  },

  getReviewsByPlaceId: async (placeId: string): Promise<Review[]> => {
    console.log("reviewsService getting reviews for placeId: ", placeId);
    const { reviews } = await apiClient.get<ReviewsResponse>(
      `/api/v0/reviews/${placeId}`
    );
    return reviews.map((review: BackendReview) => mapToReview(review));
  },
};

export default reviewsService;
