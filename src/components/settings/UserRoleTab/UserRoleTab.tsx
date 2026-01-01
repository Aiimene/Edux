'use client';

import React, { useState, useEffect } from 'react';
import UserManagement, { type User } from '../UserManagement/UserManagement';
import { getUsers, createUser, updateUser, deleteUser } from '../../../lib/api/settings';
import styles from './UserRoleTab.module.css';

export default function UserRoleTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const usersData = await getUsers();
        // Convert backend format to frontend format
        const formattedUsers: User[] = usersData.map((user: any) => ({
          id: String(user.id),
          name: user.name || '',
          email: user.email || '',
          role: user.role || '',
          status: user.status === 'Active' ? 'Active' : 'Inactive',
        }));
        setUsers(formattedUsers);
      } catch (err: any) {
        console.error('Failed to load users:', err);
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleUsersChange = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  };

  // Handle create user (called from UserManagement)
  const handleCreateUser = async (userData: {
    name: string;
    email?: string;
    username: string;
    role: 'Admin' | 'Teacher' | 'Student' | 'Parent';
    status?: 'Active' | 'Inactive';
    password?: string;
  }) => {
    try {
      const response = await createUser(userData);
      // Reload users to get the updated list
      const usersData = await getUsers();
      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: String(user.id),
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status === 'Active' ? 'Active' : 'Inactive',
      }));
      setUsers(formattedUsers);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Handle update user (called from UserManagement)
  const handleUpdateUser = async (userId: number, userData: {
    name: string;
    email?: string;
    role: 'Admin' | 'Teacher' | 'Student' | 'Parent';
    status: 'Active' | 'Inactive';
  }) => {
    try {
      const response = await updateUser(userId, userData);
      // Reload users to get the updated list
      const usersData = await getUsers();
      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: String(user.id),
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status === 'Active' ? 'Active' : 'Inactive',
      }));
      setUsers(formattedUsers);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Handle delete user (called from UserManagement)
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      // Reload users to get the updated list
      const usersData = await getUsers();
      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: String(user.id),
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status === 'Active' ? 'Active' : 'Inactive',
      }));
      setUsers(formattedUsers);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UserManagement 
        users={users} 
        onUsersChange={handleUsersChange}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}

