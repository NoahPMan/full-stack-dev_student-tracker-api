## 1. notesRepository (Data Layer)

File: src/repositories/notesRepository.ts

### What does it do?

The notesRepository defines the basic CRUD operations for Notes:

- list()
- get(id)
- create()
- update(id, patch)
- remove(id)

It is backed by in-memory test data imported from:

src/data/notes.testdata.ts

Right now, this simulates an external resource. In a future module, this repository could call a real backend API instead.

### Why is the logic here?

All direct data access should live in one place.

The UI and service layers should not care where the data comes from. By isolating CRUD logic in the repository:

- We keep components clean.
- We avoid duplicating data logic.
- We make it easy to swap test data for a real backend later.

### Where is it used?

The repository is only used inside:

src/services/notesService.ts

No UI component calls the repository directly.

---

## 2. notesService (Business Layer)

File: src/services/notesService.ts

### What does it do?

The notesService contains the business rules for Notes.

It handles:

- Fetching all notes from the repository
- Filtering notes by selected course
- Sorting notes (pinned first, then newest first)
- Delegating add, remove, and togglePin operations to the repository

### Why is the logic here?

Filtering and sorting are business rules, not UI concerns.

If this logic lived inside components, the UI would become harder to read and maintain. By placing it in the service:

- The rules are centralized.
- The hook stays simpler.
- The UI only focuses on rendering.

### Where is it used?

The service functions are imported and used inside:

src/hooks/useNotes.ts

The hook calls:

- fetchAllNotes()
- filterAndSortNotes()
- addNote()
- removeNote()
- togglePin()

---

## 3. useNotes (Presentation Hook)

File: src/hooks/useNotes.ts

### What does it do?

The useNotes hook connects the Notes UI to the service layer.

It:

- Loads notes on component mount
- Manages loading state
- Manages error state
- Filters notes based on the selected course
- Exposes simple actions: add, remove, togglePin

This makes it easy for the page component to use Notes without handling async logic directly.

### Why is the logic here?

The hook acts as a bridge between UI and business logic.

Instead of putting async data fetching and state management in the page component, the hook:

- Keeps Notes.tsx clean
- Centralizes Notes state logic
- Makes the feature easier to reuse or extend later

### Where is it used?

The hook is used inside:

src/pages/Notes.tsx

In that file, we call:

useNotes({ courseId: selectedCourseId })

The returned values are then passed into:

- NoteForm (for adding notes)
- NoteList (for displaying, removing, and pinning notes)

---

## 4. Notes Page (UI Layer)

File: src/pages/Notes.tsx

The Notes page is responsible only for:

- Rendering the layout
- Reading the selected course from CourseContext
- Calling useNotes()
- Passing data and actions to child components

It does not:

- Fetch data directly
- Filter or sort notes
- Call the repository

This keeps UI responsibilities separate from data and business logic.

---

## Overall Architecture Flow

The full chain looks like this:

Notes.tsx  
→ useNotes (hook)  
→ notesService (business rules)  
→ notesRepository (data access using test data)

This separation ensures:

- The UI does not depend on data storage details.
- Business rules are not mixed into components.
- The repository can later be replaced with real API calls without rewriting the UI.

This structure supports cleaner code organization and prepares the project for future backend integration.