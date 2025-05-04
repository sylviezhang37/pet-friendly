import { GoogleMapsPlacesProvider } from "../../src/providers/GoogleMapsPlacesProvider";
import dotenv from "dotenv";

dotenv.config();

async function testGetPlaceDetails() {
  const provider = new GoogleMapsPlacesProvider(
    process.env.GOOGLE_MAPS_API_KEY || ""
  );

  const query = "cha long"; // Chalong NYC in hell's kitchen
  const coordinates = {
    lat: 40.7637225,
    lng: -73.9913011,
  };

  try {
    const place = await provider.searchPlaces(query, coordinates);
    console.log("Place Details:", place);
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
}

testGetPlaceDetails();
