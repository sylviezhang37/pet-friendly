import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

// infrastructure
import { PostgresPlacesRepo } from "./repositories/PostgresPlacesRepo";
import { GoogleMapsPlacesProvider } from "./providers/GoogleMapsPlacesProvider";

// applications
import { PlaceService } from "./application/PlaceService";
import { SearchService } from "./application/SearchService";

// api interfaces
import { Handler } from "./handler";

dotenv.config();

export default function createPlacesRouter(pool: Pool) {
  const placesRepo = new PostgresPlacesRepo(pool);
  const placesProvider = new GoogleMapsPlacesProvider(
    process.env.GOOGLE_MAPS_API_KEY || ""
  );

  const placeService = new PlaceService(placesRepo);
  const searchService = new SearchService(placesRepo, placesProvider);

  // api handler
  const handler = new Handler(placeService, searchService);

  const router = express.Router();

  // routes
  router.post("/places", handler.addPlace);
  router.get("/places/nearby", handler.getNearbyPlaces);
  router.get("/places/search", handler.searchPlaces);
  router.get("/places/:id", handler.getPlace);
  router.patch("/places/:id", handler.updatePlace);
  // or use custom method, see [https://google.aip.dev/136]
  // router.patch("/places/:id:confirm", handler.updatePetFriendlyStatus);

  return router;
}
