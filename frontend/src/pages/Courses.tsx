import { useState } from 'react';
import type { SharedCourseProps } from '../App';
import CourseSelector from '../components/CourseSelector';
import { useCourses } from '../hooks/useCourses';
import type { CreateCourseDto } from '../types/Course';
import './Courses.css';

export default function Courses({ activeCourse, setActiveCourse }: SharedCourseProps) {
  const { courses, loading, error, createCourse, deleteCourse } = useCourses();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 3,
    instructor: '',
    semester: 'Fall 2025',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCourse = await createCourse(formData as CreateCourseDto);

    if (newCourse) {
      setFormData({
        code: '',
        name: '',
        credits: 3,
        instructor: '',
        semester: 'Fall 2025',
        description: ''
      });
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };

  return (
    <div className="courses-page">
      <h2>Courses</h2>
      <p>Manage your enrolled courses.</p>

      <CourseSelector
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
        showQuickButtons={true}
      />

      <hr />

      {/* Display error if any */}
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Add Course Button */}
      <div className="courses-actions">
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Course'}
        </button>
      </div>

      {/* Add Course Form */}
      {showForm && (
        <div className="course-form-container">
          <h3>Add New Course</h3>
          <form onSubmit={handleSubmit} className="course-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="code">Course Code *</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., COMP-4002"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="credits">Credits *</label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  min="1"
                  max="6"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Course Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Full-Stack Development"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="instructor">Instructor</label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g., Prof. Smith"
                />
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester</label>
                <input
                  type="text"
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  placeholder="e.g., Fall 2025"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief course description"
                rows={3}
              />
            </div>

            <button type="submit" className="btn-submit">
              Add Course
            </button>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && <p className="loading">Loading courses...</p>}

      {/* Course List */}
      {!loading && courses.length === 0 && (
        <p className="no-courses">No courses yet. Add your first course above!</p>
      )}

      {!loading && courses.length > 0 && (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-card-header">
                <h3>{course.code}</h3>
                <span className="course-credits">{course.credits} credits</span>
              </div>
              <h4>{course.name}</h4>
              {course.instructor && (
                <p className="course-instructor">👨‍🏫 {course.instructor}</p>
              )}
              {course.semester && (
                <p className="course-semester">📅 {course.semester}</p>
              )}
              {course.description && (
                <p className="course-description">{course.description}</p>
              )}
              <button
                className="btn-delete"
                onClick={() => handleDelete(course.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="courses-summary">
        <p><strong>Total Courses:</strong> {courses.length}</p>
        <p><strong>Total Credits:</strong> {courses.reduce((sum, c) => sum + c.credits, 0)}</p>
      </div>
    </div>
  );
}