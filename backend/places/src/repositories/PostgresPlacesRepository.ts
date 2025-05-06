import { Pool } from "pg";
import { Place } from "../domain/Place";
import { PlacesRepository } from "./PlacesRepository";
import { Coordinates } from "../domain/models";

export class PostgresPlacesRepository implements PlacesRepository {
  constructor(private readonly dbConnection: Pool) {}

  async findById(id: string): Promise<Place | null> {
    const query = `SELECT * FROM places WHERE id = $1`;
    const result = await this.dbConnection.query(query, [id]);
    return result.rows.length ? this.mapToEntity(result.rows[0]) : null;
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
    return result.rows.map(this.mapToEntity);
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

    return result.rows.map(this.mapToEntity);
  }

  async save(place: Place): Promise<Place> {
    const query = `
      INSERT INTO places (
        name, address, latitude, longitude, 
        business_type, id, google_maps_url, allows_pet
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      place.allowsPet || false,
    ]);
    return this.mapToEntity(result.rows[0]);
  }

  async updatePetFriendlyStatus(
    id: string,
    pet_friendly: boolean,
    num_confirm: number,
    num_deny: number,
    last_contribution_type: string,
    last_contribution_date: Date
  ): Promise<Place | null> {
    const query = `
      UPDATE places 
      SET pet_friendly = $1, num_confirm = $2, num_deny = $3, 
      last_contribution_type = $4, last_contribution_date = $5, 
      updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const result = await this.dbConnection.query(query, [
      pet_friendly,
      num_confirm,
      num_deny,
      last_contribution_type,
      last_contribution_date,
      id,
    ]);

    return result.rows.length ? this.mapToEntity(result.rows[0]) : null;
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
      googleMapsUrl: data.google_maps_url,
      allowsPet: data.allows_pet,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      numConfirm: data.num_confirm,
      numDeny: data.num_deny,
      lastContributionType: data.last_contribution_type,
      lastContributionDate: data.last_contribution_date,
      petFriendly: data.pet_friendly,
    });
  }
}
