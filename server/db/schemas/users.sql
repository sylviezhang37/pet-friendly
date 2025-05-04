SET search_path TO users;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    is_anonymous BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_token VARCHAR(255) UNIQUE
);

CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

CREATE INDEX IF NOT EXISTS users_session_token_idx ON users(session_token); 