import request from "supertest";
import app from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

jest.mock("../src/repo", () => {
  const mockReview = {
    id: "1234567890",
    placeId: "ChIJP1sRv09awokRDPi8okFBDOM",
    userId: "user123",
    petFriendly: true,
    comment: "This is a test comment",
  };

  return {
    PostgresReviewsRepo: jest.fn().mockImplementation(() => ({
      getByPlaceId: jest.fn().mockResolvedValue([mockReview]),
      create: jest.fn().mockResolvedValue(mockReview),
    })),
    __mockReview: mockReview, // expose mock data for tests to use
  };
});

// import the mock data from the mock module
const { __mockReview } = jest.requireMock("../src/repo");

describe("GET /api/reviews/:placeId", () => {
  it("it should return reviews for a place (mocked)", async () => {
    const res = await request(app).get(
      "/api/reviews/ChIJP1sRv09awokRDPi8okFBDOM"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ reviews: [__mockReview] });
  });
});

describe("POST /api/reviews", () => {
  it("it should return a new review", async () => {
    const requestBody = {
      placeId: "ChIJhwCMNh5ZwokROomRErlMEpk",
      userId: "user123",
      petFriendly: true,
    };

    const res = await request(app).post("/api/reviews").send(requestBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(__mockReview);
  });
});
