import request from "supertest";
import app from "../src/index";
import dotenv from "dotenv";

dotenv.config();

// mock Google Maps provider class
jest.mock("../src/providers/GoogleMapsPlacesProvider", () => {
  return {
    GoogleMapsPlacesProvider: jest.fn().mockImplementation(() => ({
      getPlaceDetails: jest.fn().mockResolvedValue({
        name: "Lemongrass1",
        id: "ChIJP1sRv09awokRDPi8okFBDOM",
      }),
      searchPlaces: jest.fn().mockResolvedValue([
        {
          name: "Chalong NYC",
          id: "ChIJhwCMNh5ZwokROomRErlMEpk",
        },
      ]),
    })),
  };
});

// mock Postgres repository class
jest.mock("../src/repositories/PostgresPlacesRepo", () => {
  return {
    PostgresPlacesRepo: jest.fn().mockImplementation(() => ({
      findById: jest.fn().mockResolvedValue({
        id: "ChIJP1sRv09awokRDPi8okFBDOM",
        name: "Lemongrass2",
      }),
      search: jest.fn().mockResolvedValue([]),
      save: jest.fn().mockResolvedValue({
        id: "ChIJhwCMNh5ZwokROomRErlMEpk",
        name: "Chalong NYC",
      }),
    })),
  };
});

describe("GET /api/v0/places/:id", () => {
  it("it should return place details (mocked)", async () => {
    const res = await request(app).get(
      "/api/v0/places/ChIJP1sRv09awokRDPi8okFBDOM"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: "Lemongrass2",
      id: "ChIJP1sRv09awokRDPi8okFBDOM",
    });
  });
});

describe("GET /api/v0/places/search", () => {
  it("it should return search a place by query", async () => {
    const res = await request(app).get(
      "/api/v0/places/search?query=chalong&lat=40.7637225&lng=-73.9913011"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        name: "Chalong NYC",
        id: "ChIJhwCMNh5ZwokROomRErlMEpk",
      },
    ]);
  });
});
