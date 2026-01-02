'use client';

import React, { useState, useEffect } from 'react';
import { getAllAccounts, getPendingPayments, approvePayment, updateAccountPlan } from '../../../lib/api/settings';
import styles from './page.module.css';

type Account = {
  id: number;
  workspaceName: string;
  email: string;
  currentPlan: string;
  maxUsers: number;
  currentUsers: number;
  status: 'active' | 'inactive' | 'expired';
  lastPayment: string | null;
};

type PendingPayment = {
  id: number;
  paymentId: string;
  workspaceName: string;
  date: string;
  method: string;
  amount: string;
  proof: string | null;
};

const PLANS = [
  { name: 'Basic Plan', maxUsers: 100, price: 99 },
  { name: 'Professional Plan', maxUsers: 500, price: 299 },
  { name: 'Enterprise Plan', maxUsers: 999999, price: 599 },
];

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'accounts' | 'payments'>('payments');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [approvingPaymentId, setApprovingPaymentId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [accountsData, paymentsData] = await Promise.all([
        getAllAccounts(),
        getPendingPayments(),
      ]);

      setAccounts(accountsData.accounts || []);
      setPendingPayments(paymentsData.payments || []);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId: number, action: 'approve' | 'reject') => {
    try {
      setApprovingPaymentId(paymentId);
      await approvePayment(paymentId, action);
      alert(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      loadData(); // Reload data
    } catch (err: any) {
      alert(err.message || `Failed to ${action} payment`);
    } finally {
      setApprovingPaymentId(null);
    }
  };

  const handleUpdatePlan = async (workspaceId: number, planName: string, maxUsers: number, price: number) => {
    try {
      await updateAccountPlan(workspaceId, {
        planName,
        maxUsers,
        price,
        status: 'active',
      });
      alert('Plan updated successfully!');
      setShowPlanModal(false);
      setSelectedAccount(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update plan');
    }
  };

  const handleViewProof = (proof: string | null) => {
    if (!proof) {
      alert('No proof available');
      return;
    }
    // Open proof in new window
    const imageUrl = `data:image/png;base64,${proof}`;
    window.open(imageUrl, '_blank');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading account management data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Management</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'payments' ? styles.active : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Pending Payments ({pendingPayments.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'accounts' ? styles.active : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            All Accounts ({accounts.length})
          </button>
        </div>
      </div>

      {activeTab === 'payments' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pending Payment Approvals</h2>
          {pendingPayments.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No pending payments</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Workspace</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Proof</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.paymentId}</td>
                      <td>{payment.workspaceName}</td>
                      <td>{payment.date}</td>
                      <td>{payment.method}</td>
                      <td>{payment.amount}</td>
                      <td>
                        <button
                          className={styles.viewButton}
                          onClick={() => handleViewProof(payment.proof)}
                        >
                          View
                        </button>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.approveButton}
                            onClick={() => handleApprovePayment(payment.id, 'approve')}
                            disabled={approvingPaymentId === payment.id}
                          >
                            Approve
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => handleApprovePayment(payment.id, 'reject')}
                            disabled={approvingPaymentId === payment.id}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>All Accounts</h2>
          {accounts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No accounts found</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Workspace</th>
                    <th>Email</th>
                    <th>Current Plan</th>
                    <th>Users</th>
                    <th>Status</th>
                    <th>Last Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.workspaceName}</td>
                      <td>{account.email}</td>
                      <td>{account.currentPlan}</td>
                      <td>
                        {account.currentUsers} / {account.maxUsers === 999999 ? 'Unlimited' : account.maxUsers}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[account.status]}`}>
                          {account.status}
                        </span>
                      </td>
                      <td>{account.lastPayment || 'Never'}</td>
                      <td>
                        <button
                          className={styles.editButton}
                          onClick={() => {
                            setSelectedAccount(account);
                            setShowPlanModal(true);
                          }}
                        >
                          Edit Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showPlanModal && selectedAccount && (
        <div className={styles.modalOverlay} onClick={() => setShowPlanModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Update Plan for {selectedAccount.workspaceName}</h2>
            <div className={styles.plansGrid}>
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={styles.planCard}
                  onClick={() => handleUpdatePlan(selectedAccount.id, plan.name, plan.maxUsers, plan.price)}
                >
                  <h3>{plan.name}</h3>
                  <p className={styles.planPrice}>${plan.price}/month</p>
                  <p className={styles.planUsers}>
                    {plan.maxUsers === 999999 ? 'Unlimited' : plan.maxUsers} users
                  </p>
                </div>
              ))}
            </div>
            <button className={styles.closeButton} onClick={() => setShowPlanModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

