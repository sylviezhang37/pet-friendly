# PetFriendly Clean Architecture Principles

## Introduction

This document outlines the clean architecture principles that will guide the development of the PetFriendly application. By adhering to these principles, we aim to create a system that is maintainable, testable, and adaptable to changing requirements.

## Core Principles

Clean architecture is based on the idea that software should be organized in layers, with each layer having a distinct responsibility. The innermost layers contain business logic, while the outermost layers deal with UI, databases, and external services.

### Key Benefits

- **Independence from frameworks**: The core business logic doesn't depend on any external frameworks or libraries.
- **Testability**: Each component can be tested in isolation.
- **Independence from UI**: The UI can change without affecting business rules.
- **Independence from database**: The database can be swapped without affecting business rules.
- **Independence from external agencies**: Business rules don't know anything about the outside world.

## 1. Domain Layer

### Description

The domain layer contains business entities and rules that are independent of external frameworks, databases, and services. It represents the core of our application.

### Implementation Guidelines

- Create pure domain entities (Place, User, Review) that encapsulate business logic
- Define business rules within these entities (e.g., determining if a place is "pet-friendly")
- Keep domain logic independent of infrastructure concerns
- Domain entities should not have dependencies on frameworks or external services

### Example

```javascript
// Domain entity - independent of database implementation
class Place {
  constructor(id, name, address, coordinates, petFriendlyStatus) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.coordinates = coordinates;
    this.petFriendlyStatus = petFriendlyStatus;
  }

  isPetFriendly() {
    // Business rule: a place is pet-friendly if it has at least one confirmation
    return this.petFriendlyStatus.confirmationCount > 0;
  }

  isRecentlyConfirmed() {
    // Business rule: confirmed within last 30 days
    return (
      this.petFriendlyStatus.lastConfirmationDate >
      new Date().getTime() - 30 * 24 * 60 * 60 * 1000
    );
  }
}
```

### Benefits for PetFriendly

- Business rules about pet-friendly status can evolve independently of how places are stored or displayed
- Logic for determining pet-friendly status is centralized and consistent
- Domain entities can be reused across different services

## 2. Interface Definitions

### Description

Interface definitions create clear boundaries between system components and enable dependency inversion. They allow high-level modules to be independent of low-level implementation details.

### Implementation Guidelines

- Define interfaces for external services (Google Maps, database access)
- Use these interfaces in domain and application layers
- Implement concrete adapters that fulfill these interfaces
- Design interfaces around domain concepts, not technical details

### Example

```javascript
// Interface (abstract class or TypeScript interface)
interface PlacesProvider {
  findNearbyPlaces(coordinates, radius): Promise<Place[]>;
  getPlaceDetails(placeId): Promise<PlaceDetails>;
  searchPlaces(query, coordinates): Promise<Place[]>;
}

// Implementation using Google Maps
class GoogleMapsPlacesProvider implements PlacesProvider {
  constructor(googleMapsClient) {
    this.googleMapsClient = googleMapsClient;
  }

  async findNearbyPlaces(coordinates, radius) {
    // Implementation using Google Maps API
    const response = await this.googleMapsClient.placesNearby({
      location: coordinates,
      radius,
    });

    // Map Google Maps response to domain entities
    return response.results.map((result) => this.mapToPlace(result));
  }

  // Other methods and mapping logic
}
```

### Benefits for PetFriendly

- We can switch from Google Maps to another provider without changing business logic
- Easier to mock external services for testing
- Clear separation between what we need (finding places) and how it's implemented

## 3. Repository Pattern

### Description

The repository pattern abstracts data access and provides collection-like interfaces for accessing domain objects. It acts as a bridge between the domain layer and data mapping layers.

### Implementation Guidelines

- Create repository interfaces for each domain entity
- Implement concrete repositories using your chosen database technology
- Use repositories to isolate domain logic from data access details
- Return domain entities from repositories, not database models

### Example

```javascript
// Repository interface
interface PlaceRepository {
  findById(id): Promise<Place>;
  findNearby(coordinates, radius): Promise<Place[]>;
  save(place): Promise<void>;
  search(query): Promise<Place[]>;
}

// PostgreSQL implementation
class PostgresPlaceRepository implements PlaceRepository {
  constructor(dbConnection) {
    this.dbConnection = dbConnection;
  }

  async findById(id) {
    const data = await this.dbConnection.query('SELECT * FROM places WHERE id = $1', [id]);
    return this.mapToEntity(data);
  }

  // Other methods implemented

  private mapToEntity(data) {
    // Transform database row to domain entity
    return new Place(
      data.id,
      data.name,
      data.address,
      { lat: data.latitude, lng: data.longitude },
      {
        confirmationCount: data.confirmation_count,
        lastConfirmationDate: data.last_confirmation_date
      }
    );
  }
}
```

### Benefits for PetFriendly

- Database implementation details are isolated from business logic
- We can change database technology without affecting the rest of the application
- Easier to test business logic without a real database
- Centralized place for database queries and optimization

## 4. Use Case Interactors

### Description

Use case interactors encapsulate application-specific business rules and orchestrate the flow of data to and from entities. They represent the application layer in clean architecture.

### Implementation Guidelines

- Create use case classes for each specific application action
- These classes coordinate domain entities and repositories
- Define clear input/output boundaries
- Keep use cases focused on a single responsibility

### Example

```javascript
// Use case input data structure
class FindNearbyPetFriendlyPlacesInput {
  constructor(latitude, longitude, radius, filters) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
    this.filters = filters;
  }
}

// Use case interactor
class FindNearbyPetFriendlyPlacesUseCase {
  constructor(placeRepository) {
    this.placeRepository = placeRepository;
  }

  async execute(input) {
    const coordinates = { lat: input.latitude, lng: input.longitude };
    const places = await this.placeRepository.findNearby(
      coordinates,
      input.radius
    );

    // Apply business rules
    const petFriendlyPlaces = places.filter((place) => place.isPetFriendly());

    // Apply filters
    if (input.filters?.businessType) {
      return petFriendlyPlaces.filter(
        (place) => place.businessType === input.filters.businessType
      );
    }

    return petFriendlyPlaces;
  }
}

// In your API controller:
async function getNearbyPlacesHandler(req, res) {
  const input = new FindNearbyPetFriendlyPlacesInput(
    req.query.lat,
    req.query.lng,
    req.query.radius,
    { businessType: req.query.type }
  );

  const useCase = new FindNearbyPetFriendlyPlacesUseCase(
    new PostgresPlaceRepository(dbConnection)
  );

  const places = await useCase.execute(input);
  res.json(places);
}
```

### Benefits for PetFriendly

- Application logic is separate from delivery mechanisms (API controllers)
- Each use case is focused and maintainable
- Use cases can be reused across different delivery mechanisms (API, CLI, etc.)
- Clear organization of business logic by user intention

## 5. Dependency Injection

### Description

Dependency injection is a technique for achieving dependency inversion by providing a component's dependencies rather than having the component create them.

### Implementation Guidelines

- Use constructor injection to provide dependencies
- Consider using a dependency injection container/framework
- Configure dependencies at the composition root of your application
- Inject interfaces, not concrete implementations

### Example

```javascript
// Using constructor injection
class PlaceService {
  constructor(placeRepository, googleMapsService, cache) {
    this.placeRepository = placeRepository;
    this.googleMapsService = googleMapsService;
    this.cache = cache;
  }

  // Methods that use the injected dependencies
}

// At application startup (composition root)
function setupServices() {
  // Create lowest-level dependencies
  const dbConnection = new PostgresConnection(config.database);
  const googleMapsClient = new GoogleMapsClient(config.googleMapsApiKey);
  const redisCache = new RedisCache(config.redis);

  // Create repositories
  const placeRepository = new PostgresPlaceRepository(dbConnection);

  // Create adapters
  const googleMapsService = new GoogleMapsService(googleMapsClient);

  // Create application services
  const placeService = new PlaceService(
    placeRepository,
    googleMapsService,
    redisCache
  );

  return {
    placeService,
    // other services...
  };
}
```

### Benefits for PetFriendly

- Components are loosely coupled and easier to test
- Dependencies can be mocked for testing
- Components can be reused with different dependencies
- Application becomes more modular and maintainable

## Implementation in Microservices Architecture

In the microservices architecture outlined in the product design document, these clean architecture principles should be applied within each service:

1. Each microservice should have its own domain layer with relevant entities
2. Services should communicate via well-defined interfaces
3. Each service should use the repository pattern for data access
4. Business logic should be organized into use cases
5. Dependency injection should be used for component composition

By implementing these principles consistently across all services, we'll create a system that's resilient to change and easy to maintain as the application evolves from MVP to more advanced phases.

## Conclusion

Adopting these clean architecture principles will provide numerous benefits for the PetFriendly application:

- Greater flexibility to adapt to changing requirements
- Improved testability of all components
- Better maintainability as the codebase grows
- Easier to scale individual components
- Future-proofing against technology changes

These principles should guide all development decisions, from initial design through implementation and refactoring.
