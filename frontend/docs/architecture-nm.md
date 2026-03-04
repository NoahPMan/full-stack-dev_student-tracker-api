# Sprint 3 Architecture (NM)

## Overview

This sprint follows the Module-3 layering:
**Component → Hook (presentation) → Service (business rules) → Repository (data)**.
Shared cross-page UI state (selected course) lives in **Context**. No domain/external data is stored in Context.

## Layers & Responsibilities

- **Context (UI-only):** `src/context/CourseContext.tsx`
  - Holds `selectedCourseId` and a setter only.
- **Hooks (presentation):**
  - `src/hooks/useHomework.ts` — page/UI state (loading/error/filters) and calls the service.
  - `src/hooks/useHomeworkCounts.ts` — summary counts; invoked from the Assignments page to exercise the chain.
  - `src/hooks/useFormField.ts` — small input hook reused across forms.
- **Services (business rules):**
  - `src/services/homeworkService.ts` — filter, sort, status changes, add/remove; no fetch/UI logic.
- **Repositories (data access):**
  - `src/repositories/homeworkRepository.ts` — CRUD over in-memory test data.
  - Test data: `src/data/homework.testdata.ts` (typed).
- **Types:** `src/types/Homework.ts`, `src/types/Note.ts`.

## Example Flow (Homework)

Assignments page → **`useHomeworkCounts`** → **`homeworkService`** → **`homeworkRepository`** → **`homework.testdata.ts`**  
_(The page does not render counts; the hook is invoked to exercise the chain.)_

## Why this separation?

- **Hooks** keep presentation concerns reusable and testable.
- **Services** centralize business rules (filter/sort/status/add/remove).
- **Repositories** isolate the data source (today: local arrays; later: API) without changing upper layers.
- **Context** is limited to UI-only shared state (selected course), per course guidance.

## Files in this repo (by layer)

- Context: `context/CourseContext.tsx`
- Hooks: `hooks/useHomework.ts`, `hooks/useHomeworkCounts.ts`, `hooks/useFormField.ts`
- Services: `services/homeworkService.ts`
- Repositories: `repositories/homeworkRepository.ts`
- Test data: `data/homework.testdata.ts`
- Types: `types/Homework.ts`, `types/Note.ts`
- Example page that exercises the chain: `pages/Assignments.tsx`

## Evidence in Code (I.3)

On-line “Chain” comments at the top of:

- `pages/Assignments.tsx`
- `hooks/useHomework.ts` (and `useHomeworkCounts.ts`)
- `services/homeworkService.ts`
- `repositories/homeworkRepository.ts`

## Run / Build

```bash
npm install
npm run dev
npx tsc -p tsconfig.app.json --noEmit
npm run build
```
