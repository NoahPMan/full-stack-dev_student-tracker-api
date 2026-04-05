import { z } from 'zod';

// Accept either an ISO string, or a yyyy-mm-dd from a <input type="date">,
// and normalize everything to an ISO string for the service/DB.
const dateString = z
  .union([
    z.string().datetime(),                              // ISO: "2026-01-20T00:00:00.000Z"
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use yyyy-mm-dd'), // "2026-01-20"
  ])
  .transform((v) => (v.length === 10 ? `${v}T00:00:00.000Z` : v));

const statusEnum = z.enum(['todo', 'in_progress', 'done']);

export const createHomeworkSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  courseId: z.string().trim().min(1, 'Course ID is required'),
  dueDate: dateString,              // normalized to ISO string
  status: statusEnum.optional().default('todo'),
});

export const updateHomeworkSchema = createHomeworkSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' },
  );