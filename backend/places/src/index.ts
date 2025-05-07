import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";

// infrastructure
import { PostgresPlacesRepo } from "./repositories/PostgresPlacesRepo";
import { GoogleMapsPlacesProvider } from "./providers/GoogleMapsPlacesProvider";

// applications
import { FindNearbyPlaces } from "./application/FindNearbyPlaces";
import { GetPlaceDetails } from "./application/GetPlaceDetails";
import { AddPlace } from "./application/AddPlace";
import { SearchPlaces } from "./application/SearchPlaces";
import { UpdatePetFriendly } from "./application/UpdatePetFriendly";

// api interfaces
import { Handler } from "./handler";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

const placesRepo = new PostgresPlacesRepo(pool);
const placesProvider = new GoogleMapsPlacesProvider(
  process.env.GOOGLE_MAPS_API_KEY || ""
);

const findNearbyPlaces = new FindNearbyPlaces(placesRepo);
const getPlaceDetails = new GetPlaceDetails(placesRepo);
const addPlace = new AddPlace(placesRepo);
const searchPlaces = new SearchPlaces(placesRepo, placesProvider);
const updatePetFriendly = new UpdatePetFriendly(placesRepo);

// api handler
const handler = new Handler(
  findNearbyPlaces,
  getPlaceDetails,
  addPlace,
  searchPlaces,
  updatePetFriendly
);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.post("/api/places", handler.addPlace);

app.get("/api/places/nearby", handler.findNearbyPlaces);

app.get("/api/places/search", handler.searchPlaces);

app.patch("/api/places/:id/pet-friendly", handler.updatePetFriendlyStatus);

app.get("/api/places/:id", handler.getPlaceDetails);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);

export default app;
