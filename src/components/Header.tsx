import React, { useState } from 'react';
import { 
  Bell, 
  Wallet, 
  User, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Check, 
  Copy, 
  LogOut,
  LogIn,
  UserPlus,
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';
import { UserProfile, WalletState, NotificationItem } from '../types';
import { CRYPTO_RATES } from '../data/mockData';
import { QuantiqLogo } from './QuantiqLogo';
import { ProfileAvatar } from './ProfileAvatar';
import { safeCopyText } from '../utils/storage';

interface HeaderProps {
  user: UserProfile;
  wallet: WalletState;
  notifications: NotificationItem[];
  isAuthenticated?: boolean;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenMpesa: () => void;
  onOpenContacts: () => void;
  onOpenCreateProfile: () => void;
  onOpenReferral: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  wallet,
  notifications,
  isAuthenticated = true,
  onOpenLogin,
  onOpenRegister,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenMpesa,
  onOpenContacts,
  onOpenCreateProfile,
  onOpenReferral,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const isUserAdmin = Boolean(
    isAuthenticated && (
      user.isAdmin === true || 
      user.role === 'admin' || 
      user.role === 'superadmin' || 
      user.email?.toLowerCase().trim() === 'admin@quantiqprime.com' ||
      user.email?.toLowerCase().trim() === 'cheruyot.dennis@student.moringaschool.com'
    )
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCopyRef = () => {
    safeCopyText(user.referralCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080B11]/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl">
      
      {/* Live Market Ticker */}
      <div className="bg-[#04060A] text-slate-300 text-xs py-1.5 px-4 overflow-x-auto whitespace-nowrap border-b border-slate-800/80 scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-amber-400 font-bold shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="tracking-wider font-heading uppercase text-[11px]">QUANTIQ LIVE TERMINAL</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto">
            {CRYPTO_RATES.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 shrink-0 text-xs">
                <span className="text-slate-400 font-medium">{item.pair}:</span>
                <span className="font-bold text-slate-100 font-mono">{item.price}</span>
                <span className="text-emerald-400 font-bold font-mono text-[11px]">{item.change}</span>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 shrink-0">
            <span className="text-[11px]">Sponsor Ref:</span>
            <span className="font-mono text-amber-400 font-bold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-md">#{user.referralCode}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Quantiq Prime Brand Logo */}
          <div className="cursor-pointer" onClick={() => setActiveTab('overview')}>
            <QuantiqLogo size="md" showTagline={true} />
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0E131F]/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
            <button
              id="nav-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-investments"
              onClick={() => setActiveTab('investments')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'investments'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Yield Portfolios
            </button>
            <button
              id="nav-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Growth Charts
            </button>
            <button
              id="nav-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Ledger
            </button>
            <button
              id="nav-referrals"
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'referrals'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Affiliates (10% Bonus)
            </button>
            {isUserAdmin && (
              <button
                id="nav-database"
                onClick={() => setActiveTab('database')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'database'
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Client Database</span>
              </button>
            )}
          </nav>

          {/* User & Wallet Actions */}
          <div className="flex items-center gap-3">
            
            {!isAuthenticated ? (
              /* Public / Unauthenticated Navigation Buttons */
              <div className="flex items-center gap-2.5">
                <button
                  id="header-login-btn"
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 bg-[#0E131F] hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-amber-500/50 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>Log In</span>
                </button>

                <button
                  id="header-register-btn"
                  onClick={onOpenRegister}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            ) : (
              /* Authenticated User & Wallet Navigation */
              <>
                {/* Quick Balance Preview */}
                <div className="hidden lg:flex items-center gap-2.5 bg-[#0E131F] border border-amber-500/30 rounded-2xl px-3.5 py-2 shadow-md shadow-amber-500/5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 flex items-center justify-center shadow-xs">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider">Available Capital</div>
                    <div className="text-sm font-black text-white font-mono">
                      Ksh {wallet.availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    id="header-mpesa-btn"
                    onClick={onOpenMpesa}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                    title="Lipa Na M-PESA Direct Deposit & Withdrawal"
                  >
                    <span className="font-mono text-[10px] font-black bg-white text-emerald-900 px-1 py-0.2 rounded">M-PESA</span>
                    <span className="hidden sm:inline">Instant KES</span>
                  </button>

                  <button
                    id="header-deposit-btn"
                    onClick={onOpenDeposit}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Deposit</span>
                  </button>
                  
                  <button
                    id="header-withdraw-btn"
                    onClick={onOpenWithdraw}
                    className="hidden lg:flex items-center gap-1.5 bg-[#0E131F] hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-amber-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2.5 rounded-xl bg-[#0E131F] hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="fixed inset-x-3 top-16 sm:top-auto sm:inset-x-auto sm:absolute sm:right-0 sm:mt-2 sm:w-96 max-w-lg bg-[#0B0F17] rounded-3xl shadow-2xl border border-amber-500/30 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-bold text-sm text-white font-heading truncate">Alerts & Notifications</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {notifications.length} Updates
                      </span>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        aria-label="Close notifications"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-0.5">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                        <p>No new notifications right now</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border text-xs transition-colors ${
                            item.read
                              ? 'bg-[#111622] border-slate-800/80 text-slate-400'
                              : 'bg-amber-950/20 border-amber-500/30 text-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2.5 mb-1.5 min-w-0">
                            <div className="flex items-start gap-2 min-w-0 flex-1">
                              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1"></span>
                              <span className="font-bold text-slate-100 text-xs break-words leading-tight">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 font-mono mt-0.5">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed break-words pl-4">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                id="header-profile-menu-btn"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
              >
                <ProfileAvatar
                  src={user.avatar}
                  name={user.fullName}
                  tier={user.tier}
                  size="sm"
                  showOnlineStatus={true}
                  showTierRing={true}
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-100 leading-none">{user.username}</div>
                  <div className="text-[10px] text-amber-400 font-extrabold">{user.tier}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0B0F17] rounded-3xl shadow-2xl border border-amber-500/30 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-800 flex items-center gap-3">
                    <ProfileAvatar
                      src={user.avatar}
                      name={user.fullName}
                      tier={user.tier}
                      size="md"
                      showKycBadge={true}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-white font-heading truncate">{user.fullName}</div>
                      <div className="text-[11px] text-slate-400 truncate">@{user.username}</div>
                      <div className="text-[10px] text-amber-400 font-bold">{user.tier} • Ksh {wallet.availableCash.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between bg-amber-950/30 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-medium">
                    <span>Ref: <b className="font-mono text-white">#{user.referralCode}</b></span>
                    <button
                      onClick={handleCopyRef}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRef ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedRef ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="py-2 space-y-1 text-xs">
                    <button
                      id="header-create-profile-menu-btn"
                      onClick={() => {
                        onOpenCreateProfile();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        Create New Profile
                      </span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">+ Register</span>
                    </button>

                    {onOpenLogin && (
                      <button
                        onClick={() => {
                          onOpenLogin();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <LogIn className="w-4 h-4 text-amber-400" />
                          Log In / Switch Account
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Switch</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenMpesa();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-emerald-950/40 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Lipa Na M-PESA
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded">KES Live</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenContacts();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-amber-400" />
                        Support & Contacts
                      </span>
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Nairobi Desk</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('referrals');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Affiliate & Team
                      </span>
                      <span className="text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">10% Bonus</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('security');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Security & KYC
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded">Verified</span>
                    </button>

                    {isUserAdmin && (
                      <button
                        onClick={() => {
                          setActiveTab('database');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Executive Database
                        </span>
                        <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">ADMIN</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out / Switch User
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between overflow-x-auto py-2.5 border-t border-slate-800 gap-2 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 font-bold rounded-xl shrink-0 ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-[#0E131F] text-slate-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('investments')}
            className={`px-3 py-1.5 font-bold rounded-xl shrink-0 ${
              activeTab === 'investments' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-[#0E131F] text-slate-300'
            }`}
          >
            Yields
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 font-bold rounded-xl shrink-0 ${
              activeTab === 'analytics' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-[#0E131F] text-slate-300'
            }`}
          >
            Growth
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 font-bold rounded-xl shrink-0 ${
              activeTab === 'transactions' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-[#0E131F] text-slate-300'
            }`}
          >
            Ledger
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-1.5 font-bold rounded-xl shrink-0 ${
              activeTab === 'referrals' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-[#0E131F] text-slate-300'
            }`}
          >
            Ref #{user.referralCode}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 font-bold rounded-xl shrink-0 ${
              activeTab === 'security' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-[#0E131F] text-slate-300'
            }`}
          >
            Security
          </button>
          {isUserAdmin && (
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 font-bold rounded-xl shrink-0 flex items-center gap-1.5 ${
                activeTab === 'database' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black' : 'bg-[#0E131F] text-amber-400 border border-amber-500/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Database</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
