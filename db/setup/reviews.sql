CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    username VARCHAR(50) NOT NULL,
    pet_friendly BOOLEAN NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
);

CREATE INDEX IF NOT EXISTS reviews_place_id_idx ON reviews(place_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at);

CREATE INDEX IF NOT EXISTS reviews_comment_idx ON reviews USING GIN (
    to_tsvector('english', COALESCE(comment, ''))
); 