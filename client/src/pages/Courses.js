import React, { useEffect, useState } from 'react';
import './Courses.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div className="courses-container">
      <h1>My Courses</h1>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <h3>{course.courseName}</h3>
            <p className="course-code">{course.courseCode}</p>
            <p className="course-info">
              <strong>Credits:</strong> {course.credits}
            </p>
            <p className="course-info">
              <strong>Semester:</strong> {course.semester}
            </p>
            <p className="course-info">
              <strong>Schedule:</strong> {course.schedule?.time || 'N/A'}
            </p>
            <button className="btn-outline">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
