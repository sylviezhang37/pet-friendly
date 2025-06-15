import { useState, useEffect, useRef } from "react";
import { Place } from "@/models/models";
import { placesService } from "@/api/places-service";

// TODO: cache
export function useNearbyPlaces(lat: number, lng: number) {
  const [places, setPlaces] = useState<Map<string, Place>>(new Map());
  const placesRef = useRef<Map<string, Place>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    placesRef.current = places;
  }, [places]);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const placesData = await placesService.getNearbyPlaces({
          lat,
          lng,
        });
        // Clear and populate the Map directly
        placesRef.current.clear();
        placesData.forEach((place) => placesRef.current.set(place.id, place));
        // Update state to trigger re-render
        setPlaces(new Map(placesRef.current));
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
    placesRef.current.set(place.id, place);
    setPlaces(new Map(placesRef.current));
  };

  const removePlace = (placeId: string) => {
    placesRef.current.delete(placeId);
    setPlaces(new Map(placesRef.current));
  };

  return { places, isLoading, error, addPlace, removePlace };
}
