import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-title">Notes App</div>
        <div className="header-actions">
          <button onClick={handleLogout} className="button button-danger">
            Logout
          </button>
        </div>
      </header>

      <main className="page-content">
        <section className="panel">
          <h2 className="card-title">Welcome, {user?.name}!</h2>
          <p className="muted">Email: {user?.email}</p>
          <p className="muted">Role: {user?.role}</p>
        </section>

        <section className="panel">
          <h3 className="card-title">Your Notes</h3>
          <button
            onClick={() => navigate('/notes')}
            className="button button-primary"
          >
            View and manage notes
          </button>
        </section>

        {user?.role === 'admin' && (
          <section className="panel">
            <h3 className="card-title">Admin Panel</h3>
            <p className="muted">Manage users, view all notes, and system statistics</p>
            <button
              onClick={() => navigate('/admin')}
              className="button button-primary"
            >
              Go to Admin Dashboard
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
