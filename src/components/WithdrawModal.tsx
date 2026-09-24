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
  Info,
  Wallet,
  ArrowRightLeft,
  Copy,
  Check,
  Clock
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { WalletState, UserProfile, PlatformContacts } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  user: UserProfile;
  onConfirmWithdrawal: (amount: number, address: string, txHash: string) => void;
  onOpenMpesa?: () => void;
  contacts?: PlatformContacts;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  wallet,
  user,
  onConfirmWithdrawal,
  onOpenMpesa,
  contacts,
  onUpdateUser
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Math.min(13000, wallet.availableCash));
  const [network, setNetwork] = useState<'MPESA' | 'BEP20' | 'BTC'>('BEP20');
  const [destinationAddress, setDestinationAddress] = useState(user.walletAddressUSDT || '0xbcf65f39cd5868e8ac571c6d929255dd587f9bff');
  const [saveAsDefaultWallet, setSaveAsDefaultWallet] = useState<boolean>(true);
  const [securityPin, setSecurityPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successStep, setSuccessStep] = useState(false);

  if (!isOpen) return null;

  const exchangeRate = contacts?.kesUsdExchangeRate || 130.00;
  const btcRateKES = 12480000;

  // 24-Hour Yield Liquidity Rule calculation
  const depositTimestamp = user.lastDepositTime || user.firstDepositTime || user.joinedDate;
  const depositDateMs = depositTimestamp ? new Date(depositTimestamp).getTime() : Date.now() - 25 * 60 * 60 * 1000;
  const hoursSinceDeposit = Math.max(0, (Date.now() - depositDateMs) / (1000 * 60 * 60));
  const hoursRemainingUntil24h = Math.max(0, 24 - hoursSinceDeposit);
  const is24HoursPassed = hoursSinceDeposit >= 24;

  // Calculate crypto receiving amount
  const getCryptoPayoutEstimate = () => {
    if (network === 'BEP20') {
      const usdt = withdrawAmount / exchangeRate;
      return `${usdt.toFixed(2)} USDT`;
    }
    if (network === 'BTC') {
      const btc = withdrawAmount / btcRateKES;
      return `${btc.toFixed(6)} BTC`;
    }
    return `Ksh ${withdrawAmount.toLocaleString()}`;
  };

  // Quick switch network and prepopulate relevant address
  const handleSelectNetwork = (rail: 'MPESA' | 'BEP20' | 'BTC') => {
    setNetwork(rail);
    setErrorMessage('');
    if (rail === 'MPESA') {
      setDestinationAddress(user.mpesaNumber || user.phone || '0712345678');
    } else if (rail === 'BEP20') {
      setDestinationAddress(user.walletAddressUSDT || '0xbcf65f39cd5868e8ac571c6d929255dd587f9bff');
    } else if (rail === 'BTC') {
      setDestinationAddress(user.walletAddressBTC || '1KSxkSS6XQsyYfefsTK7xSMrnFxDfGwsGU');
    }
  };

  const handleExecuteWithdrawal = () => {
    setErrorMessage('');

    if (withdrawAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount.');
      return;
    }

    if (withdrawAmount > wallet.availableCash) {
      setErrorMessage(`Amount exceeds available balance of Ksh ${wallet.availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2 })}.`);
      return;
    }

    // 24-Hour Policy Check: Allows withdrawal after 24 hours of algorithmic yield cycle
    if (!is24HoursPassed && wallet.totalBalance > 0 && wallet.availableCash > 0) {
      const remainingH = Math.ceil(hoursRemainingUntil24h);
      setErrorMessage(`24-Hour Trading Cycle: Withdrawals unlock 24 hours after deposit cycle start (${remainingH}h remaining). All accrued yields are paid out.`);
      return;
    }

    const cleanDest = destinationAddress.trim();
    if (!cleanDest) {
      setErrorMessage(`Please provide your personal ${network === 'MPESA' ? 'M-PESA phone number' : `${network} wallet address`}.`);
      return;
    }

    // Basic format sanity checks
    if (network === 'BEP20' && !cleanDest.startsWith('0x')) {
      setErrorMessage('USDT (BEP-20) addresses start with "0x". Please verify your personal wallet address.');
      return;
    }
    if (network === 'MPESA' && !/^(07|01|254|\+254)/.test(cleanDest.replace(/\s+/g, ''))) {
      setErrorMessage('Please provide a valid Kenya Safaricom phone number (e.g. 0712345678 or 2547...).');
      return;
    }

    if (!securityPin || securityPin.length < 4) {
      setErrorMessage('Please enter your 4-digit security PIN.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      triggerConfetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });

      // If user opted to save this personal wallet address to their profile
      if (saveAsDefaultWallet && onUpdateUser) {
        if (network === 'BEP20') {
          onUpdateUser({ walletAddressUSDT: cleanDest });
        } else if (network === 'BTC') {
          onUpdateUser({ walletAddressBTC: cleanDest });
        } else if (network === 'MPESA') {
          onUpdateUser({ mpesaNumber: cleanDest });
        }
      }

      const mockHash = network === 'MPESA' 
        ? `WSF${Math.floor(10000000 + Math.random() * 90000000)}` 
        : `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

      onConfirmWithdrawal(withdrawAmount, cleanDest, mockHash);

      setTimeout(() => {
        setSuccessStep(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-4 md:p-6 flex items-center justify-center">
      <div className="bg-[#0B0F17] border border-amber-500/30 rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden backdrop-blur-2xl my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-[#0E131F] via-[#151A29] to-[#0E131F] p-5 sm:p-6 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">Withdraw Liquid Capital</h2>
              <p className="text-xs text-slate-400">Direct settlement to your Personal Crypto Wallet or M-PESA</p>
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
        <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 overscroll-contain">
          
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Balance Breakdown: Available vs Active Allocation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#07090E] border border-emerald-500/40">
              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Withdrawable Cash</span>
              <div className="text-base sm:text-lg font-black font-mono text-white mt-1">
                Ksh {wallet.availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">
                {is24HoursPassed ? 'Ready for Instant Payout' : `Unlocks in ${Math.ceil(hoursRemainingUntil24h)}h`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#07090E] border border-amber-500/30">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>Active Investment Pool</span>
              </span>
              <div className="text-base sm:text-lg font-black font-mono text-amber-300 mt-1">
                Ksh {wallet.activeInvested.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Automated 7.5% daily yield</span>
            </div>
          </div>

          {/* 24-Hour Withdrawal Access Notice */}
          <div className="p-3 rounded-2xl bg-[#07090E] border border-amber-500/30 text-slate-300 text-[11px] flex items-start gap-2.5 leading-relaxed">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-300 font-bold">24-Hour Yield & Liquidity Policy:</span>
              <p className="text-slate-300 mt-0.5">
                Clients can withdraw available earnings and capital after every <b>24-hour cycle</b>. Daily returns are credited every 24h directly to your wallet for instant cashout.
              </p>
            </div>
          </div>

          {/* Network Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Select Payout Rail</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'BEP20', label: 'USDT (BEP-20)', sub: 'Binance Smart Chain', icon: '⚡' },
                { id: 'BTC', label: 'Bitcoin (BTC)', sub: 'Native SegWit / Taproot', icon: '₿' },
                { id: 'MPESA', label: 'M-PESA (KES)', sub: 'Safaricom Direct', icon: '📱' }
              ].map((rail) => (
                <button
                  key={rail.id}
                  type="button"
                  onClick={() => handleSelectNetwork(rail.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    network === rail.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-400 shadow-md'
                      : 'bg-[#0E131F] text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{rail.icon}</span>
                    <span className="truncate text-xs">{rail.label}</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">{rail.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Field with Real-time Crypto Conversion */}
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

            {/* Live payout preview badge */}
            <div className="mt-2 p-2.5 bg-[#07090E] border border-amber-500/20 rounded-xl flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>You will receive in your personal wallet:</span>
              </span>
              <span className="font-mono font-bold text-amber-300 text-xs">
                {getCryptoPayoutEstimate()}
              </span>
            </div>
          </div>

          {/* Personal Destination Address Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {network === 'MPESA' ? 'Personal M-PESA Phone Number' : `Personal ${network} Wallet Address`}
                </span>
              </label>

              {network !== 'MPESA' && user.walletAddressUSDT && (
                <button
                  type="button"
                  onClick={() => setDestinationAddress(user.walletAddressUSDT)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                >
                  Use Saved Profile Wallet
                </button>
              )}
            </div>

            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder={
                network === 'MPESA' 
                  ? 'e.g. 0712345678 or 2547...' 
                  : network === 'BEP20'
                    ? 'Paste your personal BEP-20 USDT wallet (e.g. 0x...)'
                    : 'Paste your personal Bitcoin address (e.g. bc1q...)'
              }
              className="w-full px-3 py-2.5 bg-[#07090E] border border-slate-700 rounded-xl text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
            />

            {/* Checkbox: Save as default personal wallet */}
            <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={saveAsDefaultWallet}
                onChange={(e) => setSaveAsDefaultWallet(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <span>Save this as my default personal withdrawal wallet</span>
            </label>

            <div className="p-2.5 rounded-xl bg-[#07090E] border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              💡 <b>Personal Wallet Notice:</b> You can withdraw to <b>any personal wallet address</b> of your choice (such as Trust Wallet, Binance, Bybit, Coinbase, Metamask, OKX, Ledger, Exodus, or TronLink). Network fee is <b>0 KES</b> (sponsored by platform).
            </div>
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
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <Coins className="w-4 h-4" />
              <span>{isProcessing ? 'Authorizing Payout Rails...' : `Confirm Withdrawal of Ksh ${withdrawAmount.toLocaleString()} (${getCryptoPayoutEstimate()})`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

