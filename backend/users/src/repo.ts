import { Pool } from "pg";
import { User } from "./domain";

export interface UsersRepo {
  create(user: User): Promise<User>;
  get(id: string): Promise<User | null>;
}

export class PostgresUsersRepo implements UsersRepo {
  constructor(private readonly dbConnection: Pool) {}

  async create(user: User): Promise<User> {
    const query = `
        INSERT INTO users (id, username, created_at, anonymous)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const result = await this.dbConnection.query(query, [
      user.id,
      user.username,
      user.createdAt,
      user.anonymous,
    ]);

    return this.mapToDomain(result.rows[0]);
  }

  async get(id: string): Promise<User | null> {
    const query = `SELECT * FROM users where id = $1`;
    const result = await this.dbConnection.query(query, [id]);
    return result.rows.length ? this.mapToDomain(result.rows[0]) : null;
  }

  private mapToDomain(data: any): User {
    return new User({
      id: data.id,
      username: data.usename,
      createdAt: data.created_at,
      anonymous: data.anonymous,
    });
  }
}
