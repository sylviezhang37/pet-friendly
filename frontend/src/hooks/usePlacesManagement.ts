import { useCallback } from "react";
import { Place } from "@/models/frontend";
import { useNearbyPlaces } from "./useNearbyPlaces";
import placesService from "@/api/places-service";
import { useStore } from "./useStore";
import { DEFAULT_CENTER } from "@/lib/constants";

/**
 * This hook manages the places data and selected place id.
 * It uses the useNearbyPlaces hook to fetch nearby places and
 * manages the selected place id.
 */
export function usePlacesManagement() {
  const { places, addPlace, removePlace } = useNearbyPlaces(
    DEFAULT_CENTER.lat,
    DEFAULT_CENTER.lng
  );
  const selectedPlaceId = useStore((s) => s.selectedPlaceId);
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);

  const handlePlaceSelect = useCallback(
    async (place: Place) => {
      if (places.has(place.id)) {
        setSelectedPlaceId(place.id);
        return;
      }

      addPlace(place);
      setSelectedPlaceId(place.id);

      try {
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
