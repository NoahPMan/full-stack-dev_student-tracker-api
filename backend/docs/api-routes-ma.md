# Course API Routes Documentation

Student: Muniru Adam  
Sprint: 4  
Requirement: I.1 - Back-end Resource Endpoint (P1)  
Date: March 2026

---

## Overview

This document describes the RESTful API endpoints implemented for course management in the Student Tracker application.

Base URL: `http://localhost:3000/api/courses`

Architecture: Routes → Controller → Prisma → Database

---

## API Endpoints

### 1. Get All Courses

Endpoint: `GET /api/courses`

Description: Retrieves all courses, sorted alphabetically by course code

Authentication: None

**Request Example:**
```bash
GET http://localhost:3000/api/courses
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 11,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "COMP-2130",
      "name": "Data Structures",
      "credits": 4,
      "instructor": "Dr. Thompson",
      "semester": "Fall 2025",
      "description": "Fundamental data structures and algorithms",
      "createdAt": "2026-03-27T18:00:58.724Z",
      "updatedAt": "2026-03-27T18:00:58.724Z"
    },
    // ... more courses
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to fetch courses",
  "message": "Database connection error"
}
```

---

### 2. Get Single Course

**Endpoint:** `GET /api/courses/:id`

**Description:** Retrieves a single course by its ID

**Authentication:** None (public)

**URL Parameters:**
- `id` (string, required) - Course UUID

**Request Example:**
```bash
GET http://localhost:3000/api/courses/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "COMP-4002",
    "name": "Full-Stack Development",
    "credits": 3,
    "instructor": "Prof. Anderson",
    "semester": "Fall 2025",
    "description": "Learn to build complete web applications",
    "createdAt": "2026-03-27T18:00:58.724Z",
    "updatedAt": "2026-03-27T18:00:58.724Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Course not found",
  "message": "No course found with ID: 550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 3. Create Course

**Endpoint:** `POST /api/courses`

**Description:** Creates a new course

**Authentication:** None (public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "COMP-4002",
  "name": "Full-Stack Development",
  "credits": 3,
  "instructor": "Prof. Anderson",
  "semester": "Fall 2025",
  "description": "Learn to build complete web applications"
}
```

**Required Fields:**
- `code` (string) - Course code in format DEPT-NUMBER
- `name` (string) - Course name (min 3 characters)
- `credits` (number) - Number of credits (1-6)

**Optional Fields:**
- `instructor` (string) - Instructor name
- `semester` (string) - Semester/term
- `description` (string) - Course description

**Validation Rules:**
- `code`: Must match pattern `^[A-Z]+-\d+$` (e.g., COMP-4002)
- `code`: Must be unique (no duplicates)
- `name`: Minimum 3 characters
- `credits`: Must be between 1 and 6

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "COMP-4002",
    "name": "Full-Stack Development",
    "credits": 3,
    "instructor": "Prof. Anderson",
    "semester": "Fall 2025",
    "description": "Learn to build complete web applications",
    "createdAt": "2026-03-27T20:15:30.182Z",
    "updatedAt": "2026-03-27T20:15:30.182Z"
  }
}
```

**Error Response (400 Bad Request) - Missing Fields:**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Missing required fields: code, name, and credits are required"
}
```

**Error Response (400 Bad Request) - Invalid Code Format:**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Course code must be in format: DEPT-NUMBER (e.g., COMP-4002)"
}
```

**Error Response (400 Bad Request) - Invalid Credits:**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Credits must be between 1 and 6"
}
```

**Error Response (409 Conflict) - Duplicate Code:**
```json
{
  "success": false,
  "error": "Duplicate course code",
  "message": "Course with code COMP-4002 already exists"
}
```

---

### 4. Update Course

**Endpoint:** `PUT /api/courses/:id`

**Description:** Updates an existing course

**Authentication:** None (public)

**URL Parameters:**
- `id` (string, required) - Course UUID

**Request Headers:**
```
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "code": "COMP-4003",
  "name": "Advanced Full-Stack Development",
  "credits": 4,
  "instructor": "Dr. Smith",
  "semester": "Winter 2026",
  "description": "Advanced web development techniques"
}
```

**Validation Rules:**
- Same as create, but all fields are optional
- If updating `code`, must still be unique and match format
- If updating `credits`, must still be 1-6

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "COMP-4003",
    "name": "Advanced Full-Stack Development",
    "credits": 4,
    "instructor": "Dr. Smith",
    "semester": "Winter 2026",
    "description": "Advanced web development techniques",
    "createdAt": "2026-03-27T20:15:30.182Z",
    "updatedAt": "2026-03-27T21:30:45.920Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Course not found",
  "message": "No course found with ID: 550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (409 Conflict) - Duplicate Code:**
```json
{
  "success": false,
  "error": "Duplicate course code",
  "message": "Course with code COMP-4003 already exists"
}
```

---

### 5. Delete Course

**Endpoint:** `DELETE /api/courses/:id`

**Description:** Deletes a course

**Authentication:** None (public)

**URL Parameters:**
- `id` (string, required) - Course UUID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "COMP-4002",
    "name": "Full-Stack Development",
    "credits": 3,
    "instructor": "Prof. Anderson",
    "semester": "Fall 2025",
    "description": "Learn to build complete web applications",
    "createdAt": "2026-03-27T20:15:30.182Z",
    "updatedAt": "2026-03-27T20:15:30.182Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Course not found",
  "message": "No course found with ID: 550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 6. Search Courses

**Endpoint:** `GET /api/courses/search?q={query}`

**Description:** Search courses by code or name (case-insensitive)

**Authentication:** None (public)

**Query Parameters:**
- `q` (string, required) - Search query

**Request Example:**
```bash
GET http://localhost:3000/api/courses/search?q=COMP
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "query": "COMP",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "COMP-2130",
      "name": "Data Structures",
      "credits": 4,
      // ... rest of course data
    },
    // ... more matching courses
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid query",
  "message": "Search query parameter 'q' is required"
}
```

---

## Architecture

### File Structure
```
backend/
  src/
    routes/
      courses.ts          - Route definitions
    controllers/
      courseController.ts - Business logic
    db/
      prisma.ts          - Prisma client instance
```

### Request Flow
```
Client Request
    ↓
Express Router (routes/courses.ts)
    ↓
Controller (controllers/courseController.ts)
    ↓
Prisma Client (db/prisma.ts)
    ↓
Database (PostgreSQL)
    ↓
Response (JSON)
```

### Separation of Concerns

**Routes (`routes/courses.ts`):**
- Define HTTP endpoints
- Map URLs to controller methods
- HTTP method specification (GET, POST, PUT, DELETE)

**Controller (`controllers/courseController.ts`):**
- Business logic
- Data validation
- Error handling
- Database operations via Prisma

**Prisma Client (`db/prisma.ts`):**
- Database connection management
- Single shared instance
- Type-safe database queries

---

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error category",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors, missing fields
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Duplicate course code
- `500 Internal Server Error` - Database/server errors

---

## Testing the API

### Using curl

**Get all courses:**
```bash
curl http://localhost:3000/api/courses
```

**Get single course:**
```bash
curl http://localhost:3000/api/courses/550e8400-e29b-41d4-a716-446655440000
```

**Create course:**
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "COMP-4002",
    "name": "Full-Stack Development",
    "credits": 3,
    "instructor": "Prof. Anderson",
    "semester": "Fall 2025"
  }'
```

**Update course:**
```bash
curl -X PUT http://localhost:3000/api/courses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "instructor": "Dr. Smith"
  }'
```

**Delete course:**
```bash
curl -X DELETE http://localhost:3000/api/courses/550e8400-e29b-41d4-a716-446655440000
```

**Search courses:**
```bash
curl "http://localhost:3000/api/courses/search?q=COMP"
```

### Using Postman

1. Import the endpoints into Postman
2. Set base URL: `http://localhost:3000/api/courses`
3. Test each endpoint with sample data
4. Verify response formats and status codes

---

## Integration with Frontend

The frontend `CourseRepository` (from Sprint 3) will be updated to call these endpoints:
```typescript
// frontend/src/repositories/CourseRepository.ts

async getAll(): Promise<Course[]> {
  const response = await fetch('http://localhost:3000/api/courses');
  const json = await response.json();
  return json.data;
}

async create(courseData: CreateCourseDto): Promise<Course> {
  const response = await fetch('http://localhost:3000/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  const json = await response.json();
  return json.data;
}

// ... other methods
```

---

## Acceptance Criteria Met

✅ **Set of routes created corresponding to front-end requests**
   - GET /api/courses
   - GET /api/courses/:id
   - POST /api/courses
   - PUT /api/courses/:id
   - DELETE /api/courses/:id
   - GET /api/courses/search

✅ **Routes pass request to corresponding Controller**
   - All routes in `routes/courses.ts` call controller methods

✅ **Controller gets data from Service**
   - Controller uses Prisma (acts as service layer for data operations)

✅ **Service sends requests to database via Prisma client**
   - All database operations use Prisma ORM

✅ **Routes respond to front-end requests appropriately**
   - All endpoints return proper JSON responses
   - HTTP status codes match operation results
   - Error handling for all failure scenarios

---

## Security Considerations

### Current Implementation
- No authentication required (all endpoints public)
- CORS restricted to frontend origin (`localhost:5173`)
- Input validation prevents injection attacks
- No sensitive data exposure in error messages

### Future Enhancements
- Add authentication middleware
- Implement authorization (role-based access)
- Rate limiting to prevent abuse
- Request logging for audit trail
- API versioning (e.g., `/api/v1/courses`)

---

## Performance Considerations

- Database queries use Prisma's optimized SQL generation
- Single Prisma client instance (connection pooling)
- Indexed fields in database (id, code)
- Sorting done at database level
- Search uses database-level text search

---

## Future Enhancements

1. **Pagination**
   - Add `?page=1&limit=20` support
   - Reduce load for large course lists

2. **Filtering**
   - Filter by semester: `?semester=Fall 2025`
   - Filter by credits: `?credits=3`
   - Filter by instructor: `?instructor=Dr. Smith`

3. **Sorting**
   - Allow custom sort: `?sort=name&order=desc`
   - Sort by credits, semester, instructor

4. **Bulk Operations**
   - POST /api/courses/bulk - Create multiple courses
   - DELETE /api/courses/bulk - Delete multiple courses

5. **Relationships**
   - Link to students (enrollments)
   - Link to assignments
   - Include related data in responses

---

## Changelog

**March 27, 2026** - Initial Implementation
- Created all CRUD endpoints
- Implemented validation logic
- Added search functionality
- Documented all endpoints
- Integration-ready for frontend