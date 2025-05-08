import { v4 as uuidv4 } from "uuid";
import { Review } from "./domain";
import { ReviewsRepo } from "../interfaces/repo";
import { UsersClient } from "@/integrations/users-client";

export interface ReviewInput {
  placeId: string;
  userId: string;
  username?: string | null;
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
  constructor(
    private readonly reviewsRepo: ReviewsRepo,
    private readonly usersClient: UsersClient
  ) {}

  async createReview(input: ReviewInput): Promise<ReviewOutput> {
    if (!input.username) {
      const username = await this.usersClient.getUsername(input.userId);
      input.username = username;
    }

    // generate id and createdAt on the server side
    const review = await this.reviewsRepo.create(
      new Review({
        id: uuidv4(),
        placeId: input.placeId,
        userId: input.userId,
        username: input.username,
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
