import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { Pool } from "pg";
import createPlacesRouter from "./places/src";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? "5432"),
  max: 1,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v0", createPlacesRouter(pool));

export const handler = serverless(app);
