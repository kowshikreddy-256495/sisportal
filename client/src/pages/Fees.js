import React, { useEffect, useState } from 'react';
import './Fees.css';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFeesData();
  }, []);

  const fetchFeesData = async () => {
    try {
      const studentRes = await fetch('http://localhost:5000/api/students/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      setStudent(studentData);

      const feesRes = await fetch(`http://localhost:5000/api/fees/student/${studentData._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const feesData = await feesRes.json();
      setFees(feesData);
    } catch (err) {
      console.error('Error fetching fees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFee = async (feeId) => {
    const amount = window.prompt('Enter payment amount:');
    if (!amount) return;

    try {
      const response = await fetch(`http://localhost:5000/api/fees/${feeId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentAmount: parseFloat(amount) })
      });

      if (response.ok) {
        alert('Payment successful!');
        fetchFeesData();
      }
    } catch (err) {
      alert('Payment failed. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading fees...</div>;

  const totalPending = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="fees-container">
      <h1>My Fees</h1>
      
      <div className="summary-cards">
        <div className="card pending">
          <h3>Pending Amount</h3>
          <p className="amount">₹{totalPending}</p>
        </div>
        <div className="card paid">
          <h3>Amount Paid</h3>
          <p className="amount">₹{totalPaid}</p>
        </div>
      </div>

      <div className="fees-table">
        <h2>Fee Details</h2>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee._id}>
                <td>{fee.semester}</td>
                <td>₹{fee.amount}</td>
                <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${fee.status}`}>
                    {fee.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {fee.status !== 'paid' && (
                    <button
                      className="btn-pay"
                      onClick={() => handlePayFee(fee._id)}
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
