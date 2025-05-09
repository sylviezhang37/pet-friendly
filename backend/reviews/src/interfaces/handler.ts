import { Request, Response } from "express";
import { ReviewsService } from "../business/service";
import { UserNotFoundError } from "../utils/errors";

export class Handler {
  constructor(private readonly reviewsService: ReviewsService) {}

  public createReview = async (req: Request, res: Response) => {
    const { placeId, userId, username, petFriendly, comment } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!placeId) {
      return res.status(400).json({ error: "Place ID is required" });
    }

    try {
      const review = await this.reviewsService.createReview({
        placeId,
        userId,
        username,
        petFriendly,
        comment,
      });

      res.json(review);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ error: error.message });
      }

      console.error("Error creating review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getReviewsByPlaceId = async (req: Request, res: Response) => {
    try {
      const { placeId } = req.params;

      if (!placeId) {
        return res.status(400).json({ error: "Place ID is required" });
      }

      const result = await this.reviewsService.getReviewsByPlaceId(placeId);
      res.json(result);
    } catch (error) {
      console.error("Error getting reviews by places id:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
