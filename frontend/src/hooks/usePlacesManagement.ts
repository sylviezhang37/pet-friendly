import { useCallback } from "react";
import { Place } from "@/models/models";
import { useNearbyPlaces } from "./useNearbyPlaces";
import placesService from "@/api/places-service";
import { useStore } from "./useStore";

// default to NYC for V0
const center = {
  lat: 40.758,
  lng: -73.9855,
};

export function usePlacesManagement() {
  const { places, addPlace, removePlace } = useNearbyPlaces(
    center.lat,
    center.lng
  );
  const selectedPlaceId = useStore((s) => s.selectedPlaceId);
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);

  const handlePlaceSelect = useCallback(
    async (place: Place) => {
      // O(1) lookup using Map.has()
      if (places.has(place.id)) {
        setSelectedPlaceId(place.id);
        return;
      }

      addPlace(place);
      setSelectedPlaceId(place.id);

      try {
        // Try to save to DB
        await placesService.createOrGetPlace(place);
      } catch (error) {
        console.error("Failed to save place to DB:", error);
        removePlace(place.id);
        setSelectedPlaceId(null);
      }
    },
    [addPlace, removePlace, setSelectedPlaceId, places]
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
