import { Request, Response } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../services/noteService";

function getParamId(req: Request) {
  const value = req.params.id;

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export const getNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const getNote = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({ error: "Valid note id is required" });
    }

    const note = await getNoteById(id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch {
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

export const addNote = async (req: Request, res: Response) => {
  try {
    const { courseId, title, body, pinned } = req.body;

    const newNote = await createNote({
      courseId,
      title,
      body,
      pinned,
    });

    res.status(201).json(newNote);
  } catch {
    res.status(500).json({ error: "Failed to create note" });
  }
};

export const editNote = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({ error: "Valid note id is required" });
    }

    const updatedNote = await updateNote(id, req.body);

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch {
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const removeNote = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({ error: "Valid note id is required" });
    }

    const removed = await deleteNote(id);

    if (!removed) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete note" });
  }
};