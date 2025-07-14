CREATE TABLE IF NOT EXISTS places (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    business_type VARCHAR(100),
    google_maps_url TEXT,
    allows_pet BOOLEAN DEFAULT false,
    pet_friendly BOOLEAN DEFAULT false,
    num_confirm INTEGER DEFAULT 0,
    num_deny INTEGER DEFAULT 0,
    last_contribution_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS places_location_idx ON places USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

CREATE INDEX IF NOT EXISTS places_name_address_idx ON places USING GIN (
    to_tsvector('english', name || ' ' || address)
); 