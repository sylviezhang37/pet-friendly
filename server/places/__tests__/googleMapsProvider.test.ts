// import { GoogleMapsPlacesProvider } from "../src/providers/GoogleMapsPlacesProvider";
// import assert from "assert";
// import dotenv from "dotenv";

// dotenv.config();

// describe("GoogleMapsPlacesProvider", () => {
//   it("should fetch place details successfully", async () => {
//     const provider = new GoogleMapsPlacesProvider(
//       process.env.GOOGLE_MAPS_API_KEY || ""
//     );

//     const placeId = "ChIJP1sRv09awokRDPi8okFBDOM";

//     try {
//       const place = await provider.getPlaceDetails(placeId);
//       expect(place).toBeDefined();
//       assert(place.name === "Lemongrass Brooklyn");
//     } catch (error) {
//       throw new Error("Test failed with error: " + error);
//     }
//   });
// });

// describe("GoogleMapsPlacesProvider", () => {
//   it("should fetch resturant Chalong NYC successfully", async () => {
//     const provider = new GoogleMapsPlacesProvider(
//       process.env.GOOGLE_MAPS_API_KEY || ""
//     );

//     const query = "cha long";
//     const coordinates = {
//       lat: 40.7637225,
//       lng: -73.9913011,
//     };

//     try {
//       const place = await provider.searchPlaces(query, coordinates);
//       expect(place).toBeDefined();
//       assert(place[0].name === "Chalong NYC");
//     } catch (error) {
//       throw new Error("Test failed with error: " + error);
//     }
//   });
// });
