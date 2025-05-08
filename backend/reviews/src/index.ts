import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";
import dotenv from "dotenv";

import { PostgresReviewsRepo } from "./interfaces/repo";
import { Handler } from "./interfaces/handler";
import { ReviewsService } from "./business/service";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

const reviewsRepo = new PostgresReviewsRepo(pool);
const reviewsService = new ReviewsService(reviewsRepo);
const handler = new Handler(reviewsService);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.post("/api/v0/reviews", handler.createReview);
app.get("/api/v0/reviews/:placeId", handler.getReviewsByPlaceId);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);

export default app;
