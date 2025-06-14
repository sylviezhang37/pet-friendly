import { Pool } from "pg";
import { Place } from "../domain/Place";
import { PlacesRepo } from "./PlacesRepo";
import { Coordinates } from "../domain/models";

export class PostgresPlacesRepo implements PlacesRepo {
  constructor(private readonly dbConnection: Pool) {}

  async findById(id: string): Promise<Place | null> {
    const query = `SELECT * FROM places WHERE id = $1`;
    const result = await this.dbConnection.query(query, [id]);
    return result.rows.length ? this.mapToDomain(result.rows[0]) : null;
  }

  async findNearby(coordinates: Coordinates, radius: number): Promise<Place[]> {
    const query = `
      SELECT * FROM places 
      WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
        ST_SetSRID(ST_MakePoint($1, $2), 4326),
        $3
      )
    `;
    const result = await this.dbConnection.query(query, [
      coordinates.lng,
      coordinates.lat,
      radius,
    ]);
    return result.rows.map(this.mapToDomain);
  }

  async search(query: string, coordinates: Coordinates): Promise<Place[]> {
    const searchQuery = `
      SELECT * FROM places 
      WHERE (name ILIKE $1 OR address ILIKE $1)
      AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
        ST_SetSRID(ST_MakePoint($2, $3), 4326),
        5000
      )
      LIMIT 5
    `;
    const result = await this.dbConnection.query(searchQuery, [
      `%${query}%`,
      coordinates.lng,
      coordinates.lat,
    ]);

    return result.rows.map(this.mapToDomain);
  }

  async save(place: Place): Promise<Place> {
    const query = `
      INSERT INTO places (
        name, address, latitude, longitude, 
        business_type, id, google_maps_url, allows_pet, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await this.dbConnection.query(query, [
      place.name,
      place.address,
      place.coordinates.lat,
      place.coordinates.lng,
      place.businessType,
      place.id,
      place.googleMapsUrl,
      place.allowsPet || null,
      place.createdAt,
      place.updatedAt,
    ]);
    return this.mapToDomain(result.rows[0]);
  }

  async updatePlace(
    id: string,
    address: string,
    num_confirm: number,
    num_deny: number,
    last_contribution_type: string,
    pet_friendly: boolean
  ): Promise<Place | null> {
    const query = `
      UPDATE places 
      SET 
        address = COALESCE($2, address),
        num_confirm = $3,
        num_deny = $4,
        last_contribution_type = $5, 
        pet_friendly = $6,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.dbConnection.query(query, [
      id,
      address,
      num_confirm,
      num_deny,
      last_contribution_type,
      pet_friendly,
    ]);

    return result.rows.length ? this.mapToDomain(result.rows[0]) : null;
  }

  private mapToDomain(data: any): Place {
    return new Place({
      id: data.id,
      name: data.name,
      address: data.address,
      coordinates: {
        lat: data.latitude,
        lng: data.longitude,
      },
      businessType: data.business_type,
      googleMapsUrl: data.google_maps_url,
      allowsPet: data.allows_pet,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      numConfirm: data.num_confirm,
      numDeny: data.num_deny,
      lastContributionType: data.last_contribution_type,
      petFriendly: data.pet_friendly,
    });
  }
}
