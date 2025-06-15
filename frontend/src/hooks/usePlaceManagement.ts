import { useCallback } from "react";
import { Place } from "@/models/models";
import { useNearbyPlaces } from "./useNearbyPlaces";
import placesService from "@/api/places-service";
import { useStore } from "./useStore";
import { AxiosError } from "axios";

// default to NYC for V0
const center = {
  lat: 40.758,
  lng: -73.9855,
};

export function usePlaceManagement() {
  const { places, addPlace, removePlace } = useNearbyPlaces(
    center.lat,
    center.lng
  );
  const selectedPlaceId = useStore((s) => s.selectedPlaceId);
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);

  const handlePlaceSelect = useCallback(
    async (place: Place) => {
      addPlace(place);
      setSelectedPlaceId(place.id);

      try {
        // Try to save to DB
        await placesService.createPlace(place);
      } catch (error) {
        // If save fails, rollback
        if (error instanceof AxiosError && error.response?.status === 409) {
          console.log("Place already exists in DB");
          return;
        }
        console.error("Failed to save place to DB:", error);
        // Remove from map and clear selection
        removePlace(place.id);
        setSelectedPlaceId(null);
      }
    },
    [addPlace, removePlace, setSelectedPlaceId]
  );

  const handleMarkerClick = useCallback(
    (placeId: string) => {
      setSelectedPlaceId(placeId);
    },
    [setSelectedPlaceId]
  );

  return {
    places,
    selectedPlaceId,
    handlePlaceSelect,
    handleMarkerClick,
  };
}
