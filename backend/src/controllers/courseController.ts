import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

function paramId(req: Request): string {
  const v = req.params.id;
  return Array.isArray(v) ? v[0] : v;
}

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { code: 'asc' } });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = paramId(req);
    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, name, credits, instructor, semester, description } = req.body;

    if (!code || !name || credits === undefined) {
      return res.status(400).json({ success: false, error: 'code, name, and credits are required' });
    }

    if (!/^[A-Z]+-\d+$/.test(code)) {
      return res.status(400).json({ success: false, error: 'Course code must be in format DEPT-NUMBER (e.g. COMP-4002)' });
    }

    if (credits < 1 || credits > 6) {
      return res.status(400).json({ success: false, error: 'Credits must be between 1 and 6' });
    }

    if (name.length < 3) {
      return res.status(400).json({ success: false, error: 'Course name must be at least 3 characters' });
    }

    const existing = await prisma.course.findUnique({ where: { code } });
    if (existing) {
      return res.status(409).json({ success: false, error: `Course with code ${code} already exists` });
    }

    const course = await prisma.course.create({
      data: {
        code,
        name,
        credits,
        instructor: instructor || null,
        semester: semester || null,
        description: description || null,
      },
    });

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = paramId(req);
    const { code, name, credits, instructor, semester, description } = req.body;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    if (code && !/^[A-Z]+-\d+$/.test(code)) {
      return res.status(400).json({ success: false, error: 'Course code must be in format DEPT-NUMBER (e.g. COMP-4002)' });
    }

    if (code && code !== existing.code) {
      const duplicate = await prisma.course.findUnique({ where: { code } });
      if (duplicate) {
        return res.status(409).json({ success: false, error: `Course with code ${code} already exists` });
      }
    }

    if (credits !== undefined && (credits < 1 || credits > 6)) {
      return res.status(400).json({ success: false, error: 'Credits must be between 1 and 6' });
    }

    if (name && name.length < 3) {
      return res.status(400).json({ success: false, error: 'Course name must be at least 3 characters' });
    }

    const updateData: Record<string, unknown> = {};
    if (code !== undefined) updateData.code = code;
    if (name !== undefined) updateData.name = name;
    if (credits !== undefined) updateData.credits = credits;
    if (instructor !== undefined) updateData.instructor = instructor || null;
    if (semester !== undefined) updateData.semester = semester || null;
    if (description !== undefined) updateData.description = description || null;

    const updated = await prisma.course.update({ where: { id }, data: updateData });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = paramId(req);

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    await prisma.course.delete({ where: { id } });
    res.json({ success: true, data: existing });
  } catch (err) {
    next(err);
  }
};

export const searchCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: 'Search query parameter "q" is required' });
    }

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { code: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { code: 'asc' },
    });

    res.json({ success: true, count: courses.length, query: q, data: courses });
  } catch (err) {
    next(err);
  }
};
