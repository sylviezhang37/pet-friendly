import { Pool } from "pg";
import { Review } from "./domain";

interface ReviewsRepo {
  getByPlaceId(placeId: string): Promise<Review[]>;
  create(review: Review): Promise<Review>;
}

export class PostgresReviewsRepo implements ReviewsRepo {
  constructor(private readonly dbConnection: Pool) {}

  async create(review: Review): Promise<Review> {
    const query = `
      INSERT INTO reviews (place_id, user_id, pet_friendly, comment, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await this.dbConnection.query(query, [
      review.placeId,
      review.userId,
      review.petFriendly,
      review.comment,
      review.createdAt,
    ]);

    return this.mapToEntity(result.rows[0]);
  }

  async getByPlaceId(placeId: string): Promise<Review[]> {
    const query = `
      SELECT * FROM reviews 
      WHERE place_id = $1
    `;

    const result = await this.dbConnection.query(query, [placeId]);

    return result.rows.map((row) => this.mapToEntity(row));
  }

  async mapToEntity(data: any): Promise<Review> {
    return new Review({
      id: data.id,
      placeId: data.place_id,
      userId: data.user_id,
      petFriendly: data.pet_friendly,
      comment: data.comment,
      createdAt: data.created_at,
    });
  }
}
