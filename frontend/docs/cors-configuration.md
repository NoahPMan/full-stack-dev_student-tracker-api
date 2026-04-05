# CORS Configuration Documentation

**Implemented by:** Muniru Adam  
**Sprint:** 4  
**Requirement:** T.4 - Back-end CORS Configuration (P2)

---

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security mechanism that controls which websites can make requests to our API.

### The Problem

- Frontend runs on: `http://localhost:5173` (Vite dev server)
- Backend runs on: `http://localhost:3000` (Express server)

These are **different origins** (different ports). By default, browsers **block** requests between different origins for security reasons.

### The Solution

CORS middleware tells the browser: "It's okay for the frontend to make requests to this backend."

---

## Implementation

### Location
`backend/src/server.ts` - Lines 15-21

### Configuration
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Configuration Details

### 1. origin
**Value:** `http://localhost:5173`  
**Purpose:** Specifies which origin is allowed to access the API  
**Security:** Only requests from our frontend are accepted; all others are blocked

### 2. credentials
**Value:** `true`  
**Purpose:** Allows cookies and authorization headers to be sent with requests  
**Use Case:** Needed for authentication/authorization in future sprints

### 3. methods
**Value:** `['GET', 'POST', 'PUT', 'DELETE', 'PATCH']`  
**Purpose:** Specifies which HTTP methods are allowed  
**Mapping:**
- GET - Read data
- POST - Create data
- PUT/PATCH - Update data
- DELETE - Remove data

### 4. allowedHeaders
**Value:** `['Content-Type', 'Authorization']`  
**Purpose:** Specifies which headers the frontend can send  
**Details:**
- `Content-Type`: Required for sending JSON data
- `Authorization`: Required for authentication tokens (future implementation)

---

## Testing CORS

### Test 1: Frontend Can Access API

**From frontend code:**
```typescript
fetch('http://localhost:3000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Expected Result:**
```json
{
  "status": "healthy",
  "message": "API is operational",
  "cors": {
    "allowedOrigin": "http://localhost:5173",
    "credentialsEnabled": true
  },
  "timestamp": "2026-03-20T..."
}
```

### Test 2: Unauthorized Origins Are Blocked

Try accessing the API from a different origin (e.g., `http://localhost:3001`).

**Expected Result:** Browser blocks the request with a CORS error

---

## Security Benefits

1. **Origin Restriction**
   - Only our frontend can access the API
   - Prevents unauthorized websites from stealing data

2. **Method Control**
   - Only specified HTTP methods are allowed
   - Prevents unexpected request types

3. **Header Control**
   - Only specified headers can be sent
   - Reduces attack surface

4. **Credential Protection**
   - Secure handling of cookies and auth tokens
   - Prevents credential theft

---

## Environment Variables

For production flexibility, the frontend URL is stored in `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

**For production deployment:**
```env
FRONTEND_URL=https://your-deployed-frontend.com
```

---

## How CORS Prevents Attacks

### Attack Scenario Without CORS:
1. Attacker creates malicious website: `evil.com`
2. User logs into our app, gets auth cookie
3. User visits `evil.com`
4. `evil.com` tries to make requests to our API
5. **Without CORS:** Request succeeds, attacker steals data

### With Our CORS Configuration:
1. Attacker creates `evil.com`
2. User visits `evil.com`
3. `evil.com` tries to make requests to our API
4. **With CORS:** Browser blocks request, attacker gets nothing ✅

---

## Acceptance Criteria Met

✅ **CORS package installed** - `cors@2.x.x` in dependencies  
✅ **Prevents unauthorized requests** - Origin restricted to frontend only  
✅ **Frontend requests allowed** - Frontend can successfully make API calls  
✅ **Documented configuration** - This document explains all settings

---

## Future Improvements

1. **Multiple Environments**
```typescript
   const allowedOrigins = [
     'http://localhost:5173',  // Development
     'https://staging.example.com',  // Staging
     'https://example.com'  // Production
   ];
```

2. **CORS Preflight Caching**
```typescript
   app.use(cors({
     // ... existing config
     maxAge: 86400  // Cache preflight for 24 hours
   }));
```

3. **Dynamic Origin Validation**
```typescript
   origin: (origin, callback) => {
     if (allowedOrigins.includes(origin)) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
   }
```

---

## References

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [CORS npm package](https://www.npmjs.com/package/cors)