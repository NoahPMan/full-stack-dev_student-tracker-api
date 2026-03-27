# CORS Configuration Documentation

**Implemented by:** Muniru Adam  
**Sprint:** 4  
**Requirement:** T.4 - Back-end CORS Configuration (P2)  
**Date:** March 2026

---

## Overview

This document explains the CORS (Cross-Origin Resource Sharing) configuration implemented in the Student Tracker API backend.

---

## What is CORS?

CORS is a security mechanism built into web browsers that controls which websites can make requests to our API.

### The Cross-Origin Problem

- **Frontend URL:** `http://localhost:5173` (Vite development server)
- **Backend URL:** `http://localhost:3000` (Express server)

These are **different origins** because they use different ports. By default, browsers **block** requests between different origins for security reasons.

### The CORS Solution

CORS middleware tells the browser: "Requests from localhost:5173 are allowed; block everything else."

---

## Implementation

### Location
`backend/src/server.ts` - Lines 20-26

### Configuration Code
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Configuration Breakdown

### 1. `origin: 'http://localhost:5173'`

**Purpose:** Specifies which origin (website) is allowed to access the API

**Security:** Only our frontend can make requests; all other origins are blocked

**Example:**
- ✅ Request from `http://localhost:5173` → **ALLOWED**
- ❌ Request from `http://localhost:3001` → **BLOCKED**
- ❌ Request from `http://evil-site.com` → **BLOCKED**

---

### 2. `credentials: true`

**Purpose:** Allows cookies and authorization headers to be sent with requests

**Use Case:** Required for authentication/authorization (will be implemented in future sprints)

**Why Important:** Without this, the frontend cannot send auth tokens or session cookies

---

### 3. `methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']`

**Purpose:** Specifies which HTTP methods the frontend can use

**Mapping to Operations:**
- `GET` - Read/retrieve data
- `POST` - Create new data
- `PUT`/`PATCH` - Update existing data
- `DELETE` - Remove data

**Security:** Prevents the frontend from using other HTTP methods (e.g., OPTIONS, TRACE)

---

### 4. `allowedHeaders: ['Content-Type', 'Authorization']`

**Purpose:** Specifies which headers the frontend can send

**Details:**
- `Content-Type` - Required for sending JSON data (`application/json`)
- `Authorization` - Required for sending auth tokens (e.g., `Bearer <token>`)

**Security:** Prevents the frontend from sending arbitrary headers

---

## Acceptance Criteria Met

✅ **cors package installed as back-end dependency**
   - Installed via npm
   - Imported in server.ts

✅ **CORS middleware prevents unauthorized requests**
   - Only `http://localhost:5173` can access the API
   - All other origins are blocked by the browser

✅ **Front-end requests are not prevented by CORS configuration**
   - Frontend origin is explicitly allowed
   - All necessary methods and headers are permitted

---

## Testing CORS

### Test 1: API is Running
```bash
curl http://localhost:3000/
```

**Expected Response:**
```
Student Tracker API is running
```

---

### Test 2: Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "Student Tracker API is operational",
  "cors": {
    "allowedOrigin": "http://localhost:5173",
    "credentialsEnabled": true,
    "allowedMethods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
    "allowedHeaders": ["Content-Type", "Authorization"]
  },
  "timestamp": "2026-03-27T..."
}
```

---

### Test 3: Frontend Can Access API

From frontend code (temporary test):
```typescript
fetch('http://localhost:3000/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ CORS works!', data))
  .catch(err => console.error('❌ CORS error:', err));
```

**Expected:** Success - frontend receives JSON response

---

### Test 4: Unauthorized Origins Are Blocked

Try accessing the API from a different port:

1. Open browser to `http://localhost:3001` (or any other origin)
2. Try to fetch `http://localhost:3000/api/health`

**Expected:** Browser blocks the request with CORS error

---

## Security Benefits

### 1. Origin Restriction
- **Threat:** Malicious website tries to access our API
- **Protection:** Browser blocks request because origin doesn't match
- **Result:** Our data stays safe

### 2. Method Control
- **Threat:** Attacker tries to use uncommon HTTP methods
- **Protection:** Only specified methods (GET, POST, etc.) are allowed
- **Result:** Attack surface is reduced

### 3. Header Control
- **Threat:** Malicious site tries to send custom headers
- **Protection:** Only Content-Type and Authorization headers allowed
- **Result:** Prevents header-based attacks

### 4. Credential Protection
- **Threat:** Attacker tries to steal user session
- **Protection:** Credentials only sent to whitelisted origin
- **Result:** Session hijacking prevented

---

## Real-World Attack Scenario Prevented

### Without CORS (Vulnerable):

1. User logs into Student Tracker, gets auth cookie
2. User visits `evil-site.com` (still has auth cookie)
3. `evil-site.com` tries to make API request to our backend
4. **Without CORS:** Request succeeds, attacker steals user data ❌

### With Our CORS Configuration (Protected):

1. User logs into Student Tracker, gets auth cookie
2. User visits `evil-site.com` (still has auth cookie)
3. `evil-site.com` tries to make API request to our backend
4. **With CORS:** Browser blocks request, attacker gets nothing ✅

---

## Production Considerations

For production deployment, update the origin:

### Development (Current):
```typescript
origin: 'http://localhost:5173'
```

### Production (Future):
```typescript
origin: 'https://student-tracker-frontend.vercel.app'
```

### Best Practice (Environment Variable):

Create `.env` file:
```env
FRONTEND_URL=http://localhost:5173
```

Update code:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  // ... rest of config
}));
```

---

## Common CORS Errors and Solutions

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause:** CORS not configured or wrong origin  
**Solution:** Verify origin matches frontend URL exactly

### Error: "CORS policy: The value of the 'Access-Control-Allow-Credentials' header is ''"

**Cause:** `credentials: true` missing  
**Solution:** Add `credentials: true` to CORS config

### Error: "CORS policy: Method PUT is not allowed"

**Cause:** Method not in allowed list  
**Solution:** Add method to `methods` array

---

## References

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [CORS npm Package](https://www.npmjs.com/package/cors)

---

## Changelog

**March 27, 2026** - Initial implementation
- Configured CORS to restrict origin to frontend only
- Enabled credentials for future auth
- Specified allowed methods and headers
- Added health check endpoint
- Created documentation