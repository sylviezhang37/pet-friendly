# PetFriendly Frontend Design & Implementation

## Overview

This document summarizes the design and implementation plan for the PetFriendly frontend, covering both desktop and mobile experiences, user flows, and technical decisions.

---

## 1. General Principles

- Built with React + Next.js (TypeScript)
- Uses Google Maps JavaScript API for map rendering
- Chakra UI + Tailwind CSS for styling and components
- Zustand for state management
- React Query for data fetching and caching
- Storybook for component documentation
- Responsive design for desktop and mobile
- PWA support

---

## 2. Desktop Experience

### 2.1 Main (Welcome) Page

- **Left:** Interactive map showing pet-friendly places (GET /api/v0/places/nearby)
- **Right:** Info/search panel
  - App title, description
  - Search box (GET /api/v0/places/search, with suggestions/autocomplete)
  - Clicking a map pin or search result opens place details in the right panel
  - Support contact at the bottom

### 2.2 Place Details Page

- **Left:** Map remains visible and interactive
- **Right:** Place details panel (scrollable)
  - Place name, address, last confirmed/denied date
  - Confirmed/denied counts
  - Confirm/Deny buttons (one per user/session)
  - Reviews section (GET /api/v0/reviews/{placeId})
  - Add review UI appears after confirm/deny click
    - Comment box, Cancel/Post buttons
    - POST /api/v0/reviews
    - Optimistic UI update, rollback on failure
    - "Review submitted" confirmation on success

---

## 3. Mobile Experience

- Map at the top of the screen
- Info/search or place details panel as a fixed-size, scrollable overlay at the bottom
- Map remains interactive
- Search bar only on the welcome screen
- All flows and features match desktop, only layout differs

---

## 4. User & Review Logic

- User ID and username are managed via local storage (no authentication)
- If no user exists, one is generated via the Users service
- Only one confirm/deny/review per user per place
- Reviews are immutable after posting (future: allow edit/delete)

---

## 5. Search Suggestions

- Search box provides suggestions as user types (debounced API calls)
- Minimum 2-3 characters before triggering search
- Suggestions shown in dropdown

---

## 6. Map Behavior

- Pins update when user pans/zooms the map (fetch new places within bounds)
- Clicking a pin opens place details in the info panel

---

## 7. Error Handling & Feedback

- Optimistic UI updates for reviews and place status
- Rollback on failure, with error message
- Confirmation message after successful review submission

---

## 8. Component Documentation

- All UI components documented in Storybook
- Props, usage, and states covered

---

## 9. Future Considerations

- Allow editing/deleting reviews
- User authentication and profiles
- Advanced caching strategies
- Additional map features (filters, clustering, etc.)

---

_Last updated: 2024-06-09_
