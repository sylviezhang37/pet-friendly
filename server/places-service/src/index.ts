import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Pool } from "pg";

// infrastructure
import { PostgresPlaceRepository } from "./infrastructure/database/PostgresPlaceRepository";
import { GoogleMapsPlacesProvider } from "./infrastructure/providers/GoogleMapsPlacesProvider";

// applications
import { FindNearbyPlacesUseCase } from "./application/FindNearbyPlacesUseCase";
import { GetPlaceDetailsUseCase } from "./application/GetPlaceDetailsUseCase";
import { AddPlaceUseCase } from "./application/AddPlaceUseCase";
import { SearchPlacesUseCase } from "./application/SearchPlacesUseCase";
import { UpdatePetFriendlyUseCase } from "./application/UpdatePetFriendlyUseCase";

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

const findNearbyPlacesUseCase = new FindNearbyPlacesUseCase(placeRepository);
const getPlaceDetailsUseCase = new GetPlaceDetailsUseCase(placeRepository);
const addPlaceUseCase = new AddPlaceUseCase(placeRepository);
const searchPlacesUseCase = new SearchPlacesUseCase(
  placeRepository,
  placesProvider
);
const updatePetFriendlyUseCase = new UpdatePetFriendlyUseCase(placeRepository);

const placesController = new PlacesController(
  findNearbyPlacesUseCase,
  getPlaceDetailsUseCase,
  addPlaceUseCase,
  searchPlacesUseCase,
  updatePetFriendlyUseCase
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
  "/api/places/:id",
  async (req: express.Request, res: express.Response) => {
    await placesController.getPlaceDetails(req, res);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Places service listening on port ${PORT}`);
});
