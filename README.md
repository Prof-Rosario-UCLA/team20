# cs144-final

# Academic Scholars Profile Explorer

A full-stack Progressive Web App designed to help users discover and track academic researchers through the OpenAlex API. Built with React, Node.js, and WebAssembly module.

**Live Demo**: https://cs144-25s-yurikim.uw.r.appspot.com/

## Features

- Search and explore academic scholars profiles
- User accounts with support for favoriting scholars
- Visualize citation trends using the Canvas API
- WebAssembly module for optimized metric computation
- Authenticated sessions via JWT and secure cookies
- Offline functionality via PWA support
- Fully responsive layout (mobile-friendly from 320px+)

## Tech Stack

**Frontend**: React, Tailwind CSS, Canvas API, WebAssembly  
**Backend**: Node.js, Express, Prisma ORM  
**Database**: PostgreSQL(Supabase)
**Deployment**: Google App Engine  
**External APIs**: OpenAlex API for scholarly data

## Requirements

### Setup

```bash
git clone https://github.com/yuridekim/cs144-final.git
cd cs144-final

npm install

# Set up environment variables in env file(described later)

# Initialize database
npx prisma migrate dev
npx prisma generate


# Compile the WebAssembly module
npm run asbuild

# Start the development server
npm start
```

## Environment Variables

Create a .env file at the project root and include:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/scholars_db"
JWT_SECRET="jwt-key"
NODE_ENV="development"
```

## Database Schema

The application uses PostgreSQL with Prisma ORM:

```prisma
model Account {
  id        String    @id @default(uuid())
  userId    String    @unique
  password  String
  favorites Favorite[]
}

model Favorite {
  id        String   @id @default(uuid())
  accountId String
  scholarId String
  scholarName String?

  account   Account  @relation(fields: [accountId], references: [id])

  @@unique([accountId, scholarId])
}
```

## API Endpoints

### Authentication
#### `POST /api/auth/signup` - Create new user

**Request Body:**
```json
{
  "userId": "string",
  "password": "string"
}
```

#### `POST /api/auth/login` - Log in

**Request Body:**
```json
{
  "userId": "string", 
  "password": "string"
}
```

#### `POST /api/auth/logout` - Log out

#### `GET /api/auth/me` - Fetch logged-in user data

**Authentication:** Requires auth_token cookie

**Response:**
```json
{
  "userId": "string"
}
```

### Scholars
#### `GET /api/scholars?query={term}` - Search for scholars

**Query Parameters:**
- `query` (required): Search term for scholar names

**Example:**
```
GET /api/scholars?query=einstein
```

#### `GET /api/scholars/:id` - View detailed scholar profile

**Path Parameters:**
- `id` (required): Scholar ID from OpenAlex

**Response:**
```json
{
  ...scholarProfile,
  "works": [
    // Fetches up to 5
  ]
}
```

### Favorites
#### `GET /api/favorites` - Get user's favorites (auth required)

**Authentication:** Requires auth_token cookie

**Response:**
```json
[
  {
    "id": "number",
    "scholarId": "string",
    "scholarName": "string",
    "accountId": "number"
  }
]
```

#### `POST /api/favorites` - Add scholar to favorites (auth required)

**Authentication:** Requires auth_token cookie

**Request Body:**
```json
{
  "scholarId": "string",
  "scholarName": "string"
}
```

## Deployment

### Google App Engine

1. **Prepare for deployment**:
```bash
npm run start
```

2. **Deploy to App Engine**:
```bash
gcloud app deploy
```

3. **Set environment variables**:
```bash
gcloud app versions list
```

## Architecture

```
┌─────────────┐   HTTPS   ┌──────────────┐
│ React Client│◄─────────►│ Express API  │
│   (PWA)     │           │   Server     │
└─────────────┘           └──────────────┘
      │                          │
      │ Service Worker           │ Prisma ORM
      ▼                          ▼
┌─────────────┐           ┌──────────────┐
│ Local Cache │           │ PostgreSQL   │
└─────────────┘           │  Database    │
                          └──────────────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ OpenAlex API │
                          └──────────────┘
```

## Security Features

- **JWT Authentication**: Tokens stored in httpOnly cookies
- **Password Encryption**: bcrypt with salted hashes
- **Cross-Site Scripting (XSS)**: Input validation + CSP headers
- **CSRF Protection**: SameSite cookie
- **SQL Injection**: Prisma ORM parameterized queries

## PWA Features

- **Service Worker**: Enables caching and offline access
- **Web App Manifest**: Supports app installation on devices
- **Offline Mode**: Shows cached layout when network unavailable

## WebAssembly Integration

Includes a custom WebAssembly module for computing citation metrics:

```javascript
// WASM module loading
const wasmModule = await WebAssembly.instantiate(buffer, {
  env: { memory: wasmMemory, abort: () => {} }
});

// Citation calculation
const totalCitations = wasmModule.addRecentPublications(ptr, length);
```