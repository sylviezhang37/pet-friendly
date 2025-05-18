import { Review } from "@/models/models";
import { useState, useEffect } from "react";
// import { reviewsService } from "@/services/reviews-service";

const sampleReviews: Review[] = [
  {
    id: "1",
    placeId: "12345",
    userId: "12345",
    username: "hungry_beaver",
    petFriendly: true,
    comment:
      "Such a lovely spot! There's an outdoor area where your dog can hang out at.",
    createdAt: "2025-05-10",
  },
  {
    id: "2",
    placeId: "12345",
    userId: "12346",
    username: "short_giraffe",
    petFriendly: true,
    comment: "",
    createdAt: "2025-05-10",
  },
  {
    id: "3",
    placeId: "12345",
    userId: "12347",
    username: "fluffy_otter",
    petFriendly: true,
    comment: "Nice place to work at during the day with my pup.",
    createdAt: "2025-05-10",
  },
  {
    id: "4",
    placeId: "12345",
    userId: "12348",
    username: "fantastic_wombat",
    petFriendly: true,
    comment: "",
    createdAt: "2025-05-10",
  },
  {
    id: "5",
    placeId: "12345",
    userId: "12349",
    username: "extroverted_parrot",
    petFriendly: true,
    comment: "",
    createdAt: "2025-05-10",
  },
];

export function usePlaceReviews(placeId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        // const reviews = await reviewsService.getReviewsByPlaceId(placeId);
        // TODO: remove this after backend implemented
        setReviews(sampleReviews);
        // setReviews(reviews);
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
