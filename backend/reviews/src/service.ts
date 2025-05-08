import { Review } from "./domain";
import { ReviewsRepo } from "./repo";
import { v4 as uuidv4 } from "uuid";

export interface ReviewInput {
  placeId: string;
  userId: string;
  petFriendly: boolean;
  comment?: string | null;
}

export interface ReviewOutput {
  review: Review;
}

export interface ReviewsByPlaceIdOutput {
  reviews: Review[];
}

export class ReviewsService {
  constructor(private readonly reviewsRepo: ReviewsRepo) {}

  async createReview(input: ReviewInput): Promise<ReviewOutput> {
    // TODO: maybe create a user client to get the username from /users/:id
    // const user = await this.userClient.getUser(input.userId);

    // generate id and createdAt at server side
    const review = await this.reviewsRepo.create(
      new Review({
        id: uuidv4(),
        placeId: input.placeId,
        userId: input.userId,
        petFriendly: input.petFriendly,
        comment: input.comment,
        createdAt: new Date(),
      })
    );

    return {
      review: review,
    };
  }

  async getReviewsByPlaceId(placeId: string): Promise<ReviewsByPlaceIdOutput> {
    const reviews = await this.reviewsRepo.getByPlaceId(placeId);

    return {
      reviews: reviews,
    };
  }
}
