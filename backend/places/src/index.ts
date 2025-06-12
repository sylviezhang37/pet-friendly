import express from "express";
import cors from "cors";
import helmet from "helmet";
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

const pool = new Pool({
  user: process.env.DB_USER ?? process.env.TEST_DB_USER,
  host: process.env.DB_HOST ?? process.env.TEST_DB_HOST,
  database: process.env.DB_NAME ?? process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD ?? process.env.TEST_DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? process.env.TEST_DB_PORT ?? "5432"),
});

const placesRepo = new PostgresPlacesRepo(pool);
const placesProvider = new GoogleMapsPlacesProvider(
  process.env.GOOGLE_MAPS_API_KEY || ""
);

const placeService = new PlaceService(placesRepo);
const searchService = new SearchService(placesRepo, placesProvider);

// api handler
const handler = new Handler(placeService, searchService);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.post("/places", handler.addPlace);

app.get("/places/nearby", handler.getNearbyPlaces);

app.get("/places/search", handler.searchPlaces);

app.get("/places/:id", handler.getPlace);

app.patch("/places/:id", handler.updatePlace);
// or use custom method, see [https://google.aip.dev/136]
// app.patch("/api/v0/places/:id:confirm", handler.updatePetFriendlyStatus);

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
