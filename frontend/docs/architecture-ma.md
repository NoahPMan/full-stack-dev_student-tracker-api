# Architecture Documentation - Muniru Adam (MA)

This document describes the hook-service-repository architecture implemented for course 
management in the Student Tracker Application.

---

## Custom Hook: `useCourses`

### 1. What does this hook do?

The `useCourses` hook provides a reusable way for React components to interact with course data. 
It manages all presentation logic related to courses, including:

- Loading course data from the service
- Managing loading and error states for the UI
- Providing functions to create, update, delete, and search courses
- Automatically updating the UI when course data changes

### 2. How did you decide what logic to include in that implementaion, and how does it separate solutio concerns?

**Decision Process:**

I included logic that relates to **presenting** data to the user and **handling UI state**. This includes:
- Loading states that showing  "loading" messages
- Error handling, displaying error messages to users
- Immediate UI updates after CRUD operations

**Separation of Concerns:**

- **What it does:** Manages React state (`useState`, `useEffect`) for courses, loading, and errors
- **What it doesn't do:** Doesn't know HOW courses are validated, sorted, or stored
- **Why:** This makes the hook reusable in any component that needs course data, regardless of business rules or data source

### 3. Where is this implementation made use of in the project and how?

**Location:** `src/hooks/useCourses.ts`

**Used in:**
- `src/pages/Courses.tsx` - Main courses management page

**Example Usage:**
```tsx
const { courses, loading, error, createCourse, deleteCourse } = useCourses();

// Display loading state
if (loading) return <p>Loading...</p>;

// Display courses
courses.map(course => <CourseCard course={course} />)

// Create a new course
await createCourse({ code: 'COMP-4002', name: 'Full-Stack Dev', credits: 3 });
```

The hook abstracts away all the complexity of data fetching, state management, and error handling, 
making components simpler and more focused on rendering UI.

---

## Service: `CourseService`

### 1. What does this service do?

The `CourseService` handles all business logic related to courses:

- Validates course data before creating or updating (e.g., course code format, credit limits)
- Enforces business rules (e.g., no duplicate course codes)
- Sorts courses alphabetically by code
- Filters courses by semester
- Calculates aggregate data (e.g., total credits)

### 2. How did you decide what logic to include, and how does it separate concerns?

**Decision Process:**

I included logic that represents *business rules* and *domain knowledge*:
- Validation rules that make sure course codes must match a specific format
- Business constraints (credits must be 1-6, no duplicate codes)
- Data transformations (sorting, filtering, calculations)

**Separation of Concerns:**

- **What it does:** Validates and transforms business rules
- **What it doesn't do:** Doesn't know WHERE data comes from (repository) or HOW it's displayed (hook/component)
- **Why:** Business logic changes independently of data sources or UI. For example, if validation rules change, 
we only update the service.

### 3. Where is this service used and how?

**Location:** `src/services/CourseService.ts`

**Used in:**
- `src/hooks/useCourses.ts` - Called by the hook to enforce business logic

**Example**
```tsx
// Hook calls service methods
const courses = await courseService.getAllCourses();  // Returns sorted courses
const newCourse = await courseService.createCourse(data);  // Validates before creating
```

The service acts as a "gatekeeper" - all course operations go through it, ensuring business rules are consistently applied across the entire application.

---

## Repository: `CourseRepository`

### 1. What does this repository do?

The `CourseRepository` handles all data access for courses:

- Performs CRUD operations (Create, Read, Update, Delete)
- Currently uses test data (array of course objects)
- Simulates async operations (uses setTimeout to mimic API calls)
- Will be updated to use real API calls in the next module

### 2. How did you decide what logic to include, and how does it separate concerns?

**Decision Process:**

I included logic that deals with **data access only**:
- Fetching data from storage (currently test data array)
- Saving new data
- Updating existing data
- Deleting data
- Basic search operations

I specifically **excluded**:
- Validation logic (handled by CourseService)
- Sorting and filtering (handled by CourseService)
- UI state management (handled by useCourses hook)

**Separation of Concerns:**

- **What it does:** CRUD operations, data persistence simulation
- **What it doesn't do:** Doesn't validate, sort, or filter data; doesn't manage UI state
- **Why:** When we switch from test data to a real API, we only change the repository. The service and hook don't need to know or care where data comes from.

### 3. Where is this repository used and how?

**Location:** `src/repositories/CourseRepository.ts`

**Used in:**
- `src/services/CourseService.ts` - Service calls repository methods

**Example**
```tsx
// Service calls repository
const courses = await courseRepository.getAll();
const newCourse = await courseRepository.create(courseData);
```

**Data Flow:**
```
Component → useCourses Hook → CourseService → CourseRepository → Test Data
```

The repository is the **only** place that knows about data storage. This makes it easy to switch from test data to a real database or API without changing any other code.