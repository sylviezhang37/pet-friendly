import request from "supertest";
import app from "../src/index";
import * as dotenv from "dotenv";

dotenv.config();

jest.mock("../src/interfaces/repo", () => {
  const mockReview = {
    id: "1234567890",
    placeId: "ChIJP1sRv09awokRDPi8okFBDOM",
    userId: "12345",
    username: "test-username",
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

jest.mock("../src/integrations/usersClient", () => {
  return {
    UsersClient: jest.fn().mockImplementation(() => ({
      getUsername: jest.fn().mockResolvedValue("test-username"),
    })),
  };
});

// import the mock data from the mock module
const { __mockReview } = jest.requireMock("../src/interfaces/repo");

describe("GET /api/v0/reviews/:placeId", () => {
  it("it should return reviews for a place (mocked)", async () => {
    const res = await request(app).get(
      "/api/v0/reviews/ChIJP1sRv09awokRDPi8okFBDOM"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ reviews: [__mockReview] });
  });
});

// test not providing a username
describe("POST /api/v0/reviews", () => {
  it("it should return a new review", async () => {
    const requestBody = {
      placeId: "ChIJhwCMNh5ZwokROomRErlMEpk",
      userId: "12345",
      petFriendly: true,
    };

    const res = await request(app).post("/api/v0/reviews").send(requestBody);
    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ review: __mockReview });
  });
});
