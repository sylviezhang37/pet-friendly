import { Review } from "./domain";
import { PostgresReviewsRepo } from "./repo";

export interface CreateReviewInput {
  id: string;
  placeId: string;
  userId: string;
  petFriendly: boolean;
  comment?: string | null;
  createdAt: Date;
}

export interface GetReviewsByPlaceIdOutput {
  reviews: Review[];
}

export class ReviewsService {
  constructor(private readonly reviewsRepo: PostgresReviewsRepo) {}

  async createReview(input: CreateReviewInput): Promise<Review> {
    const review = new Review({
      id: input.id,
      placeId: input.placeId,
      userId: input.userId,
      petFriendly: input.petFriendly,
      comment: input.comment,
      createdAt: input.createdAt,
    });

    return this.reviewsRepo.create(review);
  }

  async getReviewsByPlaceId(
    placeId: string
  ): Promise<GetReviewsByPlaceIdOutput> {
    const reviews = await this.reviewsRepo.getByPlaceId(placeId);

    return {
      reviews: reviews,
    };
  }
}
