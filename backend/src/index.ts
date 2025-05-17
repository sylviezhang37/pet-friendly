import express from "express";
import cors from "cors";
import { db } from "./db/mockDb";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize the mock database
db.initialize().catch(console.error);

// Get all places
app.get("/api/places", async (req, res) => {
  try {
    const places = await db.getPlaces();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// Get a specific place by ID
app.get("/api/places/:id", async (req, res) => {
  try {
    const place = await db.getPlaceById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place" });
  }
});

// Get nearby places
app.get("/api/places/nearby", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const places = await db.getNearbyPlaces(
      Number(lat),
      Number(lng),
      radius ? Number(radius) : undefined
    );
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
