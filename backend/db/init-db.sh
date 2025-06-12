#!/bin/bash

# Load environment variables
source ../.env

# Database connection parameters
DB_USER=${DB_USER:-"sylvie"}
DB_HOST=${DB_HOST:-"localhost"}
DB_NAME=${DB_NAME:-"pf_test_db"}
DB_PASSWORD=${DB_PASSWORD:-""}
DB_PORT=${DB_PORT:-"5432"}

# Run the SQL files in order
echo "Initializing database..."

# First run init.sql to create extensions and schemas
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -f init.sql

# Then run the schema files
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -f schemas/places.sql
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -f schemas/users.sql
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -f schemas/reviews.sql

echo "Database initialization complete!" 