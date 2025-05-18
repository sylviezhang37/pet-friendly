import { useState, useEffect } from "react";
import { Place } from "@/lib/models";
import { placesService } from "@/services/places-service";

// TODO: cache result
export function useNearbyPlaces(lat: number, lng: number) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const placesData = await placesService.getNearbyPlaces({
          lat,
          lng,
        });
        setPlaces(placesData);
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
    setPlaces([...places, place]);
  };

  return { places, isLoading, error, addPlace };
}
