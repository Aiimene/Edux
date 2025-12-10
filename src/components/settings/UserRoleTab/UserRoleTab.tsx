'use client';

import React, { useState, useRef } from 'react';
import UserManagement, { type User } from '../UserManagement/UserManagement';
import RoleManagement, { type Role } from '../RoleManagement/RoleManagement';
import styles from './UserRoleTab.module.css';

const initialUsers: User[] = [
  {
    id: '1',
    name: '3achoui',
    email: '3achoui@gmail.com',
    role: 'Admin',
    status: 'Active',
  },
];

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Administration',
    permissions: [
      { id: '1', name: 'View Dashboard', checked: true },
      { id: '2', name: 'Manage Users', checked: true },
      { id: '3', name: 'Manage Roles', checked: true },
      { id: '4', name: 'View Analytics', checked: true },
      { id: '5', name: 'Manage Settings', checked: true },
      { id: '6', name: 'View Reports', checked: true },
    ],
  },
  {
    id: '2',
    name: 'Teacher',
    permissions: [
      { id: '1', name: 'View Dashboard', checked: true },
      { id: '2', name: 'Manage Students', checked: true },
      { id: '3', name: 'View Attendance', checked: true },
      { id: '4', name: 'View Analytics', checked: false },
      { id: '5', name: 'Manage Sessions', checked: true },
      { id: '6', name: 'View Reports', checked: false },
    ],
  },
  {
    id: '3',
    name: 'Student',
    permissions: [
      { id: '1', name: 'View Dashboard', checked: true },
      { id: '2', name: 'View Attendance', checked: true },
      { id: '3', name: 'View Grades', checked: true },
      { id: '4', name: 'View Schedule', checked: true },
      { id: '5', name: 'View Materials', checked: false },
      { id: '6', name: 'Submit Assignments', checked: true },
    ],
  },
  {
    id: '4',
    name: 'Wlid Khalti baghi ychouf brk',
    permissions: [
      { id: '1', name: 'View Dashboard', checked: true },
      { id: '2', name: 'View Attendance', checked: true },
      { id: '3', name: 'View Grades', checked: true },
      { id: '4', name: 'View Schedule', checked: true },
      { id: '5', name: 'View Materials', checked: true },
      { id: '6', name: 'Submit Assignments', checked: true },
    ],
  },
];

export default function UserRoleTab() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const initialUsersRef = useRef<User[]>(JSON.parse(JSON.stringify(initialUsers)));
  const initialRolesRef = useRef<Role[]>(JSON.parse(JSON.stringify(initialRoles)));

  const hasChanges = () => {
    const usersChanged = JSON.stringify(users) !== JSON.stringify(initialUsersRef.current);
    const rolesChanged = JSON.stringify(roles) !== JSON.stringify(initialRolesRef.current);
    return usersChanged || rolesChanged;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/settings/user-role', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ users, roles }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update initial state after successful save
      initialUsersRef.current = JSON.parse(JSON.stringify(users));
      initialRolesRef.current = JSON.parse(JSON.stringify(roles));

      setSaveMessage({ type: 'success', text: 'Changes saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {hasChanges() && (
        <div className={styles.saveSection}>
          {saveMessage && (
            <div className={`${styles.message} ${styles[saveMessage.type]}`}>
              {saveMessage.text}
            </div>
          )}
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <UserManagement users={users} onUsersChange={setUsers} />
      <RoleManagement roles={roles} onRolesChange={setRoles} />
    </div>
  );
}

