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
  PlatformContacts,
  ProfileCreationData
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
import { CreateProfileModal } from './components/CreateProfileModal';
import { safeGetItem, safeSetItem } from './utils/storage';
import { roundCurrency } from './utils/security';

import bgWallpaper from './assets/images/quantiq_prime_bg_1787826829164.jpg';

export default function App() {
  // Read referral code from window query parameter if present (e.g. ?ref=505031)
  const [initialRefCode, setInitialRefCode] = useState('505031');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location && typeof window.location.search === 'string') {
        const match = window.location.search.match(/[?&]ref=([^&]+)/);
        if (match && match[1]) {
          setInitialRefCode(decodeURIComponent(match[1]));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Saved Profiles List for multi-profile switching
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>(() => {
    return safeGetItem<UserProfile[]>('quantiq_saved_profiles', [INITIAL_USER]);
  });

  // State with LocalStorage persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return safeGetItem<boolean>('quantiq_auth', true);
  });

  const [isGuestBrowsing, setIsGuestBrowsing] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('login');
  const [selectedPlanForAuth, setSelectedPlanForAuth] = useState<InvestmentPlan | null>(null);

  const [user, setUser] = useState<UserProfile>(() => {
    return safeGetItem<UserProfile>('quantiq_user', INITIAL_USER);
  });

  const [wallet, setWallet] = useState<WalletState>(() => {
    return safeGetItem<WalletState>('quantiq_wallet', INITIAL_WALLET);
  });

  const [contacts, setContacts] = useState<PlatformContacts>(() => {
    return safeGetItem<PlatformContacts>('quantiq_contacts', DEFAULT_CONTACTS);
  });

  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>(() => {
    return safeGetItem<ActiveInvestment[]>('quantiq_investments', INITIAL_ACTIVE_INVESTMENTS);
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return safeGetItem<Transaction[]>('quantiq_txs', INITIAL_TRANSACTIONS);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return safeGetItem<NotificationItem[]>('quantiq_notifications', INITIAL_NOTIFICATIONS);
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isInvestOpen, setIsInvestOpen] = useState<boolean>(false);
  const [isMpesaOpen, setIsMpesaOpen] = useState<boolean>(false);
  const [isContactsOpen, setIsContactsOpen] = useState<boolean>(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState<boolean>(false);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState<InvestmentPlan | null>(null);

  // Sync to localStorage
  useEffect(() => {
    safeSetItem('quantiq_saved_profiles', savedProfiles);
  }, [savedProfiles]);

  useEffect(() => {
    safeSetItem('quantiq_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    safeSetItem('quantiq_user', user);
  }, [user]);

  useEffect(() => {
    safeSetItem('quantiq_wallet', wallet);
  }, [wallet]);

  useEffect(() => {
    safeSetItem('quantiq_contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    safeSetItem('quantiq_investments', activeInvestments);
  }, [activeInvestments]);

  useEffect(() => {
    safeSetItem('quantiq_txs', transactions);
  }, [transactions]);

  useEffect(() => {
    safeSetItem('quantiq_notifications', notifications);
  }, [notifications]);

  // Handlers
  const handleLoginSuccess = (userData: Partial<UserProfile>, initialDeposit?: number) => {
    const fullUser: UserProfile = {
      id: userData.id || `usr_${Date.now()}`,
      fullName: userData.fullName || 'Investor Member',
      username: userData.username || 'FortuneMember',
      email: userData.email || 'investor@fortune-investment.com',
      phone: userData.phone || '+254 712 345 678',
      mpesaNumber: userData.mpesaNumber || '0712345678',
      country: userData.country || 'Kenya',
      referralCode: userData.referralCode || '505031',
      referredBy: userData.referredBy || 'Sponsor #505031',
      joinedDate: userData.joinedDate || new Date().toISOString().split('T')[0],
      tier: userData.tier || 'Gold VIP',
      kycStatus: userData.kycStatus || 'Verified',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      twoFactorEnabled: userData.twoFactorEnabled ?? true,
      walletAddressUSDT: userData.walletAddressUSDT || 'TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc'
    };

    setUser(fullUser);

    // If initial deposit is supplied for a brand new profile
    if (initialDeposit !== undefined && initialDeposit > 0) {
      setWallet({
        totalBalance: initialDeposit,
        availableCash: initialDeposit,
        activeInvested: 0,
        totalEarnings: 0,
        todayYield: 0,
        referralEarnings: 0,
        pendingWithdrawals: 0
      });
      setActiveInvestments([]);
    }

    // Add to saved profiles registry if not already present
    setSavedProfiles(prev => {
      const exists = prev.some(p => p.email.toLowerCase() === fullUser.email.toLowerCase());
      if (exists) {
        return prev.map(p => p.email.toLowerCase() === fullUser.email.toLowerCase() ? fullUser : p);
      }
      return [fullUser, ...prev];
    });

    setIsAuthenticated(true);
    setIsGuestBrowsing(false);
    
    // If the user was redirected to auth after selecting a plan, open the invest modal for that plan
    if (selectedPlanForAuth) {
      setSelectedPlanForInvest(selectedPlanForAuth);
      setIsInvestOpen(true);
      setSelectedPlanForAuth(null);
    } else {
      setActiveTab('overview');
    }
  };

  const handleCreateProfile = (data: ProfileCreationData) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      phone: data.phone || '+254 712 345 678',
      mpesaNumber: data.mpesaNumber || '0712345678',
      country: data.country || 'Kenya',
      referralCode: data.referralCode || '505031',
      referredBy: `Sponsor #${data.referralCode || '505031'}`,
      joinedDate: new Date().toISOString().split('T')[0],
      tier: (data.initialDepositUSD || 0) >= 10000 ? 'Platinum Sovereign' : (data.initialDepositUSD || 0) >= 2500 ? 'Gold VIP' : 'Silver VIP',
      kycStatus: 'Verified',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      twoFactorEnabled: true,
      walletAddressUSDT: data.walletAddressUSDT || 'TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc'
    };

    const depositAmount = data.initialDepositKES || data.initialDepositUSD || 50000;
    const newWallet: WalletState = {
      totalBalance: depositAmount,
      availableCash: depositAmount,
      activeInvested: 0,
      totalEarnings: 0,
      todayYield: 0,
      referralEarnings: 0,
      pendingWithdrawals: 0
    };

    setUser(newUser);
    setWallet(newWallet);
    setActiveInvestments([]);

    // Add initial welcome deposit transaction
    const welcomeTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'DEPOSIT',
      amount: depositAmount,
      currency: 'KES',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: `0x${Math.random().toString(16).substring(2)}`,
      methodOrAddress: `Starter Deposit (M-PESA / Bank)`,
      note: `Welcome account funding for ${data.fullName}`
    };
    setTransactions([welcomeTx]);

    // Add welcome notification
    const welcomeNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Welcome to Fortune Investment, ${data.fullName.split(' ')[0]}!`,
      message: `Your profile has been created and credited with Ksh ${depositAmount.toLocaleString('en-KE')}. You can now subscribe to yield plans or deposit via M-PESA.`,
      timestamp: 'Just now',
      read: false,
      type: 'deposit'
    };
    setNotifications([welcomeNotif]);

    // Save profile to registry
    setSavedProfiles(prev => [newUser, ...prev.filter(p => p.email !== newUser.email)]);

    setIsAuthenticated(true);
    setIsGuestBrowsing(false);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsGuestBrowsing(false);
    setAuthMode('login');
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsGuestBrowsing(false);
    setIsAuthenticated(false);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setIsGuestBrowsing(false);
    setIsAuthenticated(false);
  };

  const handleRedirectToAuth = (plan: InvestmentPlan) => {
    setSelectedPlanForAuth(plan);
    setAuthMode('login');
    setIsGuestBrowsing(false);
    setIsAuthenticated(false);
  };

  const handleOpenInvestWithPlan = (plan: InvestmentPlan) => {
    if (!isAuthenticated) {
      handleRedirectToAuth(plan);
      return;
    }
    setSelectedPlanForInvest(plan);
    setIsInvestOpen(true);
  };

  const handleConfirmInvest = (plan: InvestmentPlan, amount: number) => {
    const cleanAmount = roundCurrency(amount);
    const dailyYield = roundCurrency(cleanAmount * (plan.dailyRoi / 100));

    // 1. Lock capital: deduct availableCash, increase activeInvested (balance is locked until maturity)
    setWallet(prev => ({
      ...prev,
      availableCash: roundCurrency(prev.availableCash - cleanAmount),
      activeInvested: roundCurrency(prev.activeInvested + cleanAmount),
      todayYield: roundCurrency(prev.todayYield + dailyYield)
    }));

    // 2. Add active investment contract
    const newInv: ActiveInvestment = {
      id: `inv_${Date.now().toString().slice(-4)}`,
      planId: plan.id,
      planName: `${plan.name} (${plan.dailyRoi}% Daily)`,
      investedAmount: cleanAmount,
      dailyRoi: plan.dailyRoi,
      dailyYieldAmount: dailyYield,
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
      amount: cleanAmount,
      currency: 'KES',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      methodOrAddress: `${plan.name} Contract`,
      note: `Capital locked for ${plan.durationDays} days @ ${plan.dailyRoi}% daily`
    };
    setTransactions(prev => [newTx, ...prev]);

    // 4. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Contract Capital Locked & Activated',
      message: `Successfully locked Ksh ${cleanAmount.toLocaleString('en-KE')} in ${plan.name} for ${plan.durationDays} days. Daily yield is +Ksh ${dailyYield.toLocaleString('en-KE', { minimumFractionDigits: 2 })}.`,
      timestamp: 'Just now',
      read: false,
      type: 'payout'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleReleaseMaturedContract = (contractId: string) => {
    const contract = activeInvestments.find(inv => inv.id === contractId);
    if (!contract) return;

    // Release locked capital to available cash upon maturity
    setWallet(prev => ({
      ...prev,
      availableCash: roundCurrency(prev.availableCash + contract.investedAmount),
      activeInvested: Math.max(0, roundCurrency(prev.activeInvested - contract.investedAmount)),
      todayYield: Math.max(0, roundCurrency(prev.todayYield - contract.dailyYieldAmount))
    }));

    // Remove or complete contract
    setActiveInvestments(prev => prev.filter(inv => inv.id !== contractId));

    // Log transaction
    const releaseTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'DEPOSIT',
      amount: roundCurrency(contract.investedAmount),
      currency: 'KES',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: `0x${Math.random().toString(16).substring(2)}`,
      methodOrAddress: `${contract.planName} (Maturity Release)`,
      note: `100% Principal unlocked from matured contract to available cash`
    };
    setTransactions(prev => [releaseTx, ...prev]);

    // Add Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Contract Capital Released',
      message: `Ksh ${contract.investedAmount.toLocaleString('en-KE')} principal from ${contract.planName} has matured and unlocked to your available liquid cash.`,
      timestamp: 'Just now',
      read: false,
      type: 'payout'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleConfirmDeposit = (amount: number, currency: 'USDT' | 'BTC' | 'ETH' | 'USD' | 'KES', txHash: string, method: string) => {
    const cleanAmount = roundCurrency(amount);
    // 1. Credit wallet
    setWallet(prev => ({
      ...prev,
      totalBalance: roundCurrency(prev.totalBalance + cleanAmount),
      availableCash: roundCurrency(prev.availableCash + cleanAmount)
    }));

    // 2. Log transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'DEPOSIT',
      amount: cleanAmount,
      currency: currency,
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: txHash,
      methodOrAddress: method,
      note: `Instant deposit confirmed`
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Deposit Received & Credited',
      message: `Ksh ${cleanAmount.toLocaleString('en-KE')} (${currency}) has been added to your available cash balance.`,
      timestamp: 'Just now',
      read: false,
      type: 'deposit'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleConfirmWithdrawal = (amount: number, address: string, txHash: string) => {
    const cleanAmount = roundCurrency(amount);
    // 1. Deduct cash
    setWallet(prev => ({
      ...prev,
      totalBalance: roundCurrency(prev.totalBalance - cleanAmount),
      availableCash: roundCurrency(prev.availableCash - cleanAmount)
    }));

    // 2. Log transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'WITHDRAWAL',
      amount: cleanAmount,
      currency: 'KES',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: txHash,
      methodOrAddress: address.startsWith('254') || address.startsWith('07') ? `M-PESA (${address})` : `TRC20 (${address.slice(0, 8)}...${address.slice(-4)})`,
      note: 'Profits payout to personal account'
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Withdrawal Broadcasted',
      message: `Ksh ${cleanAmount.toLocaleString('en-KE')} has been dispatched to your account (${address}).`,
      timestamp: 'Just now',
      read: false,
      type: 'deposit'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // M-PESA Handlers
  const handleConfirmMpesaDeposit = (usdAmount: number, kesAmount: number, receiptCode: string, phone: string) => {
    const cleanKes = roundCurrency(kesAmount);
    // 1. Credit wallet
    setWallet(prev => ({
      ...prev,
      totalBalance: roundCurrency(prev.totalBalance + cleanKes),
      availableCash: roundCurrency(prev.availableCash + cleanKes)
    }));

    // 2. Log M-PESA Transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'DEPOSIT',
      amount: cleanKes,
      currency: 'KES',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: receiptCode,
      methodOrAddress: `Lipa Na M-PESA Express (${phone})`,
      note: `M-PESA KES ${cleanKes.toLocaleString()} via Paybill ${contacts.mpesaPaybill} (Receipt: ${receiptCode})`,
      mpesaReceiptNumber: receiptCode
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'M-PESA Deposit Credited',
      message: `KES ${cleanKes.toLocaleString()} credited to your account from ${phone}. Receipt: ${receiptCode}.`,
      timestamp: 'Just now',
      read: false,
      type: 'mpesa'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleConfirmMpesaWithdrawal = (usdAmount: number, kesAmount: number, receiptCode: string, phone: string) => {
    const cleanKes = roundCurrency(kesAmount);
    // 1. Deduct cash
    setWallet(prev => ({
      ...prev,
      totalBalance: roundCurrency(prev.totalBalance - cleanKes),
      availableCash: roundCurrency(prev.availableCash - cleanKes)
    }));

    // 2. Log M-PESA Transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'WITHDRAWAL',
      amount: cleanKes,
      currency: 'KES',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: receiptCode,
      methodOrAddress: `M-PESA B2C Payout (${phone})`,
      note: `Instant cashout KES ${cleanKes.toLocaleString()} to Safaricom ${phone} (Receipt: ${receiptCode})`,
      mpesaReceiptNumber: receiptCode
    };
    setTransactions(prev => [newTx, ...prev]);

    // 3. Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'M-PESA Payout Dispatched',
      message: `KES ${cleanKes.toLocaleString()} sent to your M-PESA line (${phone}). Receipt: ${receiptCode}.`,
      timestamp: 'Just now',
      read: false,
      type: 'mpesa'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleClaimDailyYield = () => {
    const yieldAmount = roundCurrency(wallet.todayYield);
    if (yieldAmount <= 0) return;

    // Credit available cash & total profit
    setWallet(prev => ({
      ...prev,
      totalBalance: roundCurrency(prev.totalBalance + yieldAmount),
      availableCash: roundCurrency(prev.availableCash + yieldAmount),
      totalEarnings: roundCurrency(prev.totalEarnings + yieldAmount)
    }));

    // Log transaction
    const newTx: Transaction = {
      id: `tx_${Date.now().toString().slice(-5)}`,
      type: 'ROI_PAYOUT',
      amount: yieldAmount,
      currency: 'KES',
      fee: 0,
      status: 'COMPLETED',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`,
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      methodOrAddress: 'Fortune Smart Contract Yield Engine',
      note: `Daily automated ROI distribution claimed to wallet`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Daily ROI Claimed',
      message: `Ksh ${yieldAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })} has been added to your available cash balance.`,
      timestamp: 'Just now',
      read: false,
      type: 'payout'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // If unauthenticated and not explicitly in guest browsing mode, show full AuthScreen
  if (!isAuthenticated && !isGuestBrowsing) {
    return (
      <AuthScreen 
        onLoginSuccess={handleLoginSuccess}
        defaultReferralCode={initialRefCode}
        savedProfiles={savedProfiles}
        initialMode={authMode}
        selectedPlan={selectedPlanForAuth}
        onBrowsePublic={() => {
          setIsGuestBrowsing(true);
          setActiveTab('investments');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      
      {/* Background Wallpaper matching uploaded style */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen pointer-events-none z-0"
        style={{ backgroundImage: `url(${bgWallpaper})` }}
      ></div>

      {/* Luxury Golden Ambient Glows */}
      <div className="fixed top-20 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-20 right-1/4 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* App Header with conditional Log In / Register / Account buttons */}
      <div className="relative z-10">
        <Header
          user={user}
          wallet={wallet}
          notifications={notifications}
          isAuthenticated={isAuthenticated}
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
          onOpenDeposit={() => setIsDepositOpen(true)}
          onOpenWithdraw={() => setIsWithdrawOpen(true)}
          onOpenMpesa={() => setIsMpesaOpen(true)}
          onOpenContacts={() => setIsContactsOpen(true)}
          onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
          onOpenReferral={() => setActiveTab('referrals')}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Guest Mode Banner if browsing unauthenticated */}
      {!isAuthenticated && (
        <div className="relative z-20 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 py-2.5 px-4 text-xs font-black shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>You are viewing Quantiq Prime Yield Plans in Guest Mode. Sign in or register to lock in investment capital and earn 7.5% daily.</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenLogin}
                className="bg-slate-950 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-900 cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={handleOpenRegister}
                className="bg-amber-950 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-amber-900 cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        
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
            isAuthenticated={isAuthenticated}
            onSelectPlanToInvest={handleOpenInvestWithPlan}
            onRedirectToAuth={handleRedirectToAuth}
            onReleaseMaturedContract={handleReleaseMaturedContract}
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
            onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
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

      <CreateProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onCreateProfile={handleCreateProfile}
        defaultReferralCode={user.referralCode || '505031'}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-amber-500/20 bg-[#06080E]/95 py-8 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="font-black text-amber-400 uppercase tracking-wider font-heading">QUANTIQ PRIME</span>
            <span>•</span>
            <span className="text-slate-300">Trade Smart | Invest Wise | Grow Together</span>
            <span>•</span>
            <span className="font-mono text-amber-300">Ref #{user.referralCode}</span>
            <span>•</span>
            <button
              onClick={() => setIsCreateProfileOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              + Create Profile
            </button>
            <span>•</span>
            <button
              onClick={() => setIsContactsOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              Kenya Contacts Desk
            </button>
            <span>•</span>
            <button
              onClick={() => setIsMpesaOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
            >
              Lipa Na M-PESA (505031)
            </button>
          </div>
          <div className="text-center md:text-right text-slate-500 text-[11px]">
            <span>© 2026 Quantiq Prime Wealth Management LLC. Delta Corner Tower, Westlands, Nairobi.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
