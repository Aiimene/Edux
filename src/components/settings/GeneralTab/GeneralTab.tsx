'use client';

import React from 'react';
import SchoolInformation from '../SchoolInformation/SchoolInformation';
import InterfacePreference from '../InterfacePreference/InterfacePreference';
import styles from './GeneralTab.module.css';

type SchoolData = {
  schoolName: string;
  schoolEmail: string;
  address: string;
  timezone: string;
  language: string;
  logo: string | null;
};

type InterfaceData = {
  darkMode: boolean;
  accentColor: string;
  sidebarLayout: string;
};

type GeneralTabProps = {
  schoolData: SchoolData;
  setSchoolData: React.Dispatch<React.SetStateAction<SchoolData>>;
  interfaceData: InterfaceData;
  setInterfaceData: React.Dispatch<React.SetStateAction<InterfaceData>>;
};

export default function GeneralTab({
  schoolData,
  setSchoolData,
  interfaceData,
  setInterfaceData,
}: GeneralTabProps) {
  return (
    <div className={styles.container}>
      <SchoolInformation
        data={schoolData}
        onDataChange={setSchoolData}
      />
      <InterfacePreference
        data={interfaceData}
        onDataChange={setInterfaceData}
      />
    </div>
  );
}

