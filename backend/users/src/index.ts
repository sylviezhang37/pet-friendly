import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";
import dotenv from "dotenv";

import { PostgresUsersRepo } from "./interfaces/repo";
import { UsersService } from "./business/service";
import { Handler } from "./interfaces/handler";
import { GoogleAuthService } from "./business/google-auth";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER ?? process.env.TEST_DB_USER,
  host: process.env.DB_HOST ?? process.env.TEST_DB_HOST,
  database: process.env.DB_NAME ?? process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD ?? process.env.TEST_DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? process.env.TEST_DB_PORT ?? "5432"),
});

const googleAuthService = new GoogleAuthService();
const usersRepo = new PostgresUsersRepo(pool);
const usersService = new UsersService(usersRepo, googleAuthService);
const handler = new Handler(usersService);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.post("/auth/google", handler.signInWithGoogle);
app.post("/auth/google/complete", handler.completeGoogleSignIn);
app.get("/user/:username/available", handler.isUsernameAvailable);

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
