import React, { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    courses: 0,
    gpa: 0,
    attendance: 0,
    fees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (token) {
      fetchStudentData(token);
    }
  }, []);

  const fetchStudentData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/students/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStudent(data);

      const [gradesRes, feesRes, attendanceRes] = await Promise.all([
        fetch(`http://localhost:5000/api/grades/student/${data._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/fees/student/${data._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/attendance/${data._id}/${data.enrolledCourses[0]?._id || ''}/percentage`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const gradesData = gradesRes.ok ? await gradesRes.json() : [];
      const feesData = feesRes.ok ? await feesRes.json() : [];
      const attendanceData = attendanceRes.ok ? await attendanceRes.json() : { percentage: 0 };

      const gpa = gradesData.length
        ? (gradesData.reduce((sum, g) => sum + Number(g.totalGrade), 0) / gradesData.length / 25).toFixed(2)
        : 0;
      const pendingFees = feesData.filter((fee) => fee.status !== 'paid').reduce((sum, fee) => sum + Number(fee.amount), 0);

      setStats({
        courses: data.enrolledCourses?.length || 0,
        gpa,
        attendance: attendanceData.percentage || 0,
        fees: pendingFees
      });
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = 'login';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">SIS</div>
        <div className="nav-links">
          <a href="#courses">Courses</a>
          <a href="#grades">Grades</a>
          <a href="#attendance">Attendance</a>
          <a href="#fees">Fees</a>
          <a href="#profile">Profile</a>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user?.firstName || 'Student'}!</h1>
          <p>Your Academic Dashboard</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.courses}</h3>
            <p>Enrolled Courses</p>
          </div>
          <div className="stat-card">
            <h3>{stats.gpa}</h3>
            <p>Current GPA</p>
          </div>
          <div className="stat-card">
            <h3>{stats.attendance}%</h3>
            <p>Attendance</p>
          </div>
          <div className="stat-card">
            <h3>₹{stats.fees}</h3>
            <p>Pending Fees</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="section">
            <h2>My Courses</h2>
            <p>View your enrolled courses and course materials</p>
            <button className="btn-primary" onClick={() => window.location.hash = 'courses'}>View Courses</button>
          </section>

          <section className="section">
            <h2>My Grades</h2>
            <p>Check your academic performance</p>
            <button className="btn-primary" onClick={() => window.location.hash = 'grades'}>View Grades</button>
          </section>

          <section className="section">
            <h2>Attendance</h2>
            <p>Track your class attendance</p>
            <button className="btn-primary" onClick={() => window.location.hash = 'attendance'}>View Attendance</button>
          </section>

          <section className="section">
            <h2>Fee Payment</h2>
            <p>Manage and pay your fees</p>
            <button className="btn-primary" onClick={() => window.location.hash = 'fees'}>Pay Fees</button>
          </section>
        </div>
      </div>
    </div>
  );
}
