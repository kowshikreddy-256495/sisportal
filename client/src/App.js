import React, { useEffect, useState } from 'react';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Grades from './pages/Grades';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  const getPageFromHash = () => window.location.hash.replace('#', '') || 'login';
  const [currentPage, setCurrentPage] = useState(getPageFromHash());
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch { return null; }
  });

  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    if (token && getPageFromHash() === 'login') {
      window.location.hash = 'dashboard';
    }
    if (!token && getPageFromHash() !== 'login') {
      window.location.hash = 'login';
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [token]);

  const handleLoginSuccess = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
    window.location.hash = 'dashboard';
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.hash = 'login';
    setCurrentPage('login');
  };

  const navigateTo = (page) => {
    if (!token) return;
    setCurrentPage(page);
    window.location.hash = page;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses />;
      case 'grades':
        return <Grades />;
      case 'attendance':
        return <Attendance />;
      case 'fees':
        return <Fees />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <Admin />;
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="brand">Student Information System</div>
        {token && (
          <nav className="app-nav">
            <button onClick={() => navigateTo('dashboard')}>Dashboard</button>
            <button onClick={() => navigateTo('courses')}>Courses</button>
            <button onClick={() => navigateTo('grades')}>Grades</button>
            <button onClick={() => navigateTo('attendance')}>Attendance</button>
            <button onClick={() => navigateTo('fees')}>Fees</button>
            <button onClick={() => navigateTo('profile')}>Profile</button>
            {user && user.role === 'admin' && (
              <button onClick={() => navigateTo('admin')}>Admin</button>
            )}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </nav>
        )}
      </header>
      {renderPage()}
    </div>
  );
}

export default App;
