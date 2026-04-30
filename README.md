# AdminCore – User Profile Management App

A full-stack admin panel for managing user profiles and their associated addresses.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | Java 17, Spring Boot 3.2          |
| Frontend  | React 18, Material UI (MUI) v5    |
| Routing   | React Router v6                   |
| HTTP      | Axios                             |
| State     | React Hooks (useState, useEffect) |

---

## Setup Instructions

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+

---

### Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

The API will start at **http://localhost:8080**

#### Available Endpoints

| Method | Endpoint                                         | Description              |
|--------|--------------------------------------------------|--------------------------|
| GET    | `/api/users`                                     | List all users           |
| GET    | `/api/users/{id}`                                | Get user by ID           |
| PUT    | `/api/users/{id}`                                | Update user profile      |
| POST   | `/api/users/{userId}/addresses`                  | Add an address           |
| PUT    | `/api/users/{userId}/addresses/{addressId}`      | Update an address        |
| DELETE | `/api/users/{userId}/addresses/{addressId}`      | Delete an address        |

> No database required. Data is seeded in-memory at startup (5 users, 7 addresses).

---

### Frontend (React + MUI)

```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**

---

## Design Choices: User → Address Flow

### 1. Two-Level Navigation

- **User List** (`/users`) — Table view with search, stats summary, and a quick-action arrow button per row.
- **User Detail** (`/users/:id`) — Split-panel layout: Profile on the left, Addresses on the right.

The URL is the source of truth. Navigating back preserves the list state.

### 2. Inline Profile Editing

The profile card starts in **read-only mode** to reduce noise. Clicking the edit icon unlocks all fields. Saving calls `PUT /api/users/:id` and updates the local state optimistically — no full page reload.

### 3. Address 1-to-Many Management

Each address is rendered as a distinct card with:
- **Star icon** marking the primary address.
- **Edit** and **Delete** actions inline.
- Setting a new "primary" address automatically demotes all others (handled on the backend).

Additions and edits open a **modal dialog** (`AddressFormDialog`) to avoid cluttering the main layout. The first address a user ever adds is automatically set as primary.

### 4. State Handling

- User data is fetched on mount and re-fetched after any address mutation (`loadUser()` callback).
- Profile edits are held in a local `profileForm` state, decoupled from the source-of-truth `user` object — so cancelling is trivial (reset from `user`).
- Toast notifications give feedback on every write operation.

### 5. API Contract Philosophy

The backend exposes **RESTful, resource-scoped routes** that mirror the UI's conceptual model:

- Users are first-class resources.
- Addresses are nested under users (`/users/:id/addresses`).
- Payloads are minimal DTOs validated with Bean Validation (`@Valid`).
- CORS is pre-configured for `localhost:3000`.

This contract lets the frontend remain completely stateless — it only needs to know user IDs and address IDs, not manage relationship maps itself.

---

## Project Structure

```
user-admin-app/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/admin/userprofile/
│       ├── UserProfileApplication.java
│       ├── controller/UserController.java
│       ├── service/UserService.java
│       ├── model/
│       │   ├── User.java
│       │   └── Address.java
│       └── dto/
│           ├── UserUpdateRequest.java
│           └── AddressRequest.java
└── frontend/
    ├── package.json
    └── src/
        ├── App.js
        ├── index.js
        ├── services/api.js
        ├── components/
        │   ├── Layout.js
        │   ├── StatusChip.js
        │   └── AddressFormDialog.js
        └── pages/
            ├── UserListPage.js
            └── UserDetailPage.js
```
