import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

import { PostgresUsersRepo } from "./interfaces/repo";
import { UsersService } from "./business/service";
import { Handler } from "./interfaces/handler";
import { GoogleAuthService } from "./business/google-auth";

dotenv.config();

export default function createUsersRouter(pool: Pool) {
  const googleAuthService = new GoogleAuthService();
  const usersRepo = new PostgresUsersRepo(pool);
  const usersService = new UsersService(usersRepo, googleAuthService);
  const handler = new Handler(usersService);

  const router = express.Router();

  // routes
  router.post("/auth/google", handler.signInWithGoogle);
  router.post("/auth/google/complete", handler.completeGoogleSignIn);
  router.get("/user/:username/available", handler.isUsernameAvailable);

  return router;
}
