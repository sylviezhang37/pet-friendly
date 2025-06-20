import { Pool } from "pg";
import { User } from "../business/domain";
import { UserInput } from "../business/service";

export interface UsersRepo {
  create(userData: UserInput): Promise<User>;
  getById(id: string): Promise<User | null>;
  getByGoogleId(googleId: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
}

export class PostgresUsersRepo implements UsersRepo {
  constructor(private readonly pool: Pool) {}

  async create(userData: UserInput): Promise<User> {
    const query = `
        INSERT INTO users (username, email, google_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const result = await this.pool.query(query, [
      userData.username,
      userData.email,
      userData.googleId,
    ]);

    return this.mapToDomain(result.rows[0]);
  }

  async getById(id: string): Promise<User | null> {
    const query = `SELECT * FROM users where id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows.length ? this.mapToDomain(result.rows[0]) : null;
  }

  async getByGoogleId(googleId: string): Promise<User | null> {
    console.log("getByGoogleId", googleId);
    const query = `SELECT * FROM users where google_id = $1`;
    const result = await this.pool.query(query, [googleId]);
    return result.rows.length ? this.mapToDomain(result.rows[0]) : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM users where username = $1`;
    const result = await this.pool.query(query, [username]);
    return result.rows.length ? this.mapToDomain(result.rows[0]) : null;
  }

  private mapToDomain(data: any): User {
    return new User({
      id: data.id,
      username: data.usename,
      createdAt: data.created_at,
      email: data.email,
      googleId: data.google_id,
    });
  }
}
