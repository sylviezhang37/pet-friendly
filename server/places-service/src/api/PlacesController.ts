import { Request, Response } from "express";
import { FindNearbyPlacesUseCase } from "../application/FindNearbyPlacesUseCase";
import { GetPlaceDetailsUseCase } from "../application/GetPlaceDetailsUseCase";
import { AddPlaceUseCase } from "../application/AddPlaceUseCase";
import { SearchPlacesUseCase } from "../application/SearchPlacesUseCase";
import { UpdatePetFriendlyUseCase } from "../application/UpdatePetFriendlyUseCase";

export class PlacesController {
  constructor(
    private readonly findNearbyPlacesUseCase: FindNearbyPlacesUseCase,
    private readonly getPlaceDetailsUseCase: GetPlaceDetailsUseCase,
    private readonly addPlaceUseCase: AddPlaceUseCase,
    private readonly searchPlacesUseCase: SearchPlacesUseCase,
    private readonly updatePetFriendlyUseCase: UpdatePetFriendlyUseCase
  ) {}

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
        id: parseInt(id),
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

  public addPlace = async (req: Request, res: Response) => {
    try {
      const {
        id,
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
        id,
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
