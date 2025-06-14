import { Place } from "@/models/models";
import placesService from "@/data/places-service";

export function usePlaceUpdate(placeId: string) {
  const updatePlaceStatus = async (place: Place, isPetFriendly: boolean) => {
    const numConfirm = place.numConfirm + (isPetFriendly ? 1 : 0);
    const numDeny = place.numDeny + (isPetFriendly ? 0 : 1);

    console.log("update place status with numconfirm deny");
    try {
      await placesService.updatePetFriendlyStatus(
        placeId,
        isPetFriendly,
        numConfirm,
        numDeny
      );
    } catch (err) {
      console.error("Failed to update place status in background:", err);
    }
  };

  return { updatePlaceStatus };
}
