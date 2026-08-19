import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Award,
  Globe2,
  KeyRound
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  defaultReferralCode?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  defaultReferralCode = '505031'
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Form State
  const [fullName, setFullName] = useState('Dennis Cheruiyot');
  const [username, setUsername] = useState('DennisFortune');
  const [email, setEmail] = useState('cheruyot.dennis@student.moringaschool.com');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [country, setCountry] = useState('Kenya');
  const [password, setPassword] = useState('FortuneSecure2026!');

  const [confirmPassword, setConfirmPassword] = useState('FortuneSecure2026!');
  const [referralCode, setReferralCode] = useState(defaultReferralCode);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (authMode === 'register') {
      if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreedTerms) {
        setErrorMessage('Please accept the Terms of Service to proceed.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter your email and password.');
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        fullName: fullName.trim() || 'Investor Member',
        username: username.trim() || 'FortuneMember',
        email: email.trim(),
        phone,
        country,
        referralCode: referralCode || '505031',
        referredBy: referralCode ? `Sponsor #${referralCode}` : 'Direct Member',
        joinedDate: new Date().toISOString().split('T')[0],
        tier: 'Gold VIP',
        kycStatus: 'Verified',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        walletAddressUSDT: 'TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc'
      });
    }, 800);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        fullName: 'Dennis Cheruiyot',
        username: 'DennisFortune',
        email: 'cheruyot.dennis@student.moringaschool.com',
        phone: '+1 (555) 389-4921',
        country: 'United States',
        referralCode: '505031',
        referredBy: 'AlphaWealth_Corp (505031)',
        joinedDate: '2025-11-14',
        tier: 'Gold VIP',
        kycStatus: 'Verified',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        walletAddressUSDT: 'TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc'
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-sky-500/30 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-sky-400 stroke-[2.5]" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-heading">
            FORTUNE <span className="text-sky-400 font-normal">INVESTMENT</span>
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Institutional Wealth Management & High-Yield Growth Engine
          </p>
        </div>

        {/* Sponsor Banner (Honoring ref=505031) */}
        {referralCode && (
          <div className="mb-4 bg-sky-950/80 border border-sky-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-sky-100 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Referral Invitation Verified</span>
                </div>
                <div className="text-xs text-slate-300">
                  Sponsor Code: <span className="font-mono font-bold text-white bg-sky-900/80 px-2 py-0.5 rounded border border-sky-500/40">#{referralCode}</span>
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Tier 1 VIP Bonus Active
              </span>
            </div>
          </div>
        )}

        {/* Main Auth Card */}
        <div className="bg-white/98 rounded-3xl shadow-2xl border border-sky-100 p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Auth Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200">
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => setAuthMode('register')}
              className={`w-1/2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account (Register)
            </button>
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => setAuthMode('login')}
              className={`w-1/2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Existing Member Sign In
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {authMode === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="reg-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dennis Cheruiyot"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <span className="text-slate-400 absolute left-3 top-2.5 text-xs font-bold">@</span>
                      <input
                        id="reg-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="DennisFortune"
                        className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Country of Residence
                    </label>
                    <div className="relative">
                      <Globe2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="reg-country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {authMode === 'register' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="reg-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-between pb-1">
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('A password reset link has been dispatched to your email address.'); }} className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                    Forgot Password?
                  </a>
                </div>
              )}
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Referral Code (Sponsor ID)</span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Linked (#505031)
                  </span>
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-sky-600 absolute left-3 top-3" />
                  <input
                    id="reg-referral-code"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="505031"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-sky-50/50 border border-sky-200 font-mono font-bold text-sky-900 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Referred by sponsor <b className="text-slate-800">#{referralCode || '505031'}</b>. Earn up to 8% affiliate tier commissions.
                </p>
              </div>
            )}

            {authMode === 'register' && (
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-[11px] text-slate-600 leading-tight">
                    I agree to the <span className="text-sky-600 font-bold underline">Fortune Investment Terms of Service</span>, Risk Disclosure, and Privacy Policy.
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 active:scale-[0.99]"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{authMode === 'register' ? 'Complete Registration & Open Dashboard' : 'Sign In to Fortune Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Quick Demo Access Divider */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-3">Want to preview the live platform immediately?</p>
            <button
              id="demo-access-btn"
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-slate-800 hover:text-sky-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Launch Dennis's VIP Portfolio Demo ($34,850.75 Balance)</span>
            </button>
          </div>

        </div>

        {/* Security Trust Badges */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-slate-400 text-[11px]">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span className="text-slate-300">256-Bit SSL Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Award className="w-5 h-5 text-sky-400" />
            <span className="text-slate-300">Daily Automated Yield</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span className="text-slate-300">Instant TRC20 Payouts</span>
          </div>
        </div>

      </div>
    </div>
  );
};
