import { Pool } from "pg";
import { Place } from "../../domain/Place";
import { PlaceRepository } from "../../repositories/PlaceRepository";
import { Coordinates } from "../../domain/models";

export class PostgresPlaceRepository implements PlaceRepository {
  constructor(private readonly dbConnection: Pool) {}

  async findById(id: number): Promise<Place | null> {
    const query = `
      SELECT 
        p.*,
        COALESCE(r.confirmation_count, 0) as confirmation_count,
        MAX(r.confirmation_date) as last_confirmation_date
      FROM places p
      LEFT JOIN place_reviews r ON p.id = r.place_id
      WHERE p.id = $1
      GROUP BY p.id
    `;

    const result = await this.dbConnection.query(query, [id]);
    if (result.rows.length === 0) return null;

    return this.mapToEntity(result.rows[0]);
  }

  async findNearby(coordinates: Coordinates, radius: number): Promise<Place[]> {
    const query = `
      SELECT 
        p.*,
        COALESCE(r.confirmation_count, 0) as confirmation_count,
        MAX(r.confirmation_date) as last_confirmation_date
      FROM places p
      LEFT JOIN place_reviews r ON p.id = r.place_id
      WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326),
        ST_SetSRID(ST_MakePoint($1, $2), 4326),
        $3
      )
      GROUP BY p.id
    `;

    const result = await this.dbConnection.query(query, [
      coordinates.lng,
      coordinates.lat,
      radius,
    ]);

    return result.rows.map((row) => this.mapToEntity(row));
  }

  async search(query: string, coordinates: Coordinates): Promise<Place[]> {
    const searchQuery = `
      SELECT 
        p.*,
        COALESCE(r.confirmation_count, 0) as confirmation_count,
        MAX(r.confirmation_date) as last_confirmation_date
      FROM places p
      LEFT JOIN place_reviews r ON p.id = r.place_id
      WHERE 
        (p.name ILIKE $1 OR p.address ILIKE $1)
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326),
          ST_SetSRID(ST_MakePoint($2, $3), 4326),
          5000
        )
      GROUP BY p.id
      LIMIT 20
    `;

    const result = await this.dbConnection.query(searchQuery, [
      `%${query}%`,
      coordinates.lng,
      coordinates.lat,
    ]);

    return result.rows.map((row) => this.mapToEntity(row));
  }

  async save(place: Place): Promise<Place> {
    const query = `
      INSERT INTO places (
        name, address, latitude, longitude, 
        business_type, place_id, google_maps_url, allows_pet
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await this.dbConnection.query(query, [
      place.name,
      place.address,
      place.coordinates.lat,
      place.coordinates.lng,
      place.businessType,
      place.placeId,
      place.googleMapsUrl,
      place.allowsPet || false,
    ]);

    return this.mapToEntity(result.rows[0]);
  }

  async updatePetFriendlyStatus(
    placeId: number,
    confirmed: boolean
  ): Promise<Place | null> {
    if (confirmed) {
      const query = `
        INSERT INTO place_reviews (place_id, confirmation_date)
        VALUES ($1, NOW())
      `;
      await this.dbConnection.query(query, [placeId]);
    }
    return this.findById(placeId);
  }

  private mapToEntity(data: any): Place {
    return new Place({
      id: data.id,
      name: data.name,
      address: data.address,
      coordinates: {
        lat: data.latitude,
        lng: data.longitude,
      },
      businessType: data.business_type,
      placeId: data.place_id,
      googleMapsUrl: data.google_maps_url,
      allowsPet: data.allows_pet,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      petFriendlyStatus: {
        confirmationCount: parseInt(data.confirmation_count) || 0,
        lastConfirmationDate: data.last_confirmation_date,
      },
    });
  }
}
