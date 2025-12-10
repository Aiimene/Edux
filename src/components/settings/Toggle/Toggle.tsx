'use client';

import React from 'react';
import styles from './Toggle.module.css';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      className={`${styles.toggle} ${checked ? styles.checked : ''}`}
      onClick={() => onChange(!checked)}
      aria-label={checked ? 'Disable' : 'Enable'}
      role="switch"
      aria-checked={checked}
    >
      <span className={styles.slider}></span>
    </button>
  );
}

