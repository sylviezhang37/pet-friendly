import request from "supertest";
import app from "../src/index";
import dotenv from "dotenv";

dotenv.config();

// mock Postgres repository class
jest.mock("../src/repo", () => {
  return {
    PostgresReviewsRepo: jest.fn().mockImplementation(() => ({
      getByPlaceId: jest.fn().mockResolvedValue([
        {
          id: "1234567890",
          placeId: "ChIJP1sRv09awokRDPi8okFBDOM",
          userId: "user123",
          petFriendly: true,
          comment: "This is a test comment",
          createdAt: new Date(),
        },
      ]),
      create: jest.fn().mockResolvedValue({
        id: "1234567890",
        placeId: "ChIJhwCMNh5ZwokROomRErlMEpk",
        userId: "user123",
        petFriendly: true,
        comment: "This is a test comment",
        createdAt: new Date(),
      }),
    })),
  };
});

describe("GET /api/reviews/:placeId", () => {
  it("it should return reviews for a place (mocked)", async () => {
    const res = await request(app).get(
      "/api/places/ChIJP1sRv09awokRDPi8okFBDOM"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "1234567890",
        placeId: "ChIJP1sRv09awokRDPi8okFBDOM",
        userId: "user123",
        petFriendly: true,
        comment: "This is a test comment",
        createdAt: new Date(),
      },
    ]);
  });
});

describe("POST /api/reviews", () => {
  it("it should return a new review", async () => {
    const res = await request(app).post("/api/reviews");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "1234567890",
        placeId: "ChIJhwCMNh5ZwokROomRErlMEpk",
        userId: "user123",
        petFriendly: true,
        comment: "This is a test comment",
        createdAt: new Date(),
      },
    ]);
  });
});
