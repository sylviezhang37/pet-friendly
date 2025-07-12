import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

import { PostgresReviewsRepo } from "./interfaces/repo";
import { Handler } from "./interfaces/handler";
import { ReviewsService } from "./business/service";
import { UsersClient } from "./integrations/usersClient";

dotenv.config();

export default function createReviewsRouter(pool: Pool) {
  const usersClient = new UsersClient();
  const reviewsRepo = new PostgresReviewsRepo(pool);
  const reviewsService = new ReviewsService(reviewsRepo, usersClient);
  const handler = new Handler(reviewsService);

  const router = express.Router();

  // routes
  router.post("/reviews", handler.createReview);
  router.get("/reviews/:placeId", handler.getReviewsByPlaceId);

  return router;
}
