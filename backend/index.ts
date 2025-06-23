import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";
import dotenv from "dotenv";

import placesApp from "./places/src";
import reviewsApp from "./reviews/src";
import usersApp from "./users/src";

dotenv.config();

const app = express();

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
  const port = parseInt(process.env.PORT || "3000", 10);
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}
