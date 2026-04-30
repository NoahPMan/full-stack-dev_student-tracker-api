import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

function paramId(req: Request): string {
  const v = req.params.id;
  return Array.isArray(v) ? v[0] : v;
}

function userId(req: Request): string {
  if (!req.userId) {
    // requireAuth should prevent this
    throw new Error('Unauthorized');
  }
  return req.userId;
}

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = userId(req);
    const courses = await prisma.course.findMany({
      where: { userId: uid },
      orderBy: { code: 'asc' },
    });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = userId(req);
    const id = paramId(req);

    const course = await prisma.course.findFirst({ where: { id, userId: uid } });

    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = userId(req);
    const { code, name, credits, instructor, semester, description } = req.body ?? {};

    const cleanCode = String(code ?? '').trim();
    const cleanName = String(name ?? '').trim();

    if (!cleanCode || !cleanName) {
      return res.status(400).json({ success: false, error: 'code and name are required' });
    }

    // credits optional now
    const parsedCredits =
      credits === undefined || credits === null || credits === ''
        ? null
        : Number(credits);

    if (parsedCredits !== null && (Number.isNaN(parsedCredits) || parsedCredits < 0 || parsedCredits > 30)) {
      return res.status(400).json({ success: false, error: 'Credits must be a valid number (0-30)' });
    }

    if (cleanName.length < 3) {
      return res.status(400).json({ success: false, error: 'Course name must be at least 3 characters' });
    }

    // unique per user (userId, code)
    const existing = await prisma.course.findUnique({
      where: { userId_code: { userId: uid, code: cleanCode } },
    });

    if (existing) {
      return res.status(409).json({ success: false, error: `Course with code ${cleanCode} already exists` });
    }

    const course = await prisma.course.create({
      data: {
        userId: uid,
        code: cleanCode,
        name: cleanName,
        credits: parsedCredits,
        instructor: instructor ? String(instructor).trim() : null,
        semester: semester ? String(semester).trim() : null,
        description: description ? String(description).trim() : null,
      },
    });

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = userId(req);
    const id = paramId(req);

    const existing = await prisma.course.findFirst({ where: { id, userId: uid } });
    if (!existing) return res.status(404).json({ success: false, error: 'Course not found' });

    const { code, name, credits, instructor, semester, description } = req.body ?? {};
    const updateData: Record<string, unknown> = {};

    if (code !== undefined) {
      const cleanCode = String(code).trim();
      if (!cleanCode) return res.status(400).json({ success: false, error: 'code cannot be empty' });

      if (cleanCode !== existing.code) {
        const dup = await prisma.course.findUnique({
          where: { userId_code: { userId: uid, code: cleanCode } },
        });
        if (dup) {
          return res.status(409).json({ success: false, error: `Course with code ${cleanCode} already exists` });
        }
      }
      updateData.code = cleanCode;
    }

    if (name !== undefined) {
      const cleanName = String(name).trim();
      if (cleanName.length < 3) return res.status(400).json({ success: false, error: 'Course name must be at least 3 characters' });
      updateData.name = cleanName;
    }

    if (credits !== undefined) {
      const parsedCredits = credits === null || credits === '' ? null : Number(credits);
      if (parsedCredits !== null && (Number.isNaN(parsedCredits) || parsedCredits < 0 || parsedCredits > 30)) {
        return res.status(400).json({ success: false, error: 'Credits must be a valid number (0-30)' });
      }
      updateData.credits = parsedCredits;
    }

    if (instructor !== undefined) updateData.instructor = instructor ? String(instructor).trim() : null;
    if (semester !== undefined) updateData.semester = semester ? String(semester).trim() : null;
    if (description !== undefined) updateData.description = description ? String(description).trim() : null;

    const updated = await prisma.course.update({ where: { id }, data: updateData });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// for the delete confirmation modal
export const getCourseSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = userId(req);
    const id = paramId(req);

    const course = await prisma.course.findFirst({ where: { id, userId: uid }, select: { id: true } });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

    const [assignmentsCount, notesCount] = await Promise.all([
      prisma.homework.count({ where: { userId: uid, courseId: id } }),
      prisma.note.count({ where: { userId: uid, courseId: id } }),
    ]);

    res.json({ success: true, data: { assignmentsCount, notesCount } });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = userId(req);
    const id = paramId(req);

    const existing = await prisma.course.findFirst({ where: { id, userId: uid } });
    if (!existing) return res.status(404).json({ success: false, error: 'Course not found' });

    // delete course but keep content by unassigning it
    await prisma.$transaction(async (tx) => {
      await tx.homework.updateMany({
        where: { userId: uid, courseId: id },
        data: { courseId: null },
      });

      await tx.note.updateMany({
        where: { userId: uid, courseId: id },
        data: { courseId: null },
      });

      await tx.course.delete({ where: { id } });
    });

    res.json({ success: true, data: existing });
  } catch (err) {
    next(err);
  }
};

export const searchCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = userId(req);
    const q = String(req.query.q ?? '').trim();

    if (!q) return res.status(400).json({ success: false, error: 'Search query parameter "q" is required' });

    const courses = await prisma.course.findMany({
      where: {
        userId: uid,
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