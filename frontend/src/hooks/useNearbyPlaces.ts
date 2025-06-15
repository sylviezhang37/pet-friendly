import { useState, useEffect } from "react";
import { Place } from "@/models/models";
import { placesService } from "@/api/places-service";

// TODO: cache
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

    // TODO: add place to db here
    // addPlaceToDb(place);
  };

  const removePlace = (placeId: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
  };

  return { places, isLoading, error, addPlace, removePlace };
}
