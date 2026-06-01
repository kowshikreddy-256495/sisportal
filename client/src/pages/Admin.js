import React, { useEffect, useState } from 'react';
import './Admin.css';

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradesList, setGradesList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const token = localStorage.getItem('token');

  const [gradeForm, setGradeForm] = useState({ studentId: '', courseId: '', assignmentGrade: 0, midtermGrade: 0, finalGrade: 0 });
  const [attForm, setAttForm] = useState({ studentId: '', courseId: '', date: '', status: 'present', remarks: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        fetch('http://localhost:5000/api/students', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/courses', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
      // fetch admin lists
      const [gradesRes, attRes] = await Promise.all([
        fetch('http://localhost:5000/api/grades', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/attendance', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (gradesRes.ok) setGradesList(await gradesRes.json());
      if (attRes.ok) setAttendanceList(await attRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(gradeForm)
      });
      if (res.ok) {
        alert('Grade created');
        setGradeForm({ studentId: '', courseId: '', assignmentGrade: 0, midtermGrade: 0, finalGrade: 0 });
      } else {
        const err = await res.json();
        alert('Error: ' + err.message);
      }
    } catch (err) {
      alert('Request failed');
    }
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(attForm)
      });
      if (res.ok) {
        alert('Attendance recorded');
        setAttForm({ studentId: '', courseId: '', date: '', status: 'present', remarks: '' });
        const newRec = await res.json();
        setAttendanceList(prev => [newRec, ...prev]);
      } else {
        const err = await res.json();
        alert('Error: ' + err.message);
      }
    } catch (err) {
      alert('Request failed');
    }
  };

  if (loading) return <div className="loading">Loading admin tools...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Console</h1>

      <section className="admin-section">
        <h2>Create / Update Grades</h2>
        <form onSubmit={submitGrade} className="admin-form">
          <select value={gradeForm.studentId} onChange={(e) => setGradeForm({...gradeForm, studentId: e.target.value})} required>
            <option value="">Select student</option>
            {students.map(s => <option key={s._id || s.userId} value={s._id || s.userId}>{s.userId} - {s.userId}</option>)}
          </select>
          <select value={gradeForm.courseId} onChange={(e) => setGradeForm({...gradeForm, courseId: e.target.value})} required>
            <option value="">Select course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.courseCode} - {c.courseName}</option>)}
          </select>
          <input type="number" value={gradeForm.assignmentGrade} onChange={(e) => setGradeForm({...gradeForm, assignmentGrade: e.target.value})} placeholder="Assignment" />
          <input type="number" value={gradeForm.midtermGrade} onChange={(e) => setGradeForm({...gradeForm, midtermGrade: e.target.value})} placeholder="Midterm" />
          <input type="number" value={gradeForm.finalGrade} onChange={(e) => setGradeForm({...gradeForm, finalGrade: e.target.value})} placeholder="Final" />
          <button type="submit">Submit Grade</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Record Attendance</h2>
        <form onSubmit={submitAttendance} className="admin-form">
          <select value={attForm.studentId} onChange={(e) => setAttForm({...attForm, studentId: e.target.value})} required>
            <option value="">Select student</option>
            {students.map(s => <option key={s._id || s.userId} value={s._id || s.userId}>{s.userId} - {s.userId}</option>)}
          </select>
          <select value={attForm.courseId} onChange={(e) => setAttForm({...attForm, courseId: e.target.value})} required>
            <option value="">Select course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.courseCode} - {c.courseName}</option>)}
          </select>
          <input type="date" value={attForm.date} onChange={(e) => setAttForm({...attForm, date: e.target.value})} required />
          <select value={attForm.status} onChange={(e) => setAttForm({...attForm, status: e.target.value})}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
+            <option value="leave">Leave</option>
          </select>
          <input type="text" value={attForm.remarks} onChange={(e) => setAttForm({...attForm, remarks: e.target.value})} placeholder="Remarks" />
          <button type="submit">Record Attendance</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Students</h2>
        <table className="admin-table">
          <thead>
            <tr><th>StudentId</th><th>City</th><th>Phone</th></tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id || s.userId}><td>{s.studentId || s._id}</td><td>{s.city || ''}</td><td>{s.parentPhone || s.parentPhone || ''}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2>Grades</h2>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Student</th><th>Course</th><th>Total</th><th>Grade</th><th>Actions</th></tr></thead>
          <tbody>
            {gradesList.map(g => (
              <tr key={g._id}>
                <td>{g._id}</td>
                <td>{g.studentId}</td>
                <td>{g.course?.courseCode}</td>
                <td>{g.totalGrade}</td>
                <td>{g.gradePoint}</td>
                <td>
                  <button onClick={async () => {
                    const newVal = prompt('New total grade (will recalc):', g.totalGrade);
                    if (!newVal) return;
                    // compute breakdown naive: keep proportions
                    const res = await fetch(`http://localhost:5000/api/grades/${g._id}`, { method: 'PUT', headers: {'Content-Type':'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify({ finalGrade: Number(newVal) }) });
                    if (res.ok) {
                      const updated = await res.json();
                      setGradesList(prev => prev.map(x => x._id === updated._id ? updated : x));
                    } else { alert('Update failed'); }
                  }}>Edit</button>
                  <button onClick={async () => {
                    if (!confirm('Delete grade '+g._id+'?')) return;
                    const res = await fetch(`http://localhost:5000/api/grades/${g._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                    if (res.ok) { setGradesList(prev => prev.filter(x => x._id !== g._id)); }
                    else alert('Delete failed');
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2>Attendance Records</h2>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Student</th><th>Course</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {attendanceList.map(a => (
              <tr key={a._id}>
                <td>{a._id}</td>
                <td>{a.studentId}</td>
                <td>{a.course?.courseCode}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={async () => {
                    const newStatus = prompt('New status (present/absent/leave):', a.status);
                    if (!newStatus) return;
                    const res = await fetch(`http://localhost:5000/api/attendance/${a._id}`, { method: 'PUT', headers: {'Content-Type':'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify({ status: newStatus }) });
                    if (res.ok) { const up = await res.json(); setAttendanceList(prev => prev.map(x => x._id === up._id ? up : x)); } else alert('Update failed');
                  }}>Edit</button>
                  <button onClick={async () => {
                    if (!confirm('Delete attendance '+a._id+'?')) return;
                    const res = await fetch(`http://localhost:5000/api/attendance/${a._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                    if (res.ok) setAttendanceList(prev => prev.filter(x => x._id !== a._id)); else alert('Delete failed');
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
