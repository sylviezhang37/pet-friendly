import { Client } from "@googlemaps/google-maps-services-js";
import { Place } from "../../domain/Place";
import { PlacesProvider } from "../../providers/PlacesProvider";
import { Coordinates } from "../../domain/models";

export class GoogleMapsPlacesProvider implements PlacesProvider {
  private readonly client: Client;

  constructor(private readonly apiKey: string) {
    this.client = new Client({});
  }

  async findNearbyPlaces(
    coordinates: Coordinates,
    radius: number
  ): Promise<Place[]> {
    const response = await this.client.placesNearby({
      params: {
        location: coordinates,
        radius,
        key: this.apiKey,
      },
    });

    return response.data.results.map((place) => this.mapToPlace(place));
  }

  async getPlaceDetails(id: string): Promise<Place> {
    const response = await this.client.placeDetails({
      params: {
        place_id: id,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "type",
          "url",
          "allowsDogs",
        ],
        key: this.apiKey,
      },
    });

    return this.mapToPlace(response.data.result);
  }

  async searchPlaces(
    query: string,
    coordinates: Coordinates
  ): Promise<Place[]> {
    const response = await this.client.textSearch({
      params: {
        query,
        location: coordinates,
        radius: 5000,
        key: this.apiKey,
      },
    });

    return response.data.results.map((place) => this.mapToPlace(place));
  }

  private mapToPlace(place: any): Place {
    return new Place({
      id: place.id,
      name: place.name,
      address: place.vicinity,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      businessType: place.types[0],
      googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    });
  }
}
