import { useState, useEffect } from "react";
import { Review, Place } from "@/models/frontend";

interface User {
  id: string;
  username: string;
}

interface UseReviewSubmissionProps {
  place: Place;
  currentUser: User;
  reviews: Review[];
  onReviewSubmit: (review: Review, isPetFriendly: boolean) => void;
}

interface UseReviewSubmissionReturn {
  selected: "confirm" | "deny" | null;
  comment: string;
  submitted: boolean;
  userReview: Review | null;
  handleSelect: (type: "confirm" | "deny") => void;
  handleCancelReview: () => void;
  handlePostReview: () => void;
  setComment: (comment: string) => void;
}

/**
 * Custom hook that manages review submission state and logic.
 * Handles user selection, comment input, and review submission flow.
 */
export function useReviewSubmission({
  place,
  currentUser,
  reviews,
  onReviewSubmit,
}: UseReviewSubmissionProps): UseReviewSubmissionReturn {
  const [selected, setSelected] = useState<"confirm" | "deny" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  // Reset state when place changes
  useEffect(() => {
    setSelected(null);
    setComment("");
    setSubmitted(false);
  }, [place.id]);

  // Find user's existing review
  useEffect(() => {
    const found = reviews.find((r) => r.userId === currentUser.id);
    setUserReview(found || null);
  }, [reviews, currentUser.id]);

  function handleSelect(type: "confirm" | "deny") {
    if (selected === type) {
      setSelected(null);
      return;
    }
    setSelected(type);
  }

  function handleCancelReview() {
    setSelected(null);
    setComment("");
    setSubmitted(false);
  }

  function handlePostReview() {
    if (!selected) return;

    const newReview: Review = {
      id: (reviews.length + 1).toString(),
      placeId: place.id,
      userId: currentUser.id,
      username: currentUser.username,
      petFriendly: selected === "confirm",
      createdAt: new Date(),
      comment: comment,
    };

    onReviewSubmit(newReview, selected === "confirm");
    setSubmitted(true);
    setComment("");
    setSelected(null);
  }

  return {
    selected,
    comment,
    submitted,
    userReview,
    handleSelect,
    handleCancelReview,
    handlePostReview,
    setComment,
  };
}
