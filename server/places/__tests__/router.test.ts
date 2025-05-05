import request from "supertest";
import app from "../src/index";
import dotenv from "dotenv";

dotenv.config();

// mock Google Maps provider class
// jest.mock("../src/providers/GoogleMapsPlacesProvider", () => {
//   return {
//     GoogleMapsPlacesProvider: jest.fn().mockImplementation(() => ({
//       getPlaceDetails: jest.fn().mockResolvedValue({
//         name: "Lemongrass Brooklyn",
//         id: "ChIJP1sRv09awokRDPi8okFBDOM",
//       }),
//     })),
//   };
// });

// mock Postgres repository class
jest.mock("../src/repositories/PostgresPlaceRepository", () => {
  return {
    PostgresPlaceRepository: jest.fn().mockImplementation(() => ({
      findById: jest.fn().mockResolvedValue({
        id: "ChIJP1sRv09awokRDPi8okFBDOM",
        name: "Lemongrass Brooklyn",
      }),
    })),
  };
});

describe("GET /api/places/:id", () => {
  it("it should return place details (mocked)", async () => {
    const res = await request(app).get(
      "/api/places/ChIJP1sRv09awokRDPi8okFBDOM"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: "Lemongrass Brooklyn",
      id: "ChIJP1sRv09awokRDPi8okFBDOM",
    });
  });
});
