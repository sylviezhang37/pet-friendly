import { Request, Response } from "express";
import { FindNearbyPlaces } from "./application/FindNearbyPlaces";
import { GetPlaceDetails } from "./application/GetPlaceDetails";
import { AddPlace } from "./application/AddPlace";
import { SearchPlaces } from "./application/SearchPlaces";
import { UpdatePetFriendly } from "./application/UpdatePetFriendly";

export class Handler {
  constructor(
    private readonly findNearbyPlacesUseCase: FindNearbyPlaces,
    private readonly getPlaceDetailsUseCase: GetPlaceDetails,
    private readonly addPlaceUseCase: AddPlace,
    private readonly searchPlacesUseCase: SearchPlaces,
    private readonly updatePetFriendlyUseCase: UpdatePetFriendly
  ) {}

  // find nearby places in petfriendly database
  public findNearbyPlaces = async (req: Request, res: Response) => {
    try {
      const { lat, lng, radius = 1000 } = req.query;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required" });
      }

      const places = await this.findNearbyPlacesUseCase.execute({
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
        radius: parseInt(radius as string),
      });

      res.json(places);
    } catch (error) {
      console.error("Error finding nearby places:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getPlaceDetails = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Place ID is required" });
      }

      const result = await this.getPlaceDetailsUseCase.execute({
        id: id,
      });

      if (!result.place) {
        return res.status(404).json({ error: "Place not found" });
      }

      res.json(result.place);
    } catch (error) {
      console.error("Error getting place details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // search places in database and google maps
  public searchPlaces = async (req: Request, res: Response) => {
    try {
      const { query, lat, lng } = req.query;

      if (!query || !lat || !lng) {
        return res.status(400).json({
          error: "Search query, latitude, and longitude are required",
        });
      }

      const result = await this.searchPlacesUseCase.execute({
        query: query as string,
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
      });

      res.json(result);
    } catch (error) {
      console.error("Error searching places:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // add place to database
  public addPlace = async (req: Request, res: Response) => {
    try {
      const {
        name,
        address,
        latitude,
        longitude,
        businessType,
        googleMapsUrl,
        allowsPet,
      } = req.body;

      if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({
          error: "Name, address, latitude, and longitude are required",
        });
      }

      const place = await this.addPlaceUseCase.execute({
        name,
        address,
        latitude,
        longitude,
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

  // update pet-friendly status and associated fields of a place in database
  public updatePetFriendlyStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { confirmed } = req.body;

      if (typeof confirmed !== "boolean") {
        return res.status(400).json({ error: "Confirmed status is required" });
      }

      const place = await this.updatePetFriendlyUseCase.execute({
        id: id,
        confirmed,
        num_confirm: 0,
        num_deny: 0,
        last_contribution_type: confirmed ? "confirm" : "deny",
        last_contribution_date: new Date(),
      });

      if (!place) {
        return res.status(404).json({ error: "Place not found" });
      }

      res.json(place);
    } catch (error) {
      console.error("Error updating pet-friendly status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
