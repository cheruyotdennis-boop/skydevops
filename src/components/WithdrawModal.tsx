import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone,
  Info
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { WalletState, UserProfile } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  user: UserProfile;
  onConfirmWithdrawal: (amount: number, address: string, txHash: string) => void;
  onOpenMpesa?: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  wallet,
  user,
  onConfirmWithdrawal,
  onOpenMpesa
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Math.min(5000, wallet.availableCash));
  const [destinationAddress, setDestinationAddress] = useState(user.mpesaNumber || user.phone || '0712345678');
  const [network, setNetwork] = useState<'MPESA' | 'TRC20' | 'ERC20'>('MPESA');
  const [securityPin, setSecurityPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successStep, setSuccessStep] = useState(false);

  if (!isOpen) return null;

  const handleExecuteWithdrawal = () => {
    setErrorMessage('');

    if (withdrawAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount.');
      return;
    }

    if (withdrawAmount > wallet.availableCash) {
      setErrorMessage(`Amount exceeds available liquid cash. Your Ksh ${wallet.activeInvested.toLocaleString('en-KE', { minimumFractionDigits: 2 })} in yield packages is locked until maturity.`);
      return;
    }

    if (!destinationAddress.trim()) {
      setErrorMessage('Please provide a valid destination phone number or wallet address.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      triggerConfetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

      const mockHash = network === 'MPESA' ? `WSF${Math.floor(10000000 + Math.random() * 90000000)}` : `0x${Math.random().toString(16).substring(2, 18)}...`;
      onConfirmWithdrawal(withdrawAmount, destinationAddress, mockHash);

      setTimeout(() => {
        setSuccessStep(false);
        onClose();
      }, 1400);
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B0F17] border border-amber-500/30 rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden backdrop-blur-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E131F] via-[#151A29] to-[#0E131F] p-6 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">Withdraw Liquid Capital</h2>
              <p className="text-xs text-slate-400">Zero-fee instant settlement to your M-PESA or wallet</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Balance Breakdown: Liquid vs Locked */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#07090E] border border-emerald-500/40">
              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Withdrawable Cash</span>
              <div className="text-base sm:text-lg font-black font-mono text-white mt-1">
                Ksh {wallet.availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Unlocked & Ready</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#07090E] border border-amber-500/30">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Locked Capital</span>
              </span>
              <div className="text-base sm:text-lg font-black font-mono text-amber-300 mt-1">
                Ksh {wallet.activeInvested.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Locked until maturity</span>
            </div>
          </div>

          {/* Locked Balance Policy Explainer */}
          {wallet.activeInvested > 0 && (
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-slate-300 text-[11px] flex items-start gap-2 leading-relaxed">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-300 font-bold">Maturity Lock Rule:</span> Capital in active investment contracts (Ksh {wallet.activeInvested.toLocaleString()}) remains in high-yield algorithmic trading and releases automatically upon contract maturity. Daily ROI profits in Available Cash can be withdrawn anytime.
              </div>
            </div>
          )}

          {/* M-PESA Option Banner */}
          {onOpenMpesa && (
            <div className="p-3 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-white text-xs">Direct Safaricom M-PESA</div>
                  <div className="text-[10px] text-emerald-300">Instant KES to Paybill 505031 / Phone</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMpesa();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-1 rounded-xl cursor-pointer text-xs"
              >
                M-PESA Menu
              </button>
            </div>
          )}

          {/* Network Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Select Payout Rail</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setNetwork('MPESA');
                  setDestinationAddress(user.mpesaNumber || user.phone || '0712345678');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  network === 'MPESA'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-400 shadow-md'
                    : 'bg-[#0E131F] text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">M-PESA</div>
                <div className="text-[10px] opacity-80">Instant KES</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNetwork('TRC20');
                  setDestinationAddress(user.walletAddressUSDT);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  network === 'TRC20'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-400'
                    : 'bg-[#0E131F] text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">USDT (TRC-20)</div>
                <div className="text-[10px] opacity-80">Fast</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNetwork('ERC20');
                  setDestinationAddress(user.walletAddressUSDT);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  network === 'ERC20'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-400'
                    : 'bg-[#0E131F] text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">USDT (ERC-20)</div>
                <div className="text-[10px] opacity-80">Standard</div>
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-300">Withdrawal Amount (KES)</label>
              <button
                type="button"
                onClick={() => setWithdrawAmount(wallet.availableCash)}
                className="text-amber-400 hover:text-amber-300 font-bold text-[11px] cursor-pointer"
              >
                MAX: Ksh {wallet.availableCash.toLocaleString()}
              </button>
            </div>
            <div className="relative">
              <span className="text-xs font-bold text-amber-400 absolute left-3 top-3 font-mono">KES</span>
              <input
                type="number"
                min={100}
                max={wallet.availableCash}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full pl-12 pr-3 py-2.5 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Destination Address Field */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {network === 'MPESA' ? 'Safaricom M-PESA Phone Number' : `Destination Address (${network})`}
            </label>
            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder={network === 'MPESA' ? 'e.g. 0712345678 or 2547...' : 'e.g. TY7Q6B92PqmK89vXZ01mNa...'}
              className="w-full px-3 py-2.5 bg-[#07090E] border border-slate-700 rounded-xl text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Security PIN */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">4-Digit Security PIN</label>
            <input
              type="password"
              maxLength={4}
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value)}
              className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isProcessing || wallet.availableCash <= 0}
              onClick={handleExecuteWithdrawal}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Coins className="w-4 h-4" />
              <span>{isProcessing ? 'Authorizing Payout Rails...' : `Confirm Withdrawal of Ksh ${withdrawAmount.toLocaleString()}`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
