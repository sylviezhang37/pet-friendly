import { Review } from "@/models/models";
import { useState, useEffect } from "react";
import { reviewsService } from "@/data/reviews-service";

// const sampleReviews: Review[] = [];

export function usePlaceReviews(placeId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
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

  const addReview = (newReview: Review) => {
    setReviews((prevReviews) =>
      prevReviews ? [newReview, ...prevReviews] : [newReview]
    );
  };

  return {
    reviews,
    isLoading,
    error,
    addReview,
  };
}
