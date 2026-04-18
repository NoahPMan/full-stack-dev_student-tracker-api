import type { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import * as svc from '../services/homeworkService';

function paramId(req: Request): string {
  const v = req.params.id;
  return Array.isArray(v) ? v[0] : v;
}

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const items = await svc.list(userId!);
    return res.json(items);
  } catch (err) {
    next(err);
  }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const created = await svc.create({ ...req.body, userId: userId! });
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const patch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const updated = await svc.update(paramId(req), userId!, req.body);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    await svc.remove(paramId(req), userId!);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
