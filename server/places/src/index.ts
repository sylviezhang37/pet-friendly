import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";

// infrastructure
import { PostgresPlaceRepository } from "./repositories/PostgresPlaceRepository";
import { GoogleMapsPlacesProvider } from "./providers/GoogleMapsPlacesProvider";

// applications
import { FindNearbyPlaces } from "./application/FindNearbyPlaces";
import { GetPlaceDetails } from "./application/GetPlaceDetails";
import { AddPlace } from "./application/AddPlace";
import { SearchPlaces } from "./application/SearchPlaces";
import { UpdatePetFriendly } from "./application/UpdatePetFriendly";

// api interfaces
import { PlacesController } from "./api/PlacesController";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

const placeRepository = new PostgresPlaceRepository(pool);
const placesProvider = new GoogleMapsPlacesProvider(
  process.env.GOOGLE_MAPS_API_KEY || ""
);

const findNearbyPlaces = new FindNearbyPlaces(placeRepository);
const getPlaceDetails = new GetPlaceDetails(placeRepository);
const addPlace = new AddPlace(placeRepository);
const searchPlaces = new SearchPlaces(placeRepository, placesProvider);
const updatePetFriendly = new UpdatePetFriendly(placeRepository);

const placesController = new PlacesController(
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
app.get(
  "/api/places/nearby",
  async (req: express.Request, res: express.Response) => {
    await placesController.findNearbyPlaces(req, res);
  }
);

app.get(
  "/api/places/search",
  async (req: express.Request, res: express.Response) => {
    await placesController.searchPlaces(req, res);
  }
);

app.post(
  "/api/places/add",
  async (req: express.Request, res: express.Response) => {
    await placesController.addPlace(req, res);
  }
);

app.patch(
  "/api/places/:id/pet-friendly",
  async (req: express.Request, res: express.Response) => {
    await placesController.updatePetFriendlyStatus(req, res);
  }
);

app.get(
  "/api/places/:id",
  async (req: express.Request, res: express.Response) => {
    await placesController.getPlaceDetails(req, res);
  }
);

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
