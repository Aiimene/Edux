'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import styles from './LogoUpload.module.css';

type LogoUploadProps = {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
};

export default function LogoUpload({ logo, onLogoChange }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a JPG, PNG, or SVG file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      {logo ? (
        <div className={styles.logoPreview} onClick={handleClick}>
          <Image
            src={logo}
            alt="School Logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      ) : (
        <div className={styles.placeholder} onClick={handleClick}>
          <span className={styles.placeholderText}>Logo</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/svg+xml"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  );
}

