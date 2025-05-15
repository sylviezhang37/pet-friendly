import { useState, useEffect } from "react";
import { Place } from "@/lib/models";
// import placesService from "@/services/places-service";

const samplePlaces: Place[] = [
  {
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
  },
  {
    id: "12346",
    address: "350 W 50th St, New York, NY 10019",
    lat: 40.761,
    lng: -73.982,
    name: "Spoiled Brats",
    type: "restaurant",
    allowsPet: true,
    googleMapsUrl: "https://www.google.com/maps/place/?cid=12345",
    createdAt: "2025-05-10",
    updatedAt: "2025-05-10",
    numConfirm: 5,
    numDeny: 1,
    lastContributionType: "confirm",
    petFriendly: false,
  },
];

// TODO: cache result
export function useNearbyPlaces(lat: number, lng: number) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlace() {
      try {
        // const placesData = await placesService.getNearbyPlaces({
        //   lat,
        //   lng,
        // });
        // TODO: remove this after backend implemented
        setPlaces(samplePlaces);
        // setPlaces(placesData);
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
