import { useState, useEffect } from "react";
import { Place } from "@/lib/models";
// import placesService from "@/services/places-service";

const placeDetails: Place = {
  id: "12345",
  address: "329 W 49th St, New York, NY 10019",
  lat: 40.768731,
  lng: -73.985709,
  name: "Barking Dog",
  type: "restaurant",
  allowsPet: true,
  googleMapsUrl: "https://www.google.com/maps/place/?cid=12345",
  createdAt: "2025-05-10",
  updatedAt: "2025-05-10",
  numConfirm: 5,
  numDeny: 1,
  lastContributionType: "confirm",
  petFriendly: true,
};

export function usePlaceDetails(placeId: string) {
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlace() {
      try {
        // const placeData = await placesService.getPlaceById(placeId);
        // TODO: remove this after backend implemented
        setPlace(placeDetails);
        // setPlace(placeData);
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
