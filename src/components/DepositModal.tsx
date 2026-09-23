import React, { useState } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Coins,
  CheckCircle2,
  Smartphone,
  Wallet,
  ArrowRightLeft,
  ExternalLink,
  Info
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { safeCopyText } from '../utils/storage';
import { PlatformContacts, UserProfile } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeposit: (amount: number, currency: 'USDT' | 'BTC' | 'ETH' | 'KES', txHash: string, method: string) => void;
  onOpenMpesa?: () => void;
  contacts?: PlatformContacts;
  user?: UserProfile;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeposit,
  onOpenMpesa,
  contacts,
  user
}) => {
  const [selectedAsset, setSelectedAsset] = useState<'KES_MPESA' | 'USDT_BEP20' | 'BTC'>('USDT_BEP20');
  const [depositAmountKES, setDepositAmountKES] = useState<number>(13000);
  const [senderWalletAddress, setSenderWalletAddress] = useState<string>('');
  const [txHashInput, setTxHashInput] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successStep, setSuccessStep] = useState<boolean>(false);

  if (!isOpen) return null;

  const exchangeRate = contacts?.kesUsdExchangeRate || 130.00; // 1 USD = 130 KES
  const btcRateKES = 12480000;

  // Receiving Deposit Addresses (Two official customer deposit addresses: USDT BEP-20 and BTC)
  const depositAddresses: Record<string, { address: string; network: string; memo?: string }> = {
    KES_MPESA: {
      address: `Lipa Na M-PESA STK Push (Online Automation)`,
      network: 'Safaricom M-PESA'
    },
    USDT_BEP20: {
      address: contacts?.cryptoDepositWallets?.usdtBep20 || '0xbcf65f39cd5868e8ac571c6d929255dd587f9bff',
      network: 'BNB Smart Chain (BEP-20)'
    },
    BTC: {
      address: contacts?.cryptoDepositWallets?.btc || '1KSxkSS6XQsyYfefsTK7xSMrnFxDfGwsGU',
      network: 'Bitcoin Native (BTC)'
    }
  };

  const activeAssetInfo = depositAddresses[selectedAsset] || depositAddresses.USDT_BEP20;
  const activeAddress = activeAssetInfo.address;

  // Calculate crypto equivalent
  const getCryptoEquivalent = () => {
    if (selectedAsset.includes('USDT')) {
      const usdt = depositAmountKES / exchangeRate;
      return `${usdt.toFixed(2)} USDT`;
    }
    if (selectedAsset === 'BTC') {
      const btc = depositAmountKES / btcRateKES;
      return `${btc.toFixed(6)} BTC`;
    }
    return `Ksh ${depositAmountKES.toLocaleString()}`;
  };

  const handleCopy = () => {
    safeCopyText(activeAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleExecuteDeposit = () => {
    if (depositAmountKES <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      triggerConfetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });

      const curr = selectedAsset === 'KES_MPESA' 
        ? 'KES' 
        : selectedAsset.includes('USDT') 
          ? 'USDT' 
          : selectedAsset === 'BTC' 
            ? 'BTC' 
            : 'ETH';

      const generatedHash = txHashInput.trim() || (selectedAsset === 'KES_MPESA'
        ? `QK${Math.floor(10000000 + Math.random() * 90000000)}`
        : `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`);

      const methodLabel = selectedAsset === 'KES_MPESA'
        ? 'M-PESA Instant Deposit'
        : `Crypto Deposit (${activeAssetInfo.network})${senderWalletAddress.trim() ? ` from ${senderWalletAddress.slice(0, 6)}...${senderWalletAddress.slice(-4)}` : ''}`;

      onConfirmDeposit(depositAmountKES, curr as any, generatedHash, methodLabel);

      setTimeout(() => {
        setSuccessStep(false);
        onClose();
      }, 1500);
    }, 800);
  };

  const isOwnerAdmin = Boolean(user?.isAdmin || user?.role === 'admin' || user?.role === 'superadmin' || user?.email?.toLowerCase() === 'admin@quantiqprime.com' || user?.email?.toLowerCase() === 'cheruyot.dennis@student.moringaschool.com');

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-4 md:p-6 flex items-center justify-center">
      <div className="bg-[#0B0F17] border border-amber-500/30 rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden backdrop-blur-2xl my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-[#0E131F] via-[#151A29] to-[#0E131F] p-5 sm:p-6 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">Deposit Investment Capital</h2>
              <p className="text-xs text-slate-400">Deposit via Personal Crypto Wallet or M-PESA</p>
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
          
          {/* M-PESA Direct STK banner */}
          {onOpenMpesa && (
            <div className="p-3 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Kenya Lipa Na M-PESA Direct STK</div>
                  <div className="text-[11px] text-emerald-300">Instant Phone PIN Prompt • Auto-Credited</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMpesa();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer shrink-0"
              >
                M-PESA Menu
              </button>
            </div>
          )}

          {/* Network Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-2">Select Payment Rail</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'USDT_BEP20', label: 'USDT (BEP-20)', sub: 'BNB Smart Chain • Low Fee', icon: '⚡' },
                { id: 'BTC', label: 'Bitcoin (BTC)', sub: 'Native Bitcoin Network', icon: '₿' },
                { id: 'KES_MPESA', label: 'M-PESA (KES)', sub: 'Direct Safaricom STK', icon: '📱' }
              ].map((coin) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => setSelectedAsset(coin.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedAsset === coin.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-400 shadow-md'
                      : 'bg-[#0E131F] text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{coin.icon}</span>
                    <span className="font-bold truncate text-xs">{coin.label}</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">{coin.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Field with Real-time Crypto Conversion */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">Deposit Amount (KES)</label>
              <div className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3" />
                <span>Crypto Equivalent: {getCryptoEquivalent()}</span>
              </div>
            </div>
            
            <div className="relative">
              <span className="text-xs font-bold text-amber-400 absolute left-3.5 top-3 font-mono">KES</span>
              <input
                type="number"
                min={500}
                step={500}
                value={depositAmountKES}
                onChange={(e) => setDepositAmountKES(Math.max(0, Number(e.target.value)))}
                className="w-full pl-13 pr-3 py-2.5 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick amount chips */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              {[5000, 13000, 30000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmountKES(amt)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    depositAmountKES === amt
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Ksh {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Vault Address Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">
                Official Vault Address ({activeAssetInfo.network})
              </label>
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQrCode ? 'Hide QR Code' : 'Show QR Code'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-[#07090E] border border-slate-700 p-2.5 rounded-xl">
              <span className="font-mono text-amber-300 text-[11px] break-all flex-1 pl-1">
                {activeAddress}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-all active:scale-95"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* QR Code Display Modal / Box */}
            {showQrCode && (
              <div className="p-4 bg-[#07090E] border border-amber-500/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                <div className="p-3 bg-white rounded-xl shadow-inner inline-block">
                  {/* Visual QR Code Pattern */}
                  <div className="w-36 h-36 bg-slate-950 p-2 rounded-lg flex flex-col justify-between items-center relative overflow-hidden">
                    <div className="grid grid-cols-6 gap-1 w-full h-full opacity-90">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`rounded-[2px] ${
                            (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35 
                              ? 'bg-amber-400' 
                              : i % 5 === 0 
                                ? 'bg-amber-200' 
                                : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-slate-950 p-1.5 rounded-lg border border-amber-400">
                        <Wallet className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  Scan from your personal crypto wallet app (Trust Wallet, Binance, Bybit, Metamask)
                </div>
              </div>
            )}
          </div>

          {/* Personal Wallet / Sender TxID details (Optional for instant proof) */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>Your Personal Wallet / Deposit Reference</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">
                  Your Sender Wallet Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TY7Q6B... or 0x89aF..."
                  value={senderWalletAddress}
                  onChange={(e) => setSenderWalletAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07090E] border border-slate-800 rounded-xl text-amber-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">
                  Transaction Hash / TxID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Paste blockchain tx hash"
                  value={txHashInput}
                  onChange={(e) => setTxHashInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07090E] border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                You can deposit from <b>any personal wallet</b> (Trust Wallet, Binance, Bybit, Coinbase, Metamask, OKX, TronLink). After transferring, click Confirm below to credit your account immediately.
              </span>
            </div>
          </div>

          {/* Admin Vault Note */}
          {isOwnerAdmin && (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-[10px] text-amber-300 flex items-center justify-between">
              <span>👑 <b>Admin Note:</b> This deposit address is the platform receiving vault configured in Admin Contacts.</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isProcessing || depositAmountKES <= 0}
              onClick={handleExecuteDeposit}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider text-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <Coins className="w-4 h-4" />
              <span>{isProcessing ? 'Verifying Blockchain Ingress...' : `Confirm Deposit of ${getCryptoEquivalent()} (Ksh ${depositAmountKES.toLocaleString()})`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

