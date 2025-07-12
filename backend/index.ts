import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";
import dotenv from "dotenv";

import createPlacesRouter from "./places/src";
import createReviewsRouter from "./reviews/src";
import createUsersRouter from "./users/src";

dotenv.config();

// Shared database pool
const pool = new Pool({
  user: process.env.DB_USER ?? process.env.TEST_DB_USER,
  host: process.env.DB_HOST ?? process.env.TEST_DB_HOST,
  database: process.env.DB_NAME ?? process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD ?? process.env.TEST_DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? process.env.TEST_DB_PORT ?? "5432"),
});

const app = express();

// Shared middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount routers with shared pool
app.use("/api/v0", createPlacesRouter(pool));
app.use("/api/v0", createReviewsRouter(pool));
app.use("/api/v0", createUsersRouter(pool));

// Centralized error handling
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

export { app };

if (require.main === module) {
  const port = parseInt(process.env.PORT || "3000", 10);
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}
