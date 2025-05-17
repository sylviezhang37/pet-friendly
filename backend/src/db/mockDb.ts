import { promises as fs } from "fs";
import path from "path";

export interface Place {
  id: string;
  address: string;
  lat: number;
  lng: number;
  name: string;
  type: string;
  allowsPet: boolean;
  googleMapsUrl: string;
  createdAt: string;
  updatedAt: string;
  numConfirm: number;
  numDeny: number;
  lastContributionType: "confirm" | "deny";
  petFriendly: boolean;
}

class MockDb {
  private places: Place[] = [];

  async initialize() {
    try {
      const filePath = path.join(__dirname, "../../places/places.json");
      const data = await fs.readFile(filePath, "utf-8");
      const { places } = JSON.parse(data);
      this.places = places;
    } catch (error) {
      console.error("Error initializing mock database:", error);
      throw error;
    }
  }

  // Simulate database queries
  async getPlaces(): Promise<Place[]> {
    return this.places;
  }

  async getPlaceById(id: string): Promise<Place | undefined> {
    return this.places.find((place) => place.id === id);
  }

  async getNearbyPlaces(
    lat: number,
    lng: number,
    radiusKm: number = 5
  ): Promise<Place[]> {
    // Simple distance calculation (Haversine formula)
    const getDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => {
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return this.places.filter(
      (place) => getDistance(lat, lng, place.lat, place.lng) <= radiusKm
    );
  }
}

export const db = new MockDb();
