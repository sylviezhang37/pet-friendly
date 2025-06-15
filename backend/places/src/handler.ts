import { Request, Response } from "express";
import { SearchService } from "./application/SearchService";
import { PlaceService } from "./application/PlaceService";

export class Handler {
  constructor(
    private readonly placeService: PlaceService,
    private readonly searchService: SearchService
  ) {}

  // find nearby places in petfriendly database
  public getNearbyPlaces = async (req: Request, res: Response) => {
    try {
      const { lat, lng, radius = 1000 } = req.query;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required" });
      }

      const places = await this.placeService.getNearbyPlaces({
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        radius: parseInt(radius as string),
      });

      res.json(places);
      console.log("places: ", places);
    } catch (error) {
      console.error("Error finding nearby places:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getPlace = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Place ID is required" });
      }

      const result = await this.placeService.getPlace(id);

      if (!result.place) {
        return res.status(404).json({ error: "Place not found" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error getting place details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // search places in database and google maps
  public searchPlaces = async (req: Request, res: Response) => {
    try {
      const { query, lat, lng } = req.query;
      console.log("search query: ", query, lat, lng);

      if (!query || !lat || !lng) {
        return res.status(400).json({
          error: "Search query, latitude, and longitude are required",
        });
      }

      const result = await this.searchService.execute({
        query: query as string,
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
      });

      res.json(result);
    } catch (error) {
      console.error("Error searching places:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public addPlace = async (req: Request, res: Response) => {
    try {
      const {
        name,
        address,
        lat,
        lng,
        businessType,
        googleMapsUrl,
        allowsPet,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Name is required",
        });
      }

      if (!address) {
        return res.status(400).json({
          error: "Address is required",
        });
      }

      if (!lat) {
        return res.status(400).json({
          error: "Latitude is required",
        });
      }

      if (!lng) {
        return res.status(400).json({
          error: "Longitude is required",
        });
      }

      const place = await this.placeService.createPlace({
        name,
        address,
        lat,
        lng,
        businessType,
        googleMapsUrl,
        allowsPet,
      });

      res.status(201).json(place);
    } catch (error) {
      console.error("Error adding place:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updatePlace = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { address, last_contribution_type, num_confirm, num_deny } =
        req.body;

      // TODO: clean up validation logic
      if (
        last_contribution_type != "confirm" &&
        last_contribution_type != "deny"
      ) {
        return res.status(400).json({
          error: "Last contribution type must be 'confirm' or 'deny'",
        });
      }

      if (num_confirm < 0 || num_deny < 0) {
        return res.status(400).json({
          error: "Num confirm or num deny must be >= 0",
        });
      }

      const place = await this.placeService.updatePlace({
        id: id,
        address,
        num_confirm,
        num_deny,
        last_contribution_type,
        pet_friendly: last_contribution_type === "confirm",
      });

      if (!place) {
        return res.status(404).json({ error: "Place not found" });
      }

      res.json(place);
      console.log("updated place response: ", place);
    } catch (error) {
      console.error("Error updating pet-friendly status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
