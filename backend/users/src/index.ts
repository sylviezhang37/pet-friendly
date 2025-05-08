import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";
import dotenv from "dotenv";

import { PostgresUsersRepo } from "./interfaces/repo";
import { UsersService } from "./business/service";
import { Handler } from "./interfaces/handler";

dotenv.config();

const dbConnection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

const usersRepo = new PostgresUsersRepo(dbConnection);
const usersService = new UsersService(usersRepo);
const handler = new Handler(usersService);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.post("/api/v0/users", handler.createUser);
app.get("/api/v0/users/:id", handler.getUser);

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
