import { useState, useEffect, useCallback } from "react";
import { Place } from "@/models/frontend";
import { placesService } from "@/api/places-service";
import { Coordinates } from "@/models/backend";

interface UseNearbyPlacesReturn {
  places: Map<string, Place>;
  isLoading: boolean;
  error: string | null;
  addPlace: (place: Place) => void;
  removePlace: (placeId: string) => void;
}

const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to load nearby places",
} as const;

/**
 * Fetches and manages nearby places data based on coordinates.
 * Uses a Map for efficient place lookup and management.
 */
export function useNearbyPlaces(
  lat: number,
  lng: number
): UseNearbyPlacesReturn {
  const [places, setPlaces] = useState<Map<string, Place>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyPlaces = useCallback(
    async (coordinates: Coordinates): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const placesData = await placesService.getNearbyPlaces(coordinates);
        const placesMap = createPlacesMap(placesData);

        setPlaces(placesMap);
      } catch {
        setError(ERROR_MESSAGES.FETCH_FAILED);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNearbyPlaces({ lat, lng });
  }, [lat, lng, fetchNearbyPlaces]);

  function createPlacesMap(placesData: Place[]): Map<string, Place> {
    return new Map(placesData.map((place) => [place.id, place]));
  }

  function addPlace(place: Place): void {
    setPlaces((previousPlaces) => {
      const updatedPlaces = new Map(previousPlaces);
      updatedPlaces.set(place.id, place);
      return updatedPlaces;
    });
  }

  function removePlace(placeId: string): void {
    setPlaces((previousPlaces) => {
      const updatedPlaces = new Map(previousPlaces);
      updatedPlaces.delete(placeId);
      return updatedPlaces;
    });
  }

  return { places, isLoading, error, addPlace, removePlace };
}
