import React, { useState } from 'react';
import { 
  TrendingUp, 
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
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { UserProfile, WalletState, NotificationItem } from '../types';
import { CRYPTO_RATES } from '../data/mockData';

interface HeaderProps {
  user: UserProfile;
  wallet: WalletState;
  notifications: NotificationItem[];
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenMpesa: () => void;
  onOpenContacts: () => void;
  onOpenReferral: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  wallet,
  notifications,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenMpesa,
  onOpenContacts,
  onOpenReferral,
  onLogout,
  activeTab,
  setActiveTab
}) => {

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      {/* Live Market Ticker */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 overflow-x-auto whitespace-nowrap border-b border-slate-800 scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sky-400 font-semibold shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span>LIVE MARKETS</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto">
            {CRYPTO_RATES.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 shrink-0 text-xs">
                <span className="text-slate-400">{item.pair}:</span>
                <span className="font-medium text-white">{item.price}</span>
                <span className="text-emerald-400 font-semibold">{item.change}</span>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 shrink-0">
            <span>Sponsor ID:</span>
            <span className="font-mono text-sky-400 font-medium bg-slate-800 px-1.5 py-0.5 rounded">#{user.referralCode}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-500 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sky-400 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                  FORTUNE <span className="text-sky-600 font-normal">INVESTMENT</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                  Global Yield
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Institutional Wealth & Compound Growth
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              id="nav-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-investments"
              onClick={() => setActiveTab('investments')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'investments'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Plans & Yields
            </button>
            <button
              id="nav-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Growth Charts
            </button>
            <button
              id="nav-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'transactions'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Ledger
            </button>
            <button
              id="nav-referrals"
              onClick={() => setActiveTab('referrals')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'referrals'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Affiliates (Ref #{user.referralCode})
            </button>
          </nav>

          {/* User & Wallet Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick Balance Preview */}
            <div className="hidden lg:flex items-center gap-2.5 bg-sky-50/80 border border-sky-200/80 rounded-xl px-3 py-1.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">Available Cash</div>
                <div className="text-sm font-bold text-slate-900">
                  ${wallet.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                id="header-mpesa-btn"
                onClick={onOpenMpesa}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
                title="Lipa Na M-PESA Deposit & Withdrawal"
              >
                <span className="font-mono text-[10px] font-black bg-white text-emerald-800 px-1 py-0.2 rounded">M-PESA</span>
                <span className="hidden sm:inline">KES Express</span>
              </button>

              <button
                id="header-deposit-btn"
                onClick={onOpenDeposit}
                className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs hover:shadow-sky-500/20 active:scale-95 cursor-pointer"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Deposit</span>
              </button>
              
              <button
                id="header-withdraw-btn"
                onClick={onOpenWithdraw}
                className="hidden lg:flex items-center gap-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdraw</span>
              </button>
            </div>


            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="font-bold text-sm text-slate-900">Notifications & Alerts</div>
                    <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                      {notifications.length} Total
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border text-xs transition-colors ${
                          item.read
                            ? 'bg-slate-50/70 border-slate-100 text-slate-600'
                            : 'bg-sky-50/50 border-sky-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                            {item.title}
                          </div>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timestamp}</span>
                        </div>
                        <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">{item.message}</p>
                      </div>
                    ))}
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
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-sky-500/30"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-none">{user.username}</div>
                  <div className="text-[10px] text-sky-600 font-semibold">{user.tier}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100">
                    <div className="font-bold text-sm text-slate-900">{user.fullName}</div>
                    <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    <div className="mt-2 flex items-center justify-between bg-sky-50 rounded-lg px-2.5 py-1.5 text-xs text-sky-800 font-medium">
                      <span>Ref Code: <b className="font-mono">#{user.referralCode}</b></span>
                      <button
                        onClick={handleCopyRef}
                        className="text-sky-600 hover:text-sky-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedRef ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="py-2 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        onOpenMpesa();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-emerald-800 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Lipa Na M-PESA
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">KES Live</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenContacts();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-sky-600" />
                        Support & Contacts
                      </span>
                      <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">Nairobi Desk</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('referrals');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Affiliate & Team
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">8% Tier 1</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('security');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Security & KYC
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Verified</span>
                    </button>
                  </div>


                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
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
        <div className="flex md:hidden items-center justify-between overflow-x-auto py-2.5 border-t border-slate-100 gap-2 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 ${
              activeTab === 'overview' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('investments')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 ${
              activeTab === 'investments' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Plans
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 ${
              activeTab === 'analytics' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Growth
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 ${
              activeTab === 'transactions' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Ledger
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 ${
              activeTab === 'referrals' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Ref #{user.referralCode}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 ${
              activeTab === 'security' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Security
          </button>
        </div>
      </div>
    </header>
  );
};
