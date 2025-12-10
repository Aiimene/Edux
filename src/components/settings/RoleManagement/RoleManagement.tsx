'use client';

import React from 'react';
import styles from './RoleManagement.module.css';

export type Permission = {
  id: string;
  name: string;
  checked: boolean;
};

export type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

type RoleManagementProps = {
  roles: Role[];
  onRolesChange: (roles: Role[]) => void;
};

export default function RoleManagement({ roles, onRolesChange }: RoleManagementProps) {

  const handleAddRole = () => {
    // TODO: Open add role modal/form
    console.log('Add role clicked');
  };

  const handleEdit = (roleId: string) => {
    // TODO: Open edit role modal/form
    console.log('Edit role:', roleId);
  };

  const handleDelete = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      onRolesChange(roles.filter((r) => r.id !== roleId));
    }
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    onRolesChange(
      roles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.map((p) =>
                p.id === permissionId ? { ...p, checked: !p.checked } : p
              ),
            }
          : role
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Role Management</h2>
        <p className={styles.subtitle}>You can add roles and their permissions and edit the default roles</p>
        <button className={styles.addButton} onClick={handleAddRole}>
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add</span>
        </button>
      </div>

      <div className={styles.rolesGrid}>
        {roles.map((role) => (
          <div key={role.id} className={styles.roleCard}>
            <div className={styles.roleHeader}>
              <h3 className={styles.roleName}>{role.name}</h3>
              <div className={styles.roleActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleEdit(role.id)}
                  aria-label="Edit role"
                >
                  <svg width="35" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(role.id)}
                  aria-label="Delete role"
                >
                  <svg width="33" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.permissionsGrid}>
              {role.permissions.map((permission) => (
                <label key={permission.id} className={styles.permissionItem}>
                  <input
                    type="checkbox"
                    checked={permission.checked}
                    onChange={() => togglePermission(role.id, permission.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.permissionName}>{permission.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

