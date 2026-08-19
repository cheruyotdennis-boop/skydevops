/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USER, 
  INITIAL_WALLET, 
  INITIAL_ACTIVE_INVESTMENTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS,
  INVESTMENT_PLANS,
  DEFAULT_CONTACTS 
} from './data/mockData';
import { 
  UserProfile, 
  WalletState, 
  ActiveInvestment, 
  Transaction, 
  NotificationItem, 
  InvestmentPlan,
  PlatformContacts
} from './types';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { DashboardOverview } from './components/DashboardOverview';
import { InvestmentsView } from './components/InvestmentsView';
import { FinancialAnalyticsView } from './components/FinancialAnalyticsView';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { ReferralAffiliateView } from './components/ReferralAffiliateView';
import { SecurityKycView } from './components/SecurityKycView';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { InvestModal } from './components/InvestModal';
import { MpesaModal } from './components/MpesaModal';
import { ContactSupportModal } from './components/ContactSupportModal';

export default function App() {
  // Read referral code from window query parameter if present (e.g. ?ref=505031)
  const [initialRefCode, setInitialRefCode] = useState('505031');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setInitialRefCode(ref);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // State with LocalStorage persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('fortune_auth');
    return saved !== null ? JSON.parse(saved) : true; // Default to true so preview opens immediately!
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fortune_user');
    return saved !== null ? JSON.parse(saved) : INITIAL_USER;
  });

  const [wallet, setWallet] = useState<WalletState>(() => {
    const saved = localStorage.getItem('fortune_wallet');
    return saved !== null ? JSON.parse(saved) : INITIAL_WALLET;
  });

  const [contacts, setContacts] = useState<PlatformContacts>(() => {
    const saved = localStorage.getItem('fortune_contacts');
    return saved !== null ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });

  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>(() => {
    const saved = localStorage.getItem('fortune_investments');
    return saved !== null ? JSON.parse(saved) : INITIAL_ACTIVE_INVESTMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fortune_txs');
    return saved !== null ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('fortune_notifications');
    return saved !== null ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isInvestOpen, setIsInvestOpen] = useState<boolean>(false);
  const [isMpesaOpen, setIsMpesaOpen] = useState<boolean>(false);
  const [isContactsOpen, setIsContactsOpen] = useState<boolean>(false);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState<InvestmentPlan | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fortune_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('fortune_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fortune_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('fortune_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('fortune_investments', JSON.stringify(activeInvestments));
  }, [activeInvestments]);

  useEffect(() => {
    localStorage.setItem('fortune_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fortune_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handlers
  const handleLoginSuccess = (userData: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...userData,
      referralCode: userData.referralCode || prev.referralCode || '505031'
    }));
    setIsAuthenticated(true);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleOpenInvestWithPlan = (plan: InvestmentPlan) => {
    setSelectedPlanForInvest(plan);
    setIsInvestOpen(true);
  };

  const handleConfirmInvest = (plan: InvestmentPlan, amount: number) => {
    // 1. Deduct available cash, increase activeInvested
    setWallet(prev => ({
      ...prev,
      availableCash: +(prev.availableCash - amount).toFixed(2),
      activeInvested: +(prev.activeInvested + amount).toFixed(2),
      todayYield: +(prev.todayYield + (amount * (plan.dailyRoi / 100))).toFixed(2)
    }));

    // 2. Add active investment contract
    const newInv: ActiveInvestment = {
      id: `inv_${Date.now().toString().slice(-4)}`,
      planId: plan.id,
      planName: `${plan.name} (${plan.dailyRoi}% Daily)`,
      investedAmount: amount,
      dailyRoi: plan.dailyRoi,
      dailyYieldAmount: +(amount * (plan.dailyRoi / 100)).toFixed(2),
      totalEarned: 0,
      startDate: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + plan.durationDays * 86400000).toISOString().split('T')[0],
      daysPassed: 0,
      totalDays: plan.durationDays,
      status: 'ACTIVE',
      lastPayoutTime: 'Scheduled in 24h',
      autoReinvest: false
    };
    setActiveInvestments(prev => [newInv, ...prev]);

    // 3. Create Transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'INVESTMENT',
      amount: amount,
      currency: 'USDT',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC`,
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      methodOrAddress: `${plan.name} Contract`,
      note: `Locked for ${plan.durationDays} days @ ${plan.dailyRoi}% daily`
    };
    setTransactions(prev => [newTx, ...prev]);

    // 4. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'New Investment Activated',
      message: `Successfully locked $${amount.toLocaleString()} in ${plan.name}. Daily yield is +$${(amount * (plan.dailyRoi / 100)).toFixed(2)} USDT.`,
      timestamp: 'Just now',
      read: false,
      type: 'payout'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleConfirmDeposit = (amount: number, currency: 'USDT' | 'BTC' | 'ETH' | 'USD' | 'KES', txHash: string, method: string) => {
    // 1. Credit wallet
    setWallet(prev => ({
      ...prev,
      totalBalance: +(prev.totalBalance + amount).toFixed(2),
      availableCash: +(prev.availableCash + amount).toFixed(2)
    }));

    // 2. Log transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'DEPOSIT',
      amount: amount,
      currency: currency,
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC`,
      txHash: txHash,
      methodOrAddress: method,
      note: `Instant deposit confirmed`
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Deposit Received & Credited',
      message: `$${amount.toLocaleString()} ${currency} has been added to your available cash balance.`,
      timestamp: 'Just now',
      read: false,
      type: 'deposit'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleConfirmWithdrawal = (amount: number, address: string, txHash: string) => {
    // 1. Deduct cash
    setWallet(prev => ({
      ...prev,
      totalBalance: +(prev.totalBalance - amount).toFixed(2),
      availableCash: +(prev.availableCash - amount).toFixed(2)
    }));

    // 2. Log transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'WITHDRAWAL',
      amount: amount,
      currency: 'USDT',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC`,
      txHash: txHash,
      methodOrAddress: `TRC20 (${address.slice(0, 8)}...${address.slice(-4)})`,
      note: 'Profits payout to personal external wallet'
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Withdrawal Broadcasted',
      message: `$${amount.toLocaleString()} USDT has been dispatched to your TRC20 wallet.`,
      timestamp: 'Just now',
      read: false,
      type: 'deposit'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // M-PESA Handlers
  const handleConfirmMpesaDeposit = (usdAmount: number, kesAmount: number, receiptCode: string, phone: string) => {
    // 1. Credit wallet
    setWallet(prev => ({
      ...prev,
      totalBalance: +(prev.totalBalance + usdAmount).toFixed(2),
      availableCash: +(prev.availableCash + usdAmount).toFixed(2)
    }));

    // 2. Log M-PESA Transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'DEPOSIT',
      amount: usdAmount,
      currency: 'USD',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: receiptCode,
      methodOrAddress: `Lipa Na M-PESA Express (${phone})`,
      note: `M-PESA KES ${kesAmount.toLocaleString()} via Paybill ${contacts.mpesaPaybill} (Receipt: ${receiptCode})`,
      mpesaReceiptNumber: receiptCode
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'M-PESA Deposit Credited',
      message: `KES ${kesAmount.toLocaleString()} ($${usdAmount.toFixed(2)} USD) credited to your account from ${phone}. Receipt: ${receiptCode}.`,
      timestamp: 'Just now',
      read: false,
      type: 'mpesa'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleConfirmMpesaWithdrawal = (usdAmount: number, kesAmount: number, receiptCode: string, phone: string) => {
    // 1. Deduct cash
    setWallet(prev => ({
      ...prev,
      totalBalance: +(prev.totalBalance - usdAmount).toFixed(2),
      availableCash: +(prev.availableCash - usdAmount).toFixed(2)
    }));

    // 2. Log M-PESA Transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'WITHDRAWAL',
      amount: usdAmount,
      currency: 'USD',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: receiptCode,
      methodOrAddress: `M-PESA B2C Payout (${phone})`,
      note: `Instant cashout KES ${kesAmount.toLocaleString()} to Safaricom ${phone} (Receipt: ${receiptCode})`,
      mpesaReceiptNumber: receiptCode
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'M-PESA Payout Dispatched',
      message: `KES ${kesAmount.toLocaleString()} ($${usdAmount.toFixed(2)} USD) sent to your M-PESA line (${phone}). Receipt: ${receiptCode}.`,
      timestamp: 'Just now',
      read: false,
      type: 'mpesa'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleClaimDailyYield = () => {
    const yieldAmount = wallet.todayYield;
    if (yieldAmount <= 0) return;

    // Credit available cash & total profit
    setWallet(prev => ({
      ...prev,
      totalBalance: +(prev.totalBalance + yieldAmount).toFixed(2),
      availableCash: +(prev.availableCash + yieldAmount).toFixed(2),
      totalEarnings: +(prev.totalEarnings + yieldAmount).toFixed(2)
    }));

    // Log transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'ROI_PAYOUT',
      amount: yieldAmount,
      currency: 'USDT',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC`,
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      methodOrAddress: 'Fortune Smart Contract Yield Engine',
      note: `Daily automated ROI distribution claimed to wallet`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Daily ROI Claimed',
      message: `$${yieldAmount.toFixed(2)} USDT has been added to your available cash balance.`,
      timestamp: 'Just now',
      read: false,
      type: 'payout'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen 
        onLoginSuccess={handleLoginSuccess}
        defaultReferralCode={initialRefCode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* App Header */}
      <Header
        user={user}
        wallet={wallet}
        notifications={notifications}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onOpenMpesa={() => setIsMpesaOpen(true)}
        onOpenContacts={() => setIsContactsOpen(true)}
        onOpenReferral={() => setActiveTab('referrals')}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'overview' && (
          <DashboardOverview
            user={user}
            wallet={wallet}
            activeInvestments={activeInvestments}
            transactions={transactions}
            onOpenDeposit={() => setIsDepositOpen(true)}
            onOpenWithdraw={() => setIsWithdrawOpen(true)}
            onOpenMpesa={() => setIsMpesaOpen(true)}
            onOpenContacts={() => setIsContactsOpen(true)}
            onOpenInvest={() => {
              setSelectedPlanForInvest(INVESTMENT_PLANS[1]);
              setIsInvestOpen(true);
            }}
            onOpenReferral={() => setActiveTab('referrals')}
            onViewAllTransactions={() => setActiveTab('transactions')}
            onClaimDailyYield={handleClaimDailyYield}
          />
        )}

        {activeTab === 'investments' && (
          <InvestmentsView
            wallet={wallet}
            activeInvestments={activeInvestments}
            onSelectPlanToInvest={handleOpenInvestWithPlan}
          />
        )}

        {activeTab === 'analytics' && (
          <FinancialAnalyticsView
            wallet={wallet}
            activeInvestments={activeInvestments}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionHistoryView
            transactions={transactions}
          />
        )}

        {activeTab === 'referrals' && (
          <ReferralAffiliateView
            user={user}
            wallet={wallet}
          />
        )}

        {activeTab === 'security' && (
          <SecurityKycView
            user={user}
            onUpdateUser={(updated) => setUser(prev => ({ ...prev, ...updated }))}
          />
        )}

      </main>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onConfirmDeposit={handleConfirmDeposit}
        onOpenMpesa={() => setIsMpesaOpen(true)}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        wallet={wallet}
        user={user}
        onConfirmWithdrawal={handleConfirmWithdrawal}
        onOpenMpesa={() => setIsMpesaOpen(true)}
      />

      <InvestModal
        isOpen={isInvestOpen}
        onClose={() => setIsInvestOpen(false)}
        plan={selectedPlanForInvest}
        wallet={wallet}
        onConfirmInvest={handleConfirmInvest}
        onOpenDeposit={() => setIsDepositOpen(true)}
      />

      <MpesaModal
        isOpen={isMpesaOpen}
        onClose={() => setIsMpesaOpen(false)}
        user={user}
        wallet={wallet}
        contacts={contacts}
        onConfirmMpesaDeposit={handleConfirmMpesaDeposit}
        onConfirmMpesaWithdrawal={handleConfirmMpesaWithdrawal}
      />

      <ContactSupportModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        contacts={contacts}
        user={user}
        onUpdateContacts={(updated) => setContacts(updated)}
        onUpdateUser={(updated) => setUser(prev => ({ ...prev, ...updated }))}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-sky-100 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 font-heading">FORTUNE INVESTMENT</span>
            <span>•</span>
            <span>Ref Sponsor #{user.referralCode}</span>
            <span>•</span>
            <button
              onClick={() => setIsContactsOpen(true)}
              className="text-sky-700 hover:underline font-bold cursor-pointer"
            >
              Kenya Contacts Desk
            </button>
            <span>•</span>
            <button
              onClick={() => setIsMpesaOpen(true)}
              className="text-emerald-700 hover:underline font-bold cursor-pointer"
            >
              Lipa Na M-PESA (505031)
            </button>
          </div>
          <div className="text-center sm:text-right">
            <span>© 2026 Fortune Investment Management LLC. Nairobi, Kenya. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
