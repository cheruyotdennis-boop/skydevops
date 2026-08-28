import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Wallet, 
  Coins, 
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { ProfileCreationData } from '../types';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (data: ProfileCreationData) => void;
  defaultReferralCode?: string;
}

const AVATAR_OPTIONS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', label: 'Dennis / Executive' },
  { id: '2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', label: 'Investor Pro' },
  { id: '3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', label: 'Wealth Strategist' },
  { id: '4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', label: 'Capital Analyst' },
  { id: '5', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250', label: 'FinTech Advisor' }
];

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  onCreateProfile,
  defaultReferralCode = '505031'
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [mpesaNumber, setMpesaNumber] = useState('07');
  const [country, setCountry] = useState('Kenya');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState(defaultReferralCode);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [walletAddress, setWalletAddress] = useState('');
  const [initialDeposit, setInitialDeposit] = useState<number>(50000);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCreated, setSuccessCreated] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    const generatedRefCode = Math.floor(100000 + Math.random() * 900000).toString();
    const finalUsername = username.trim() || email.split('@')[0].toLowerCase();
    const finalWallet = walletAddress.trim() || `T${Math.random().toString(36).substring(2, 12).toUpperCase()}x7Y9k`;

    setTimeout(() => {
      onCreateProfile({
        fullName,
        username: finalUsername,
        email,
        phone,
        mpesaNumber: mpesaNumber || phone,
        country,
        password,
        referralCode: generatedRefCode,
        avatarUrl: selectedAvatar,
        walletAddressUSDT: finalWallet,
        initialDeposit: initialDeposit > 0 ? initialDeposit : 50000
      });

      setIsSubmitting(false);
      setSuccessCreated(true);
      triggerConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        setSuccessCreated(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B0F17] border border-amber-500/30 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-8 backdrop-blur-2xl">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0E131F] via-[#151A29] to-[#0E131F] p-6 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">Create Investor Profile</h2>
              <p className="text-xs text-slate-400">Enroll new authenticated account with instant wallet setup</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successCreated && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile created successfully! Loading your institutional dashboard...</span>
            </div>
          )}

          {/* Avatar Picker */}
          <div>
            <label className="block text-slate-300 font-bold mb-2">Select Investor Avatar</label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.url)}
                  className={`relative rounded-2xl overflow-hidden p-0.5 border-2 transition-all shrink-0 cursor-pointer ${
                    selectedAvatar === av.url ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av.url} alt={av.label} className="w-12 h-12 rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Legal Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dennis Mwangi"
                  className="w-full pl-9 pr-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Username / Handle</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. dennism"
                className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">M-PESA / Phone Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="0712345678"
                  className="w-full pl-9 pr-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full pl-9 pr-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Sponsor Referral Code</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="505031"
                className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Starting Capital (KES)</label>
              <input
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Profile...' : 'Complete Registration & Launch'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
