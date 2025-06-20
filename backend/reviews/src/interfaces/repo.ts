import { Pool } from "pg";
import { Review } from "../business/domain";

export interface ReviewsRepo {
  create(review: Review): Promise<Review>;
  getByPlaceId(placeId: string): Promise<Review[]>;
}

export class PostgresReviewsRepo implements ReviewsRepo {
  constructor(private readonly dbConnection: Pool) {}

  async create(review: Review): Promise<Review> {
    const query = `
      INSERT INTO reviews (place_id, user_id, username, pet_friendly, comment, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await this.dbConnection.query(query, [
      review.placeId,
      review.userId,
      review.username,
      review.petFriendly,
      review.comment,
      review.createdAt,
    ]);

    return this.mapToDomain(result.rows[0]);
  }

  async getByPlaceId(placeId: string): Promise<Review[]> {
    const query = `
      SELECT * FROM reviews 
      WHERE place_id = $1
      ORDER BY created_at DESC
    `;

    const result = await this.dbConnection.query(query, [placeId]);

    return result.rows.map((row) => this.mapToDomain(row));
  }

  private mapToDomain(data: any): Review {
    return new Review({
      id: data.id,
      placeId: data.place_id,
      userId: data.user_id,
      username: data.username,
      petFriendly: data.pet_friendly,
      comment: data.comment,
      createdAt: data.created_at,
    });
  }
}
