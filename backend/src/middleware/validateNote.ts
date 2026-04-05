import { NextFunction, Request, Response } from "express";

const createNoteSchema = {
  requiredFields: ["courseId", "title", "body"],
};

const updateNoteSchema = {
  allowedFields: ["courseId", "title", "body", "pinned"],
};

export function validateNoteId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Valid note id is required" });
  }

  next();
}

export function validateCreateNote(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { courseId, title, body, pinned } = req.body;

  for (const field of createNoteSchema.requiredFields) {
    if (!req.body[field] || typeof req.body[field] !== "string") {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  if (!courseId.trim() || !title.trim() || !body.trim()) {
    return res.status(400).json({ error: "courseId, title, and body are required" });
  }

  if (pinned !== undefined && typeof pinned !== "boolean") {
    return res.status(400).json({ error: "pinned must be a boolean" });
  }

  next();
}

export function validateUpdateNote(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { courseId, title, body, pinned } = req.body;

  const hasAllowedField = updateNoteSchema.allowedFields.some(
    (field) => field in req.body,
  );

  if (!hasAllowedField) {
    return res.status(400).json({ error: "At least one valid field is required" });
  }

  if (courseId !== undefined && (typeof courseId !== "string" || !courseId.trim())) {
    return res.status(400).json({ error: "courseId must be a non-empty string" });
  }

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    return res.status(400).json({ error: "title must be a non-empty string" });
  }

  if (body !== undefined && (typeof body !== "string" || !body.trim())) {
    return res.status(400).json({ error: "body must be a non-empty string" });
  }

  if (pinned !== undefined && typeof pinned !== "boolean") {
    return res.status(400).json({ error: "pinned must be a boolean" });
  }

  next();
}