import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock, 
  Coins, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
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

  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [destinationAddress, setDestinationAddress] = useState(user.walletAddressUSDT);
  const [network, setNetwork] = useState<'TRC20' | 'ERC20'>('TRC20');
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
      setErrorMessage(`Insufficient available cash balance ($${wallet.availableCash.toFixed(2)} max).`);
      return;
    }

    if (!destinationAddress.trim()) {
      setErrorMessage('Please provide a valid USDT destination wallet address.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

      const simulatedHash = `TX${Math.random().toString(36).substring(2, 10).toUpperCase()}92PqmK${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      setTimeout(() => {
        onConfirmWithdrawal(withdrawAmount, destinationAddress, simulatedHash);
        setSuccessStep(false);
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 font-heading">Withdraw Profits</h3>
              <p className="text-xs text-slate-500">Fast payout to external crypto wallet</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successStep ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 font-heading">Withdrawal Dispatched!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              ${withdrawAmount.toLocaleString()} USDT is broadcasting to your TRC20 destination wallet.
            </p>
          </div>
        ) : (
          <div className="my-5 space-y-4 text-xs">
            
            {/* M-PESA Fast Cashout CTA Banner */}
            {onOpenMpesa && (
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center">
                    KES
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-950">Withdraw directly to Safaricom M-PESA</div>
                    <div className="text-[10px] text-emerald-700">Receive cash in Kenyan Shillings instantly</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMpesa();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  Use M-PESA
                </button>
              </div>
            )}

            {/* Available Balance Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between">

              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase">Available for Withdrawal</span>
                <div className="text-xl font-black text-slate-900 font-mono">
                  ${wallet.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWithdrawAmount(Math.floor(wallet.availableCash))}
                className="text-xs font-bold text-sky-700 bg-white border border-sky-300 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-sky-100 cursor-pointer"
              >
                Max Balance
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payout Blockchain Network
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNetwork('TRC20')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                    network === 'TRC20'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold ring-2 ring-sky-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold">USDT (TRC-20)</div>
                  <div className="text-[10px] text-emerald-600">Zero Fee • Instant Speed</div>
                </button>

                <button
                  type="button"
                  onClick={() => setNetwork('ERC20')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                    network === 'ERC20'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold ring-2 ring-sky-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold">USDT (ERC-20)</div>
                  <div className="text-[10px] text-slate-500">Ethereum Mainnet</div>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Withdrawal Amount (USDT)
              </label>
              <input
                type="number"
                min="50"
                max={wallet.availableCash}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Receiving Wallet Address
              </label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
              />
            </div>

            {/* Security PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Security Authorization PIN (Default: 1234)
              </label>
              <input
                type="password"
                maxLength={6}
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none text-center tracking-widest text-sm"
              />
            </div>

            {/* Confirm CTA */}
            <button
              id="confirm-withdrawal-btn"
              type="button"
              disabled={isProcessing || withdrawAmount <= 0 || withdrawAmount > wallet.availableCash}
              onClick={handleExecuteWithdrawal}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isProcessing ? (
                <span>Broadcasting to Blockchain...</span>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Execute Withdrawal (${withdrawAmount.toLocaleString()} USDT)</span>
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
