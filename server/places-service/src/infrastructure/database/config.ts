import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const getDbConnection = () => pool;

export const closeDbConnection = async () => {
  await pool.end();
};
