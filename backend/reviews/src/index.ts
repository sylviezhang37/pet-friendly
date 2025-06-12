import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";
import dotenv from "dotenv";

import { PostgresReviewsRepo } from "./interfaces/repo";
import { Handler } from "./interfaces/handler";
import { ReviewsService } from "./business/service";
import { UsersClient } from "./integrations/usersClient";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER ?? process.env.TEST_DB_USER,
  host: process.env.DB_HOST ?? process.env.TEST_DB_HOST,
  database: process.env.DB_NAME ?? process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD ?? process.env.TEST_DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? process.env.TEST_DB_PORT ?? "5432"),
});

const usersClient = new UsersClient();
const reviewsRepo = new PostgresReviewsRepo(pool);
const reviewsService = new ReviewsService(reviewsRepo, usersClient);
const handler = new Handler(reviewsService);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.post("/reviews", handler.createReview);
app.get("/reviews/:placeId", handler.getReviewsByPlaceId);

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
