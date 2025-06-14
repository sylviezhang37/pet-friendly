import { useState, useEffect } from "react";
import { Place } from "@/models/models";
import placesService from "@/data/places-service";

export function usePlaceDetails(placeId: string) {
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // let useEffect handle set up & tear down side effects
  useEffect(() => {
    // encapsulate the fetching action
    async function fetchPlace() {
      try {
        const placeData = await placesService.getPlaceById(placeId);
        setPlace(placeData);
      } catch (err) {
        console.error("Failed to load place details:", err);
        setError("Failed to load place details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlace();
  }, [placeId]);

  return { place, isLoading, error };
}
