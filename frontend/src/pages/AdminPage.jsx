import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import '../styles/AdminPage.css';

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'users') {
        const response = await adminAPI.getAllUsers();
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError(response.data.message);
        }
      } else if (activeTab === 'notes') {
        const response = await adminAPI.getAllNotes();
        if (response.data.success) {
          setNotes(response.data.data);
        } else {
          setError(response.data.message);
        }
      } else if (activeTab === 'stats') {
        const response = await adminAPI.getStats();
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError(response.data.message);
        }
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all their notes?')) {
      return;
    }

    try {
      const response = await adminAPI.deleteUser(userId);

      if (response.data.success) {
        setUsers(users.filter(u => u._id !== userId));
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await adminAPI.deleteNote(noteId);

      if (response.data.success) {
        setNotes(notes.filter(n => n._id !== noteId));
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
    }
  };

  const handleUpdateRole = async (userId) => {
    if (!newRole) {
      setError('Please select a role');
      return;
    }

    try {
      const response = await adminAPI.updateUserRole(userId, newRole);

      if (response.data.success) {
        setUsers(users.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
        setSelectedUser(null);
        setNewRole('');
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-right">
          <span className="admin-user">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          All Notes
        </button>
      </nav>

      <main className="admin-content">
        {error && <div className="error-message">{error}</div>}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>System Statistics</h2>
            {loading ? (
              <p>Loading...</p>
            ) : stats ? (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Admin Users</h3>
                  <p className="stat-number">{stats.totalAdmins}</p>
                </div>
                <div className="stat-card">
                  <h3>Regular Users</h3>
                  <p className="stat-number">{stats.totalRegularUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Notes</h3>
                  <p className="stat-number">{stats.totalNotes}</p>
                </div>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Users Management</h2>
            {loading ? (
              <p>Loading...</p>
            ) : users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                        <td className="actions">
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setSelectedUser(u._id);
                              setNewRole(u.role);
                            }}
                          >
                            Change Role
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedUser && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Change User Role</h3>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="modal-actions">
                    <button
                      className="confirm-btn"
                      onClick={() => handleUpdateRole(selectedUser)}
                    >
                      Update
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setSelectedUser(null);
                        setNewRole('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="notes-section">
            <h2>All Notes</h2>
            {loading ? (
              <p>Loading...</p>
            ) : notes.length === 0 ? (
              <p>No notes found</p>
            ) : (
              <div className="notes-grid">
                {notes.map(note => (
                  <div key={note._id} className="note-card">
                    <h3>{note.title}</h3>
                    <p className="note-content">{note.content.substring(0, 100)}...</p>
                    <p className="note-author">
                      By: {note.userId ? note.userId.name : 'Unknown'}
                    </p>
                    <p className="note-date">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      Delete Note
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
