import type { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import * as svc from '../services/homeworkService';

function paramId(req: Request): string {
  const v = req.params.id;
  return Array.isArray(v) ? v[0] : v;
}

export const getAllPublic = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await svc.listPublic();
    return res.json(items);
  } catch (err) {
    next(err);
  }
};

export const getMine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const items = await svc.listByUser(userId);
    return res.json(items);
  } catch (err) {
    next(err);
  }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const created = await svc.create({ ...req.body, userId });
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const patch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const updated = await svc.update(paramId(req), userId, req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const ok = await svc.remove(paramId(req), userId);
    if (!ok) return res.status(404).json({ message: 'Not found' });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};