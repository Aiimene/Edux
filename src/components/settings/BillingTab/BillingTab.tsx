'use client';

import React, { useState } from 'react';
import styles from './BillingTab.module.css';
import NewPaymentModal from './NewPaymentModal';

type PaymentHistory = {
  id: string;
  paymentId: string;
  date: string;
  method: string;
  status: 'Approved' | 'Pending' | 'Failed';
  amount: string;
};

const mockPayments: PaymentHistory[] = [
  {
    id: '1',
    paymentId: 'PAY-XYZ-ABC',
    date: '1 December 2025',
    method: 'Bank Transfer',
    status: 'Approved',
    amount: '299$',
  },
  {
    id: '2',
    paymentId: 'PAY-XYZ-ABC',
    date: '1 December 2025',
    method: 'Bank Transfer',
    status: 'Approved',
    amount: '299$',
  },
  {
    id: '3',
    paymentId: 'PAY-XYZ-ABC',
    date: '1 December 2025',
    method: 'Bank Transfer',
    status: 'Approved',
    amount: '299$',
  },
  {
    id: '4',
    paymentId: 'PAY-XYZ-ABC',
    date: '1 December 2025',
    method: 'Bank Transfer',
    status: 'Approved',
    amount: '299$',
  },
];

export default function BillingTab() {
  const [payments, setPayments] = useState<PaymentHistory[]>(mockPayments);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);

  const handleNewPayment = () => {
    setShowNewPaymentModal(true);
  };

  const handleSavePayment = (paymentData: {
    method: string;
    date: string;
    proof: File | null;
  }) => {
    // TODO: Upload proof file to server and create payment record
    // For now, just add a new payment entry
    const newPayment: PaymentHistory = {
      id: (payments.length + 1).toString(),
      paymentId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date(paymentData.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      method: paymentData.method,
      status: 'Pending',
      amount: '299$',
    };

    setPayments([newPayment, ...payments]);
  };

  const handleLoadMore = () => {
    // TODO: Load more payments from API
    console.log('Load more payments');
  };

  return (
    <div className={styles.container}>
      {/* Plan Information Section */}
      <div className={styles.section}>
        <h2 className={styles.title}>Plan Informations</h2>
        
        <div className={styles.currentPlanLabel}>Current Plan</div>
        
        <div className={styles.planCard}>
          <div className={styles.planHeader}>
            <div className={styles.statusBadge}>
              <span>Active</span>
              <span className={styles.statusDot}></span>
            </div>
            <div className={styles.planPrice}>
              <span className={styles.price}>299$</span>
              <span className={styles.period}>Per month</span>
            </div>
          </div>
          
          <div className={styles.planFeatures}>
            <p className={styles.planName}>Professional Plan :</p>
            <ul className={styles.featuresList}>
              <li>Unlimited number of teachers</li>
              <li>Unlimited number of students</li>
              <li>Unlimited number of levels</li>
              <li>Notifications ability</li>
              <li>Each user has a profile</li>
            </ul>
          </div>
        </div>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Next Payment due</p>
              <p className={styles.cardValue}>1 December, 2025</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <svg width="45" height="39" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Payment Method</p>
              <p className={styles.cardValue}>Mannual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Payment History</h2>
          <button className={styles.newPaymentButton} onClick={handleNewPayment}>
            <svg width="43" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>new payment</span>
          </button>
        </div>

        <div className={styles.paymentsList}>
          {payments.map((payment) => (
            <div key={payment.id} className={styles.paymentCard}>
              <div className={styles.paymentIcon}>
                <svg width="45" height="39" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                </svg>
              </div>
              <div className={styles.paymentInfo}>
                <p className={styles.paymentId}>{payment.paymentId}</p>
                <p className={styles.paymentDate}>{payment.date}</p>
                <p className={styles.paymentMethod}>{payment.method}</p>
              </div>
              <div className={styles.paymentStatus}>
                <span className={`${styles.statusBadge} ${styles[payment.status.toLowerCase()]}`}>
                  {payment.status}
                  <span className={styles.statusDot}></span>
                </span>
              </div>
              <div className={styles.paymentAmount}>
                <span>{payment.amount}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.loadMore}>
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            <span>Load More ...</span>
            <svg width="51" height="41" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <NewPaymentModal
        isOpen={showNewPaymentModal}
        onClose={() => setShowNewPaymentModal(false)}
        onSave={handleSavePayment}
      />
    </div>
  );
}
