import { Review } from "@/models/frontend";
import { useState, useEffect } from "react";
import { reviewsService } from "@/api/reviews-service";

const reviewsCache = new Map<string, Review[]>();

export function usePlaceReviews(placeId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    async function fetchReviews() {
      const cachedReviews = reviewsCache.get(placeId);

      if (cachedReviews) {
        setReviews(cachedReviews);
        setIsLoading(false);
        return;
      }

      try {
        const reviews = await reviewsService.getReviewsByPlaceId(placeId);
        setReviews(reviews);
        reviewsCache.set(placeId, reviews);
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
    const updatedReviews = reviews ? [newReview, ...reviews] : [newReview];

    // optimistically update the UI and cache
    setReviews(updatedReviews);
    reviewsCache.set(placeId, updatedReviews);

    try {
      await reviewsService.createReview(newReview);
    } catch (err) {
      // revert both state and cache on error
      setReviews(reviews);
      reviewsCache.set(placeId, reviews);
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
