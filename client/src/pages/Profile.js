import React, { useEffect, useState } from 'react';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStudent(data);
      setFormData(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:5000/api/students/${student._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      alert('Profile updated successfully!');
      setEditing(false);
      fetchStudentProfile();
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">{user?.firstName?.charAt(0)}</div>
          <div className="header-info">
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p>{student?.studentId}</p>
          </div>
        </div>

        {!editing ? (
          <div className="profile-details">
            <div className="detail-group">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="detail-group">
              <label>Phone</label>
              <p>{user?.phone || 'Not provided'}</p>
            </div>
            <div className="detail-group">
              <label>Date of Birth</label>
              <p>{student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
            </div>
            <div className="detail-group">
              <label>Address</label>
              <p>{student?.address || 'Not provided'}</p>
            </div>
            <div className="detail-group">
              <label>City</label>
              <p>{student?.city || 'Not provided'}</p>
            </div>
            <div className="detail-group">
              <label>Parent Name</label>
              <p>{student?.parentName || 'Not provided'}</p>
            </div>
            <button className="btn-edit" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="edit-form">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Parent Name</label>
              <input
                type="text"
                value={formData.parentName || ''}
                onChange={(e) => setFormData({...formData, parentName: e.target.value})}
              />
            </div>
            <div className="buttons">
              <button className="btn-save" onClick={handleUpdate}>Save Changes</button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
