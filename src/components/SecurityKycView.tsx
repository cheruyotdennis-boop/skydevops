import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  KeyRound, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Check, 
  Wallet, 
  Globe, 
  History,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types';

interface SecurityKycViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const SecurityKycView: React.FC<SecurityKycViewProps> = ({
  user,
  onUpdateUser
}) => {
  const [walletAddress, setWalletAddress] = useState(user.walletAddressUSDT);
  const [mpesaNumber, setMpesaNumber] = useState(user.mpesaNumber || user.phone || '0712345678');
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPhone, setUserPhone] = useState(user.phone);
  const [userCountry, setUserCountry] = useState(user.country);
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      walletAddressUSDT: walletAddress,
      mpesaNumber: mpesaNumber,
      email: userEmail,
      phone: userPhone,
      country: userCountry,
      twoFactorEnabled: twoFactor
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };


  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-heading">
              Security & Identity Verification (KYC)
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Level 3 KYC Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your authenticated withdrawal wallet, 2FA security credentials, and identity credentials.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Security preferences and withdrawal wallet address updated successfully!</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: User Profile Details (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-5">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="relative inline-block">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-sky-500/20 mx-auto"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>
            <h3 className="font-black text-base text-slate-900 mt-3 font-heading">{user.fullName}</h3>
            <p className="text-xs text-sky-700 font-bold">@{user.username} • {user.tier}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-medium text-slate-900 truncate max-w-[170px]">{user.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Phone Number:</span>
              <span className="font-medium text-slate-900">{user.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Country:</span>
              <span className="font-medium text-slate-900">{user.country}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sponsor ID:</span>
              <span className="font-mono font-bold text-sky-700">#{user.referralCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Referred By:</span>
              <span className="font-mono text-slate-700">{user.referredBy}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Member Since:</span>
              <span className="font-medium text-slate-900">{user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Security Controls (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Payout & Wallet Security</h2>

            {/* M-PESA Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Safaricom M-PESA Phone Number</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instant B2C Payout Active
                </span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                <input
                  id="security-mpesa-number"
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="0712345678 or 254712345678"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Direct Lipa Na M-PESA withdrawals and STK Push deposits will target this verified Safaricom line.
              </p>
            </div>

            {/* USDT Whitelisted Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Whitelisted Payout USDT Address (TRC-20)</span>
                <span className="text-[10px] font-bold text-sky-600">Crypto Auto-Settlement</span>
              </label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="security-wallet-address"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Personal Contacts Update */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                />
              </div>
            </div>


            {/* 2FA Toggle */}
            <div className="flex items-center justify-between p-4 bg-sky-50/60 border border-sky-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Google Authenticator (2FA)</div>
                  <div className="text-[11px] text-slate-500">Requires 6-digit one-time code on withdrawals</div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={twoFactor} 
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            <button
              id="save-security-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Security Changes
            </button>
          </form>

          {/* Login Session History */}
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-sky-600" />
              <span>Recent Security & Login Sessions</span>
            </h2>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Current Session • Chrome / Windows 11</div>
                  <div className="text-[10px] text-slate-400">IP: 198.51.100.42 • United States</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Active Now
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Mobile Login • iOS Fortune App</div>
                  <div className="text-[10px] text-slate-400">IP: 198.51.100.18 • 2 days ago</div>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  Signed Out
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
