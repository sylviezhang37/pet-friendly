import { Review } from "@/models/models";
import { useState, useEffect } from "react";
import { reviewsService } from "@/data/reviews-service";

export function usePlaceReviews(placeId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      console.log("usePlaceReviews fetching reviews for placeId: ", placeId);
      try {
        const reviews = await reviewsService.getReviewsByPlaceId(placeId);
        setReviews(reviews);
      } catch (err) {
        console.error("Failed to load reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [placeId]);

  const addReview = async (newReview: Review) => {
    console.log("addReview called with newReview: ", newReview);
    // Optimistically update the UI
    setReviews((prevReviews) =>
      prevReviews ? [newReview, ...prevReviews] : [newReview]
    );

    try {
      await reviewsService.createReview(newReview);
    } catch (err) {
      setReviews((prevReviews) => prevReviews?.slice(1) ?? []);
      console.error("Failed to create review:", err);
      setError("Failed to create review. Please try again.");
      throw err;
    }
  };

  return {
    reviews,
    isLoading,
    error,
    addReview,
  };
}
