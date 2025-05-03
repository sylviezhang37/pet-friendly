import { GoogleMapsPlacesProvider } from "../src/infrastructure/providers/GoogleMapsPlacesProvider";
import dotenv from "dotenv";

dotenv.config();

describe("GoogleMapsPlacesProvider", () => {
  it("should fetch place details successfully", async () => {
    const provider = new GoogleMapsPlacesProvider(
      process.env.GOOGLE_MAPS_API_KEY || ""
    );

    const placeId = "ChIJP1sRv09awokRDPi8okFBDOM";

    try {
      const place = await provider.getPlaceDetails(placeId);
      expect(place).toBeDefined();
      // TODO: add assertions
    } catch (error) {
      fail("Test failed with error: " + error);
    }
  });
});
