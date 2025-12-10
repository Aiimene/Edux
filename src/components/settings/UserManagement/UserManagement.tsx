'use client';

import React from 'react';
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
};

export default function UserManagement({ users, onUsersChange }: UserManagementProps) {

  const handleAddUser = () => {
    // TODO: Open add user modal/form
    console.log('Add user clicked');
  };

  const handleEdit = (userId: string) => {
    // TODO: Open edit user modal/form
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onUsersChange(users.filter((u) => u.id !== userId));
    }
  };

  return (
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
            {users.map((user) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

