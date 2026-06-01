import React, { useEffect, useState } from 'react';
import './Attendance.css';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const studentRes = await fetch('http://localhost:5000/api/students/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      setStudent(studentData);

      const attendanceRes = await fetch(`http://localhost:5000/api/attendance/student/${studentData._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const attendanceData = await attendanceRes.json();
      setAttendance(attendanceData);

      // Calculate stats for first course
      if (studentData.enrolledCourses.length > 0) {
        const statsRes = await fetch(
          `http://localhost:5000/api/attendance/${studentData._id}/${studentData.enrolledCourses[0]}/percentage`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading attendance...</div>;

  return (
    <div className="attendance-container">
      <h1>My Attendance</h1>
      
      <div className="stats-section">
        <div className="stat-box">
          <h3>Overall Attendance</h3>
          <div className="percentage">{stats.percentage || 0}%</div>
        </div>
        <div className="stat-box">
          <h3>Present Days</h3>
          <div className="number">{stats.present || 0}</div>
        </div>
        <div className="stat-box">
          <h3>Absent Days</h3>
          <div className="number">{stats.absent || 0}</div>
        </div>
        <div className="stat-box">
          <h3>Total Classes</h3>
          <div className="number">{stats.total || 0}</div>
        </div>
      </div>

      <div className="attendance-list">
        <h2>Attendance Details</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Date</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td>{record.course?.courseName || 'N/A'}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status status-${record.status}`}>
                    {record.status.toUpperCase()}
                  </span>
                </td>
                <td>{record.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
