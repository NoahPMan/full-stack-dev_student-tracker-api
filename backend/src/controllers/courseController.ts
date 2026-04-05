import { Request, Response } from 'express';
import { prisma } from '../db/prisma';


export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        code: 'asc'
      }
    });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        message: `No course found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { code, name, credits, instructor, semester, description } = req.body;

    if (!code || !name || credits === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Missing required fields: code, name, and credits are required'
      });
    }

    const codePattern = /^[A-Z]+-\d+$/;
    if (!codePattern.test(code)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Course code must be in format: DEPT-NUMBER (e.g., COMP-4002)'
      });
    }

    if (credits < 1 || credits > 6) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Credits must be between 1 and 6'
      });
    }

    if (name.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Course name must be at least 3 characters'
      });
    }

    const existingCourse = await prisma.course.findUnique({
      where: { code }
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate course code',
        message: `Course with code ${code} already exists`
      });
    }

    const course = await prisma.course.create({
      data: {
        code,
        name,
        credits,
        instructor: instructor || null,
        semester: semester || null,
        description: description || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate course code',
        message: 'A course with this code already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create course',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, credits, instructor, semester, description } = req.body;

    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        message: `No course found with ID: ${id}`
      });
    }

    if (code) {
      const codePattern = /^[A-Z]+-\d+$/;
      if (!codePattern.test(code)) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Course code must be in format: DEPT-NUMBER (e.g., COMP-4002)'
        });
      }

      if (code !== existingCourse.code) {
        const duplicateCourse = await prisma.course.findUnique({
          where: { code }
        });

        if (duplicateCourse) {
          return res.status(409).json({
            success: false,
            error: 'Duplicate course code',
            message: `Course with code ${code} already exists`
          });
        }
      }
    }

    if (credits !== undefined && (credits < 1 || credits > 6)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Credits must be between 1 and 6'
      });
    }

    if (name && name.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Course name must be at least 3 characters'
      });
    }

    const updateData: any = {};
    if (code !== undefined) updateData.code = code;
    if (name !== undefined) updateData.name = name;
    if (credits !== undefined) updateData.credits = credits;
    if (instructor !== undefined) updateData.instructor = instructor || null;
    if (semester !== undefined) updateData.semester = semester || null;
    if (description !== undefined) updateData.description = description || null;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update course',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        message: `No course found with ID: ${id}`
      });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: existingCourse
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete course',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchCourses = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid query',
        message: 'Search query parameter "q" is required'
      });
    }

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          {
            code: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            name: {
              contains: q,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        code: 'asc'
      }
    });

    res.json({
      success: true,
      count: courses.length,
      query: q,
      data: courses
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search courses',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};