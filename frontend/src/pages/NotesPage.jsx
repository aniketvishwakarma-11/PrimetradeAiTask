import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await notesAPI.getAllNotes();
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.content) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (editingId) {
        // Update note
        const response = await notesAPI.updateNote(
          editingId,
          formData.title,
          formData.content
        );
        if (response.data.success) {
          setSuccess('Note updated successfully!');
          setNotes(
            notes.map((note) => (note._id === editingId ? response.data.data : note))
          );
          setEditingId(null);
        }
      } else {
        // Create note
        const response = await notesAPI.createNote(
          formData.title,
          formData.content
        );
        if (response.data.success) {
          setSuccess('Note created successfully!');
          setNotes([response.data.data, ...notes]);
        }
      }

      setFormData({ title: '', content: '' });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setFormData({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await notesAPI.deleteNote(id);
      setSuccess('Note deleted successfully!');
      setNotes(notes.filter((note) => note._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', content: '' });
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="page loading">Loading notes...</div>;
  }

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-title">Notes Management</div>
        <div className="header-actions">
          <button
            onClick={() => navigate('/dashboard')}
            className="button button-secondary"
          >
            Dashboard
          </button>
          <button onClick={handleLogout} className="button button-danger">
            Logout
          </button>
        </div>
      </header>

      <main className="page-content">
        {error && <div className="notice notice--error">{error}</div>}
        {success && <div className="notice notice--success">{success}</div>}

        {!showForm && (
          <button onClick={() => setShowForm(true)} className="button button-primary">
            Create new note
          </button>
        )}

        {showForm && (
          <section className="panel">
            <h3 className="card-title">{editingId ? 'Edit Note' : 'Create New Note'}</h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="title" className="label">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter note title"
                  className="input"
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="label">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Enter note content"
                  className="input textarea"
                  maxLength={5000}
                />
              </div>

              <div className="button-row">
                <button type="submit" className="button button-primary">
                  {editingId ? 'Update Note' : 'Create Note'}
                </button>
                <button type="button" onClick={handleCancel} className="button button-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="notes-grid">
          {notes.length === 0 ? (
            <p className="empty-state">No notes yet. Create one to get started.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="note-card">
                <h4>{note.title}</h4>
                <p>{note.content}</p>
                <small className="note-meta">
                  Created: {new Date(note.createdAt).toLocaleString()}
                </small>
                <div className="note-actions">
                  <button onClick={() => handleEdit(note)} className="button button-secondary">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note._id)} className="button button-danger">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default NotesPage;
