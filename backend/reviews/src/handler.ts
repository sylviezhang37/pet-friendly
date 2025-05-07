import { Request, Response } from "express";
import { ReviewsService } from "./service";

export class Handler {
  constructor(private readonly reviewsService: ReviewsService) {}

  public createReview = async (req: Request, res: Response) => {
    try {
      const { placeId, userId, petFriendly, comment } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      if (!placeId) {
        return res.status(400).json({ error: "Place ID is required" });
      }

      const review = await this.reviewsService.createReview({
        placeId,
        userId,
        petFriendly,
        comment,
      });

      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getReviewsByPlacesId = async (req: Request, res: Response) => {
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
