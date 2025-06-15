import { useState, useEffect } from "react";
import { Place } from "@/models/models";
import { placesService } from "@/api/places-service";

// TODO: cache

/**
 * This hook fetches nearby places from the backend and
 * manages the places data in a Hashmap.
 */
export function useNearbyPlaces(lat: number, lng: number) {
  const [places, setPlaces] = useState<Map<string, Place>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const placesData = await placesService.getNearbyPlaces({
          lat,
          lng,
        });
        const newPlaces = new Map(placesData.map((place) => [place.id, place]));
        setPlaces(newPlaces);
      } catch (err) {
        console.error("Failed to load nearby places:", err);
        setError("Failed to load nearby places");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlace();
  }, [lat, lng]);

  const addPlace = (place: Place) => {
    setPlaces((prev) => {
      prev.set(place.id, place);
      return prev;
    });
  };

  const removePlace = (placeId: string) => {
    setPlaces((prev) => {
      prev.delete(placeId);
      return prev;
    });
  };

  return { places, isLoading, error, addPlace, removePlace };
}
