'use client';

import React, { useState } from 'react';
import styles from './UserManagement.module.css';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
};

type UserManagementProps = {
  users: User[];
  onUsersChange: (users: User[]) => void;
  onCreateUser?: (userData: {
    name: string;
    email?: string;
    username: string;
    role: 'Admin' | 'Teacher' | 'Student' | 'Parent';
    status?: 'Active' | 'Inactive';
    password?: string;
  }) => Promise<any>;
  onUpdateUser?: (userId: number, userData: {
    name: string;
    email?: string;
    role: 'Admin' | 'Teacher' | 'Student' | 'Parent';
    status: 'Active' | 'Inactive';
  }) => Promise<any>;
  onDeleteUser?: (userId: number) => Promise<any>;
};

export default function UserManagement({ 
  users, 
  onUsersChange, 
  onCreateUser, 
  onUpdateUser, 
  onDeleteUser 
}: UserManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'Admin' as 'Admin' | 'Teacher' | 'Student' | 'Parent',
    status: 'Active' as 'Active' | 'Inactive',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      username: '',
      role: 'Admin',
      status: 'Active',
      password: '',
    });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        username: '', // Username not shown in edit mode (backend doesn't allow changing it)
        role: user.role as 'Admin' | 'Teacher' | 'Student' | 'Parent',
        status: user.status,
        password: '',
      });
      setError(null);
      setShowModal(true);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    if (onDeleteUser) {
      try {
        await onDeleteUser(Number(userId));
      } catch (err: any) {
        alert(err.message || 'Failed to delete user');
      }
    } else {
      onUsersChange(users.filter((u) => u.id !== userId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingUser) {
        // Update user
        if (onUpdateUser) {
          await onUpdateUser(Number(editingUser.id), {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
          });
        }
      } else {
        // Create user
        if (!formData.username.trim()) {
          setError('Username is required');
          setIsSubmitting(false);
          return;
        }
        if (onCreateUser) {
          await onCreateUser({
            name: formData.name,
            email: formData.email,
            username: formData.username,
            role: formData.role,
            status: formData.status,
            password: formData.password || undefined,
          });
        }
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError(null);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>User Management</h2>
          <p className={styles.subtitle}>User that you create managing the dashboard not students or teachers</p>
          <button className={styles.addButton} onClick={handleAddUser}>
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add</span>
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={styles.roleBadge}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[user.status.toLowerCase()]}`}>
                        {user.status}
                        {user.status === 'Active' && <span className={styles.statusDot}></span>}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEdit(user.id)}
                          aria-label="Edit user"
                        >
                          <svg width="35" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleDelete(user.id)}
                          aria-label="Delete user"
                        >
                          <svg width="33" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button className={styles.modalClose} onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {error && (
                <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!editingUser && (
                <div className={styles.formGroup}>
                  <label>Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                  <option value="Parent">Parent</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {!editingUser && (
                <div className={styles.formGroup}>
                  <label>Password (optional, auto-generated if empty)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={8}
                  />
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

