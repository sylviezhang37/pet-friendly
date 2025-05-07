import { Review } from "./domain";
import { PostgresReviewsRepo } from "./repo";
import { v4 as uuidv4 } from "uuid";

export interface CreateReviewInput {
  placeId: string;
  userId: string;
  petFriendly: boolean;
  comment?: string | null;
}

export interface GetReviewsByPlaceIdOutput {
  reviews: Review[];
}

export class ReviewsService {
  constructor(private readonly reviewsRepo: PostgresReviewsRepo) {}

  async createReview(input: CreateReviewInput): Promise<Review> {
    // generate id and createdAt at server side
    const review = new Review({
      id: uuidv4(),
      placeId: input.placeId,
      userId: input.userId,
      petFriendly: input.petFriendly,
      comment: input.comment,
      createdAt: new Date(),
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
