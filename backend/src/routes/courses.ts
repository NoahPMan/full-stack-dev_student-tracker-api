import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses
} from '../controllers/courseController';

/**
 * Course Routes
 * 
 * Sprint 4 - Individual Requirement I.1
 * Implemented by: Muniru Adam
 * 
 * Defines all API endpoints for course management.
 * Routes pass requests to corresponding controller methods.
 */

const router = Router();

/**
 * @route   GET /api/courses/search
 * @desc    Search courses by code or name
 * @access  Public
 * @query   q - search query string
 * @example GET /api/courses/search?q=COMP
 */
router.get('/search', searchCourses);

/**
 * @route   GET /api/courses
 * @desc    Get all courses
 * @access  Public
 * @returns Array of course objects
 * @example GET /api/courses
 */
router.get('/', getAllCourses);

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course by ID
 * @access  Public
 * @param   id - Course ID (UUID)
 * @example GET /api/courses/550e8400-e29b-41d4-a716-446655440000
 */
router.get('/:id', getCourseById);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Public
 * @body    { code, name, credits, instructor?, semester?, description? }
 * @example POST /api/courses
 *          Body: {
 *            "code": "COMP-4002",
 *            "name": "Full-Stack Development",
 *            "credits": 3,
 *            "instructor": "Prof. Anderson",
 *            "semester": "Fall 2025"
 *          }
 */
router.post('/', createCourse);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update an existing course
 * @access  Public
 * @param   id - Course ID (UUID)
 * @body    Any combination of: { code?, name?, credits?, instructor?, semester?, description? }
 * @example PUT /api/courses/550e8400-e29b-41d4-a716-446655440000
 *          Body: { "instructor": "Dr. Smith" }
 */
router.put('/:id', updateCourse);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course
 * @access  Public
 * @param   id - Course ID (UUID)
 * @example DELETE /api/courses/550e8400-e29b-41d4-a716-446655440000
 */
router.delete('/:id', deleteCourse);

export default router;