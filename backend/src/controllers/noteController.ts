import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../services/noteService";

function paramId(req: Request): string {
  const v = req.params.id;
  return Array.isArray(v) ? v[0] : v;
}

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const notes = await getAllNotes(userId!);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const note = await getNoteById(paramId(req), userId!);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const { courseId, title, body, pinned } = req.body;
    const newNote = await createNote({ courseId, title, body, pinned, userId: userId! });
    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
};

export const editNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const updatedNote = await updateNote(paramId(req), userId!, req.body);
    if (!updatedNote) return res.status(404).json({ error: "Note not found" });
    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
};

export const removeNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const removed = await deleteNote(paramId(req), userId!);
    if (!removed) return res.status(404).json({ error: "Note not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
