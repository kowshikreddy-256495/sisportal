import React, { useEffect, useState } from 'react';
import './Grades.css';

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudentAndGrades();
  }, []);

  const fetchStudentAndGrades = async () => {
    try {
      const studentRes = await fetch('http://localhost:5000/api/students/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      setStudent(studentData);

      const gradesRes = await fetch(`http://localhost:5000/api/grades/student/${studentData._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const gradesData = await gradesRes.json();
      setGrades(gradesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading grades...</div>;

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const avg = grades.reduce((sum, g) => sum + parseFloat(g.totalGrade), 0) / grades.length;
    return (avg / 25).toFixed(2);
  };

  return (
    <div className="grades-container">
      <h1>My Grades</h1>
      <div className="gpa-card">
        <h2>Current GPA: {calculateGPA()}</h2>
      </div>
      <table className="grades-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Assignment</th>
            <th>Midterm</th>
            <th>Final</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade._id}>
              <td>{grade.course?.courseName || 'N/A'}</td>
              <td>{grade.assignmentGrade}</td>
              <td>{grade.midtermGrade}</td>
              <td>{grade.finalGrade}</td>
              <td>{grade.totalGrade}</td>
              <td className={`grade-${grade.gradePoint}`}>{grade.gradePoint}</td>
              <td>{grade.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
