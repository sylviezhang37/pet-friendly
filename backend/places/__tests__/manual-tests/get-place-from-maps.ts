import { GoogleMapsPlacesProvider } from "../../src/providers/GoogleMapsPlacesProvider";
import dotenv from "dotenv";

dotenv.config();

async function testGetPlaceDetails() {
  const provider = new GoogleMapsPlacesProvider(
    process.env.GOOGLE_MAPS_API_KEY || ""
  );

  const placeId = "ChIJP1sRv09awokRDPi8okFBDOM";

  try {
    const place = await provider.getPlaceDetails(placeId);
    console.log("Place Details:", place);
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
}

testGetPlaceDetails();
