# Course Database Schema Documentation

**Implemented by:** Muniru Adam  
**Sprint:** 4  
**Requirement:** I.2 - Resource Database Schema (P1)  
**Date:** April 2026

---

## Overview

This document describes the Course database schema implemented using Prisma ORM for the Student Tracker application.

---

## Course Model

### Purpose
Stores information about courses that students are enrolled in or tracking.

### Location
`backend/prisma/schema.prisma`

### Schema Definition

```prisma
model Course {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  credits     Int
  instructor  String?
  semester    String?
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("courses")
}
```

---

## Field Descriptions

### `id` (String, Primary Key)
- **Type:** UUID (Universally Unique Identifier)
- **Auto-generated:** Yes, using `uuid()` function
- **Purpose:** Unique identifier for each course
- **Example:** `"550e8400-e29b-41d4-a716-446655440000"`

### `code` (String, Unique)
- **Type:** String
- **Unique Constraint:** Yes - no two courses can have the same code
- **Required:** Yes
- **Purpose:** Course code used by the institution
- **Format:** `DEPT-NUMBER` (e.g., "COMP-4002", "MATH-2150")
- **Validation:** Enforced at application level (in courseController)

### `name` (String)
- **Type:** String
- **Required:** Yes
- **Purpose:** Full name of the course
- **Example:** "Full-Stack Development", "Internet of Things"

### `credits` (Integer)
- **Type:** Integer
- **Required:** Yes
- **Purpose:** Number of academic credits the course is worth
- **Valid Range:** 1-6 (enforced at application level)
- **Example:** 3, 4

### `instructor` (String, Optional)
- **Type:** String
- **Required:** No (nullable)
- **Purpose:** Name of the course instructor/professor
- **Example:** "Prof. Anderson", "Dr. Chen"

### `semester` (String, Optional)
- **Type:** String
- **Required:** No (nullable)
- **Purpose:** The semester/term when the course is offered
- **Example:** "Fall 2025", "Winter 2026", "Spring 2026"

### `description` (String, Optional)
- **Type:** String
- **Required:** No (nullable)
- **Purpose:** Brief description of what the course covers
- **Example:** "Learn to build complete web applications using modern frameworks"

### `createdAt` (DateTime)
- **Type:** DateTime
- **Auto-generated:** Yes, defaults to current timestamp
- **Purpose:** Records when the course was added to the system
- **Example:** `2026-04-11T18:00:58.724Z`

### `updatedAt` (DateTime)
- **Type:** DateTime
- **Auto-updated:** Yes, updates automatically on any change
- **Purpose:** Records the last time the course was modified
- **Example:** `2026-04-11T20:15:30.182Z`

---

## Database Table

### Table Name
`courses` (specified by `@@map("courses")`)

### Indexes
- **Primary Key:** `id` field
- **Unique Index:** `code` field (prevents duplicate course codes)

---

## Third Normal Form (3NF) Compliance

The Course schema adheres to Third Normal Form:

### 1NF (First Normal Form) ✅
- All fields contain atomic (indivisible) values
- No repeating groups or arrays
- Each field contains only one value

### 2NF (Second Normal Form) ✅
- Table has a primary key (`id`)
- All non-key fields depend on the entire primary key
- No partial dependencies (all fields relate to the course)

### 3NF (Third Normal Form) ✅
- No transitive dependencies
- All non-key fields depend directly on the primary key
- No field depends on another non-key field

**Example of 3NF compliance:**
- `instructor` depends on `id` (this course's instructor)
- `credits` depends on `id` (this course's credit value)
- No field like "instructor's department" that would depend on `instructor` rather than `id`

---

## Design Decisions

### Why UUID for ID?
- **Globally Unique:** No collisions even across different databases
- **Security:** Harder to guess than sequential integers
- **Distribution:** Works well in distributed systems

### Why Unique Constraint on Code?
- **Business Rule:** Course codes must be unique in the system
- **Data Integrity:** Prevents duplicate courses
- **User Experience:** Users identify courses by code

### Why Optional Fields?
- **Flexibility:** Not all courses may have instructors assigned yet
- **Gradual Data Entry:** Users can add basic info first, details later
- **Real-World Modeling:** Some information may not always be available

### Why Timestamps?
- **Audit Trail:** Know when courses were added/modified
- **Debugging:** Helps troubleshoot data issues
- **Features:** Can show "recently added" or sort by creation date

---

## Acceptance Criteria Met

✅ **Prisma schema defines at least one new model**
   - Course model defined in schema.prisma

✅ **Database conforms to Third Normal Form**
   - No repeating groups (1NF)
   - No partial dependencies (2NF)
   - No transitive dependencies (3NF)

✅ **Migrations defined to include the table**
   - Migration ready to be created when database is running

---

## Future Enhancements

### Possible Additions

1. **Relationships**
   - Link to Student model (enrollment)
   - Link to Assignment model
   - Link to Grade model

2. **Additional Fields**
   - `departmentId` - Link to Department
   - `prerequisiteIds` - Array of prerequisite course IDs
   - `capacity` - Maximum students
   - `enrolledCount` - Current enrollment

3. **Soft Deletes**
   - Add `deletedAt` field for soft delete functionality
   - Keep historical data

---

## References

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Database Normalization](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description)