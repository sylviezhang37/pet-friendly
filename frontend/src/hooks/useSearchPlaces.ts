import { useState, useCallback } from "react";
import { Place } from "@/models/models";
import { placesService } from "@/api/places-service";
import { Coordinates } from "@/models/backend-models";

// Default to NYC coordinates
const DEFAULT_COORDINATES: Coordinates = {
  lat: 40.758,
  lng: -73.9855,
};

export function useSearchPlaces() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Place[]>([]);

  const search = useCallback(async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const places = await placesService.searchAndCreatePlace(
        trimmedQuery,
        DEFAULT_COORDINATES
      );
      setResults(places);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search places");
    } finally {
      setIsLoading(false);
    }
  }, [query]); // Only depends on query

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []); // No dependencies

  return {
    searchQuery: query,
    setSearchQuery: setQuery,
    isLoading,
    error,
    results,
    search,
    clearResults,
  };
}
