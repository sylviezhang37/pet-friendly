import express from "express";
import cors from "cors";
import helmet from "helmet";
// import { Pool } from "pg";
import dotenv from "dotenv";

import placesApp from "./places/src";
import reviewsApp from "./reviews/src";
import usersApp from "./users/src";

dotenv.config();

// Create a shared database connection pool
// const pool = new Pool({
//   user: process.env.DB_USER ?? process.env.TEST_DB_USER,
//   host: process.env.DB_HOST ?? process.env.TEST_DB_HOST,
//   database: process.env.DB_NAME ?? process.env.TEST_DB_NAME,
//   password: process.env.DB_PASSWORD ?? process.env.TEST_DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT ?? process.env.TEST_DB_PORT ?? "5432"),
// });

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount each service under its own path which makes it easy to split into microservices
app.use("/api/v0", placesApp);
app.use("/api/v0", reviewsApp);
app.use("/api/v0", usersApp);

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
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
