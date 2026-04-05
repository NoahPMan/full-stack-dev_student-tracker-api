import type { Request, Response } from 'express';
import * as svc from '../services/homeworkService';

// Shape of route params for /:id
type IdParam = { id: string };

export const getAll = async (_req: Request, res: Response) => {
  const items = await svc.list();
  return res.json(items);
};

export const post = async (req: Request, res: Response) => {
  const created = await svc.create(req.body);
  return res.status(201).json(created);
};

export const patch = async (req: Request<IdParam>, res: Response) => {
  const { id } = req.params;
  const updated = await svc.update(id, req.body);
  return res.json(updated);
};

export const del = async (req: Request<IdParam>, res: Response) => {
  const { id } = req.params;
  await svc.remove(id);
  return res.status(204).end();
};