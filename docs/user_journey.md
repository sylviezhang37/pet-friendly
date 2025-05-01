# Hero User Journey - PetFriendly

## User: George, a dog owner

### Phase 1: Discovery & Initial Use (Day 1)

#### Trigger: Needs to find pet-friendly spots

- George wants to explore his neighborhood but needs to find places where Maple is welcome
- Searches online for "pet-friendly businesses near me" and discovers the app

#### First Experience (Day 1)

- Opens the web application on his smartphone
- Immediately sees a map view of his current location with pins showing nearby pet-friendly businesses
- Can filter to specific business types like restaurants, cafes, etc.
- No login required

#### Initial Value (Day 1)

- Clicks on a coffee shop pin to view more details
- Sees basic information:
  - Business name: "Brew & Bark"
  - Type: Coffee Shop
  - Address: 123 Main Street
  - Pet-friendly status: Confirmed by 8 users (last confirmation 2 days ago)
  - Links to Google Maps for more information
  - Technical note: This integration uses the Google Maps Places API to pull business details

### Phase 2: Engagement & Contribution (Week 1)

#### Benefiting from the Tool and Providing Value Back (Week 1)

- Visits "Brew & Bark" with Maple
- Discovers they only allow dogs in the outdoor patio area
- Clicks on the "Brew & Bark" pin again
- Confirms the pet-friendly status
- Optionally, adds a contributor name, otherwise will get a random generic username
- Optionally, adds a review at the same time: "Dogs allowed on outdoor patio only"
- Feels good about contributing to the community
- Technical note: username is stored in a browser cookie with a unique anonymous ID for contribution tracking

#### Deeper Engagement (Week 2)

- Realizes there's a cafe he frequents that isn't on the map
- Searches for the cafe by its name in the search bar on top of the map view
- Clicks the "Add" button to confirm this is a pet-friendly place
- The form is pre-filled with his previously entered or assigned username
- The pet store shows up as a new pin (with one user's confirmation)
- Technical note: New businesses are added to the database and fetched using Google Maps Places API

### Phase 3: Adoption & Advocacy (Month 1)

#### Creating Account & Becoming a Regular

- After using the app several times, decides to create an account
- Signs up using "Continue with Google" integration
- Benefits explained:
  - Bookmark favorite places (stored in user profile in database)
  - Get notified of new pet-friendly places nearby (based on saved home location)
- Continues to confirm or update pet policies when visiting businesses

## Future Expansion Opportunities

### Phase 4: Community & Personalization (Month 3+)

#### Enhanced Contributions

- Uploads photos of Maple at pet-friendly establishments

#### Community Connection

- Follows other active users
- Gets notified if someone reports a business is no longer pet-friendly
- Bookmarking system allows George to create custom collections like "Maple's favorite parks" or "Rainy day pet spots"
