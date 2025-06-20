import { Place } from "@/models/frontend";
import placesService from "@/api/places-service";

// TODO: move this operation into a queue
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
