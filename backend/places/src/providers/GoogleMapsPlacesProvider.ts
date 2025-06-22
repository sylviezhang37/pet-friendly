import axios from "axios";
import { Place } from "../domain/Place";
import { PlacesProvider } from "./PlacesProvider";
import { Coordinates } from "../domain/models";
import { temp_data } from "./temp";

export class GoogleMapsPlacesProvider implements PlacesProvider {
  private readonly baseUrl = "https://places.googleapis.com/v1";
  private readonly headers: Record<string, string>;

  constructor(private readonly apiKey: string) {
    this.headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": this.apiKey,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.types",
        "places.addressDescriptor",
        "places.primaryType",
        "places.primaryTypeDisplayName",
        "places.rating",
        "places.googleMapsUri",
      ].join(","),
    };
  }

  async findNearbyPlaces(
    coordinates: Coordinates,
    radius: number,
    keyword: string
  ): Promise<Place[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/places:searchNearby`,
        {
          locationBias: {
            circle: {
              center: {
                latitude: coordinates.lat,
                longitude: coordinates.lng,
              },
              radius: radius,
            },
          },
          textQuery: keyword,
          maxResultCount: 20,
          rankPreference: "DISTANCE",
        },
        { headers: this.headers }
      );

      return response.data.places.map((place: any) => this.mapToPlace(place));
    } catch (error) {
      console.error("Error in findNearbyPlaces:", error);
      throw error;
    }
  }

  async getPlaceDetails(id: string): Promise<Place> {
    try {
      // Remove 'places/' prefix if it exists
      const placeId = id.startsWith("places/") ? id.split("/")[1] : id;

      const response = await axios.get(`${this.baseUrl}/places/${placeId}`, {
        headers: this.headers,
      });

      return this.mapToPlace(response.data);
    } catch (error) {
      console.error("Error in getPlaceDetails:", error);
      throw error;
    }
  }

  async searchPlaces(
    query: string,
    coordinates: Coordinates
  ): Promise<Place[]> {
    try {
      // const response = await axios.post(
      //   `${this.baseUrl}/places:searchText`,
      //   {
      //     textQuery: query,
      //     locationBias: {
      //       circle: {
      //         center: {
      //           latitude: coordinates.lat,
      //           longitude: coordinates.lng,
      //         },
      //         radius: 5000, // 5km
      //       },
      //     },
      //     maxResultCount: 7,
      //     rankPreference: "RELEVANCE",
      //   },
      //   { headers: this.headers }
      // );

      const response = temp_data;
      return response.data.places.map((place: any) => this.mapToPlace(place));
    } catch (error) {
      console.error("Error when searching places through Maps API:", error);
      throw error;
    }
  }

  private mapToPlace(place: any): Place {
    return new Place({
      id: place.id,
      name: place.displayName?.text || place.text,
      address: place.formattedAddress,
      coordinates: {
        lat: place.location?.latitude,
        lng: place.location?.longitude,
      },
      // TODO: need an API upgrade for this field
      allowsPet: false,
      businessType: place.primaryTypeDisplayName.text || place.types[0],
      googleMapsUrl:
        place.googleMapsUri ||
        `https://www.google.com/maps/place/?q=place_id:${place.id}`,
    });
  }
}
