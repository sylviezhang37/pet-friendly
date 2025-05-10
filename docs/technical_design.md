# PetFriendly Technical Design Document

## 1. System Architecture

### 1.1 Microservices Overview

PetFriendly utilizes a microservices architecture and consists of the following core services:

```
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│                │      │                │      │                │
│  Frontend      │◄────►│  API Gateway   │◄────►│  Places        │
│  Service       │      │  Service       │      │  Service       │
│                │      │                │      │                │
└────────────────┘      └───────┬────────┘      └────────────────┘
                                │
                                │
                 ┌──────────────┴───────────┐
                 │                          │
      ┌──────────▼─────────┐     ┌──────────▼─────────┐
      │                    │     │                    │
      │  User              │     │  Reviews           │
      │  Service           │     │  Service           │
      │                    │     │                    │
      └────────────────────┘     └────────────────────┘
```

### 1.2 Service Descriptions

#### 1.2.1 Frontend Service

- Map integration using Google Maps JavaScript API
- Communicates with backend services via API Gateway
- Desktop and mobile friendly experience

#### 1.2.2 API Gateway Service

- Single entry point for frontend requests
- Routes requests to appropriate microservices
- Handles request validation and rate limiting
- Manages CORS and security concerns

#### 1.2.3 Places Service

The Places Service manages all business location data for the application.

**Key Responsibilities:**

- Store and retrieve business location data
- Perform geographic searches for nearby businesses
- Handle business search by name/type
- Add new businesses to the system
- Integrate with Google Maps Places API when necessary

**Core Components:**

- **API Controller**: Routes incoming HTTP requests
- **Cache Manager**: Handles database interaction
- **Google Maps Client**: Manages API integration
- **Places Database**: Stores permanent business data

**Data Flow:**

1. **Finding Nearby Places**
   - Query database using geospatial indexes
   - Return cached business data
2. **Searching for Places**
   - Check database for matches first
   - If no results, call Google Maps Places API
   - Store new results in database
   - Return results to client
3. **Adding New Places**
   - Verify if business exists in database
   - Store new business information
   - Return confirmation
4. **Update Place PetFriendly Status**
   - Update a place's petfriendly status
5. **Get Place Details**
   - Return cached business data

**Database Schema:**

- ID (primary key = Google Place ID)
- Business name
- Address
- Geographic coordinates (latitude/longitude)
- Business type/category
- AllowsPet tag (Google Maps business details)
- Google Maps URL
- Creation timestamp
- Last updated timestamp
  (PetFriendly status, denormalized for faster reads)
- numConfirm
- numDeny
- lastContributionType
- lastContributionDate
- petFriendly (boolean)

#### 1.2.4 Reviews Service

- Stores pet-friendly confirmations with optional reviews
- Associates confirmations and reviews with user IDs
- Provides API for confirming pet-friendly status and adding reviews

**Database Schema:**

- ID (primary key)
- Place ID (foreign key to Places Service)
- User ID (foreign key to User Service)
- username
- PetFriendly (boolean)
- Comment (optional)
- Timestamp

#### 1.2.5 User Service

- Manages user information for users
- Generates and stores persistent user IDs and usernames
- Stores user-selected or randomly assigned usernames
- Maintains session persistence via local storage

**Database Schema:**

- User ID (primary key)
- Username (user-selected or randomly assigned)
- Anonymous flag (boolean)
- Created datetime

### 1.3 Data Storage

We'll use PostgreSQL with PostGIS extension hosted on AWS RDS for all services:

1. **Places Database**:

   - PostGIS extension for optimized geospatial queries
   - Stores static business information
   - No scheduled refresh needed

2. **Reviews Database**:

   - Tracks pet-friendly confirmations with optional reviews
   - Optimized for read performance and text search

3. **Users Database**:
   - Stores user information (anonymous or user-entered)
   - Manages persistent user identities across sessions

### 1.4 API Design

#### Places Service API

```
GET /api/v0/places/{id}
GET /api/v0/places/nearby?lat={latitude}&lng={longitude}&radius={meters}
GET /api/v0/places/search?query={search_term}&lat={latitude}&lng={longitude}
POST /api/v0/places/add
PATCH /api/v0/places/{id}/pet-friendly
```

#### Reviews Service API

```
GET /api/v0/reviews/{placeId}
POST /api/v0/reviews/add
```

#### User Service API

```
GET /api/v0/users/{userId}
POST /api/v0/users - Create a new user with username
```

## 2. Technical Implementation

### 2.1 Technology Stack

**Frontend:**

- React + NextJS
- Google Maps JavaScript API for map integration
- Tailwind CSS for styling
- Optimistic UI Updates with Backend Processing
- Future consideration: progressive Web App (PWA) capabilities

**Backend:**

- Node.js with Express or NestJS for API services
- PostgreSQL with PostGIS extension on AWS RDS for geospatial data storage
- caching: Redis?
- Docker for containerization?

**Infrastructure:**

- AWS as cloud provider
- CI/CD pipeline for automated deployments

### 2.2 Development Considerations

**Caching Strategy:**

- Places data cached permanently in PostgreSQL unless explicitly refreshed
- Google Maps API called only for new search queries
- In-memory cache for frequent queries

**User Identity Management:**

- Generate and persist user IDs and username
- Store usernames (random or user-entered) in Users database
- Session management for persistent identity using local storage
- Ensure all contributions are associated with a user ID

**Performance Optimization:**

- PostGIS spatial indexing for location-based queries
- Query optimization for common search patterns
- Pagination for large result sets

**Security Considerations:**

- Rate limiting to prevent abuse
- Input validation to prevent injection attacks
- CORS configuration for frontend access

## 3. Future Roadmap (Post V0)

### 3.1 User Accounts

- Google sign-in integration + cookie for identity persistence
- Persistent preferences

### 3.2 Advanced Features

- Bookmarking favorite places
- Custom collections (e.g., "Rainy day cafes")
- Photo uploads for pet-friendly locations
- Notifications for new pet-friendly places nearby

## 4. Success Metrics

### 4.1 User Engagement

- Daily active users
- Number of map views
- Number of business detail views

### 4.2 Contribution Metrics

- Pet-friendly status confirmations
- New businesses added
- Reviews submitted

### 4.3 Technical Metrics

- API response times
- Google Maps API usage
- Service availability

## 5. Development Timeline

### 5.1 Phase 1: MVP (V0)

- Core functionality with persistent user IDs + usernames (local storage)
- Map view with nearby pet-friendly businesses
- Ability to confirm or deny pet-friendly status with optional reviews
- PostgreSQL with PostGIS for places data

### 5.2 Phase 2: User Accounts

- Implementation of formal user authentication
- Enhanced user profiles and preferences
- Option to convert anonymous accounts to registered accounts
- Maintaining all previous contributions when converting

### 5.3 Phase 3: Advanced Features

- Bookmarking and collections
- Photo uploads
- Enhanced search capabilities
- Community features
