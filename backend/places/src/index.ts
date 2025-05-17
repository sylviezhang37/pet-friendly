import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";
import dotenv from "dotenv";

// infrastructure
import { PostgresPlacesRepo } from "./repositories/PostgresPlacesRepo";
import { GoogleMapsPlacesProvider } from "./providers/GoogleMapsPlacesProvider";

// applications
import { FindNearbyPlaces } from "./application/FindNearbyPlaces";
import { GetPlace } from "./application/GetPlace";
import { AddPlace } from "./application/AddPlace";
import { SearchPlaces } from "./application/SearchPlaces";
import { UpdatePlace } from "./application/UpdatePlace";

// api interfaces
import { Handler } from "./handler";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "sylvie",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "pf_test_db",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
});

const placesRepo = new PostgresPlacesRepo(pool);
const placesProvider = new GoogleMapsPlacesProvider(
  process.env.GOOGLE_MAPS_API_KEY || ""
);

const getPlace = new GetPlace(placesRepo);
const addPlace = new AddPlace(placesRepo);
const updatePlace = new UpdatePlace(placesRepo);
const findNearbyPlaces = new FindNearbyPlaces(placesRepo);
const searchPlaces = new SearchPlaces(placesRepo, placesProvider);

// api handler
const handler = new Handler(
  getPlace,
  addPlace,
  updatePlace,
  findNearbyPlaces,
  searchPlaces
);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.post("/api/v0/places", handler.addPlace);

app.get("/api/v0/places/nearby", handler.findNearbyPlaces);

app.get("/api/v0/places/search", handler.searchPlaces);

app.get("/api/v0/places/:id", handler.getPlace);

app.patch("/api/v0/places/:id", handler.updatePlace);
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
