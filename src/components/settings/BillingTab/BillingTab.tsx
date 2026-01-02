'use client';

import React, { useState, useEffect } from 'react';
import { getBillingPlan, getBillingPayments, createPayment } from '../../../lib/api/settings';
import styles from './BillingTab.module.css';
import NewPaymentModal from './NewPaymentModal';

type PaymentHistory = {
  id: number;
  paymentId: string;
  date: string;
  method: string;
  status: 'Approved' | 'Pending' | 'Failed';
  amount: string;
};

type Plan = {
  planName: string;
  status: string;
  price: string;
  period: string;
  features: string[];
  nextPaymentDue: string | null;
  paymentMethod: string;
  maxUsers?: number;
};

export default function BillingTab() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, [currentPage]);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [planData, paymentsData] = await Promise.all([
        getBillingPlan(),
        getBillingPayments({ page: currentPage, limit: 10 }),
      ]);

      setPlan(planData);
      
      if (currentPage === 1) {
        setPayments(paymentsData.payments || []);
      } else {
        setPayments(prev => [...prev, ...(paymentsData.payments || [])]);
      }
      
      setHasMore(paymentsData.pagination?.hasMore || false);
    } catch (err: any) {
      console.error('Failed to load billing data:', err);
      setError(err.message || 'Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPayment = () => {
    setShowNewPaymentModal(true);
  };

  const handleSavePayment = async (paymentData: {
    method: string;
    date: string;
    proof: File | null;
  }) => {
    if (!paymentData.proof) {
      alert('Please upload proof of payment');
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Proof = (reader.result as string).split(',')[1]; // Remove data:image/png;base64, prefix
          
          await createPayment({
            method: paymentData.method,
            date: paymentData.date,
            proof: base64Proof,
          });

          alert('Payment submitted successfully! Awaiting approval.');
          setShowNewPaymentModal(false);
          loadBillingData(); // Reload data
        } catch (err: any) {
          alert(err.message || 'Failed to submit payment');
        }
      };
      reader.readAsDataURL(paymentData.proof);
    } catch (err: any) {
      alert(err.message || 'Failed to process payment proof');
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading && !plan) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={loadBillingData} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Plan Information Section */}
      <div className={styles.section}>
        <h2 className={styles.title}>Plan Informations</h2>
        
        <div className={styles.currentPlanLabel}>Current Plan</div>
        
        <div className={styles.planCard}>
          <div className={styles.planHeader}>
            <div className={styles.statusBadge}>
              <span>{plan?.status || 'Active'}</span>
              <span className={styles.statusDot}></span>
            </div>
            <div className={styles.planPrice}>
              <span className={styles.price}>{plan?.price || '299$'}</span>
              <span className={styles.period}>{plan?.period || 'Per month'}</span>
            </div>
          </div>
          
          <div className={styles.planFeatures}>
            <p className={styles.planName}>{plan?.planName || 'Professional Plan'} :</p>
            <ul className={styles.featuresList}>
              {plan?.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              )) || (
                <>
                  <li>Unlimited number of teachers</li>
                  <li>Unlimited number of students</li>
                  <li>Unlimited number of levels</li>
                  <li>Notifications ability</li>
                  <li>Each user has a profile</li>
                </>
              )}
              {plan?.maxUsers && (
                <li>Maximum {plan.maxUsers === 999999 ? 'Unlimited' : plan.maxUsers} users</li>
              )}
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
              <p className={styles.cardValue}>
                {plan?.nextPaymentDue 
                  ? new Date(plan.nextPaymentDue).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                  : 'Not set'}
              </p>
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
              <p className={styles.cardValue}>{plan?.paymentMethod || 'Manual'}</p>
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

        {payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No payment history found</p>
          </div>
        ) : (
          <>
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

            {hasMore && (
              <div className={styles.loadMore}>
                <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                  <span>Load More ...</span>
                  <svg width="51" height="41" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <NewPaymentModal
        isOpen={showNewPaymentModal}
        onClose={() => setShowNewPaymentModal(false)}
        onSave={handleSavePayment}
      />
    </div>
  );
}
