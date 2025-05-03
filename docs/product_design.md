# PetFriendly Product Design Document

## 1. Product Overview

PetFriendly is a web application that helps pet owners discover and contribute to a database of pet-friendly businesses in their area. The application provides an interactive map-based interface where users can view, search for, and confirm pet-friendly locations.

### 1.1 Core Value Proposition

- Help pet owners find places where they can bring their pets
- Provide community-verified information about pet policies
- Allow users to contribute to and benefit from collective knowledge

### 1.2 Target Users

- Pet owners looking for pet-friendly establishments
- Users who want to contribute to the pet owner community
- Businesses interested in being listed as pet-friendly

## 2. User Journey (V0)

### 2.1 Discovery & Initial Use

- User searches for pet-friendly businesses online and discovers the app
- Opens the web application on their device
- Immediately sees a map with nearby pet-friendly businesses
- Can filter results by business type

### 2.2 Engagement & Contribution

- Views business details (name, address, pet-friendly status)
- Confirms pet-friendly status after visiting
- Adds optional reviews about pet accommodations (in the same action as confirming status)
- Contributes new pet-friendly businesses to the database

### 2.3 User Identity

- No formal login required for V0
- First-time users automatically assigned a random username
- Users can optionally enter a custom username
- Identity persisted across sessions via browser cookies
- Same username used for all contributions

### 2.4 Technical Note

- Google Maps integration for business data
- Persistent user IDs stored in database
- User preferences and identity maintained between sessions

## 3. System Architecture

### 3.1 Microservices Overview

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

### 3.2 Service Descriptions

#### 3.2.1 Frontend Service

- Single-page web application
- Map-based interface using Google Maps JavaScript API
- Communicates with backend services via API Gateway

#### 3.2.2 API Gateway Service

- Single entry point for frontend requests
- Routes requests to appropriate microservices
- Handles request validation and rate limiting
- Manages CORS and security concerns

#### 3.2.3 Places Service

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
- PetFriendly status

#### 3.2.4 Pet-Friendly Reviews Service

- Stores pet-friendly status confirmations with optional reviews
- Tracks confirmation count and timestamps
- Associates confirmations and reviews with user IDs
- Provides API for confirming status and adding reviews in a single action

**Database Schema:**

- Review ID (primary key)
- Place ID (foreign key to Places Service)
- User ID (foreign key to User Service)
- PetFriendly (boolean)
- Review text (optional)
- Timestamp

#### 3.2.5 User Service

- Manages user information for both anonymous and registered users
- Generates and stores persistent anonymous user IDs
- Stores user-selected or randomly assigned usernames
- Maintains session persistence via cookies

**Database Schema:**

- User ID (primary key)
- Username (user-selected or randomly assigned)
- Anonymous flag (boolean)
- Creation timestamp
- Last active timestamp
- Session token (for cookie persistence)

### 3.3 Data Storage

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

### 3.4 API Design

#### Places Service API

```
GET /api/places/{id}
GET /api/places/nearby?lat={latitude}&lng={longitude}&radius={meters}
GET /api/places/search?query={search_term}&lat={latitude}&lng={longitude}
POST /api/places/add
PATCH /api/places/{id}/pet-friendly
```

#### Pet-Friendly Reviews Service API

```
GET /api/reviews/{placeId}
POST /api/reviews/add
  - Request body includes:
    - placeId
    - statuse (boolean)
    - review (optional text)
    - userId
```

#### User Service API

```
GET /api/users/{userId}
POST /api/users - Create a new user with username
GET /api/users/session - Get or create user session from cookie
```

## 4. Technical Implementation

### 4.1 Technology Stack

**Frontend:**

- React.js for UI components
- Google Maps JavaScript API for map integration
- Tailwind CSS for styling
- Future consideration: progressive Web App (PWA) capabilities

**Backend:**

- Node.js with Express or NestJS for API services
- PostgreSQL with PostGIS extension on AWS RDS for geospatial data storage
- Redis for caching frequently accessed data
- Docker for containerization

**Infrastructure:**

- AWS as cloud provider
- CI/CD pipeline for automated deployments

### 4.2 Development Considerations

**Caching Strategy:**

- Places data cached permanently in PostgreSQL unless explicitly refreshed
- Google Maps API called only for new search queries
- In-memory cache for frequent queries

**User Identity Management:**

- Generate and persist anonymous user IDs
- Store usernames (random or user-selected) in User Service database
- Cookie-based session management for persistent identity
- Ensure all contributions are associated with a user ID

**Performance Optimization:**

- PostGIS spatial indexing for location-based queries
- Query optimization for common search patterns
- Pagination for large result sets

**Security Considerations:**

- Rate limiting to prevent abuse
- Input validation to prevent injection attacks
- CORS configuration for frontend access
- Secure cookie handling for user sessions

## 5. Future Roadmap (Post V0)

### 5.1 User Accounts

- Email/social login
- User profiles
- Persistent preferences

### 5.2 Advanced Features

- Bookmarking favorite places
- Custom collections (e.g., "Rainy day cafes")
- Photo uploads for pet-friendly locations
- Notifications for new pet-friendly places nearby

## 6. Success Metrics

### 6.1 User Engagement

- Daily active users
- Number of map views
- Number of business detail views

### 6.2 Contribution Metrics

- Pet-friendly status confirmations
- New businesses added
- Reviews submitted

### 6.3 Technical Metrics

- API response times
- Google Maps API usage
- Service availability## 7. Development Timeline

### 7.1 Phase 1: MVP (V0)

- Core functionality with persistent anonymous user IDs
- Map view with nearby pet-friendly businesses
- Ability to confirm pet-friendly status with optional reviews
- Username persistence across sessions
- PostgreSQL with PostGIS for all data storage

### 7.2 Phase 2: User Accounts

- Implementation of formal user authentication
- Enhanced user profiles and preferences
- Option to convert anonymous accounts to registered accounts
- Maintaining all previous contributions when converting

### 7.3 Phase 3: Advanced Features

- Bookmarking and collections
- Photo uploads
- Enhanced search capabilities
- Community features
