#!/bin/bash

# Database connection parameters
DB_USER=${DB_USER:-"sylvie"}
DB_HOST=${DB_HOST:-"localhost"}
DB_NAME=${DB_NAME:-"pf_test_db"}
DB_PASSWORD=${DB_PASSWORD:-""}
DB_PORT=${DB_PORT:-"5432"}

echo "Initializing database..."

psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -f tables/users.sql
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -f tables/places.sql
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -p $DB_PORT -f tables/reviews.sql

echo "Database initialization complete!" 