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
  Smartphone
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { safeCopyText } from '../utils/storage';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeposit: (amount: number, currency: 'USDT' | 'BTC' | 'ETH', txHash: string, method: string) => void;
  onOpenMpesa?: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeposit,
  onOpenMpesa
}) => {
  const [selectedAsset, setSelectedAsset] = useState<'KES_MPESA' | 'USDT_TRC20' | 'USDT_ERC20' | 'BTC' | 'ETH'>('KES_MPESA');
  const [depositAmount, setDepositAmount] = useState<number>(10000);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [txHashInput, setTxHashInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successStep, setSuccessStep] = useState(false);

  if (!isOpen) return null;

  const depositAddresses = {
    KES_MPESA: 'Paybill: 505031 | Acc: VIP-QP',
    USDT_TRC20: 'TY7Q6B92PqmK89vXZ01mNa4kVyTe6pQc99',
    USDT_ERC20: '0x89aF49321B008A2d319808389201a4e788bc5541',
    BTC: 'bc1q9p8200193892019384910293481290a1841e7',
    ETH: '0x4428019389201938920193849102934812903491'
  };

  const activeAddress = depositAddresses[selectedAsset];

  const handleCopy = () => {
    safeCopyText(activeAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleExecuteDeposit = () => {
    if (depositAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      triggerConfetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

      const curr = selectedAsset === 'KES_MPESA' ? 'KES' : selectedAsset.includes('USDT') ? 'USDT' : selectedAsset === 'BTC' ? 'BTC' : 'ETH';
      const mockHash = txHashInput.trim() || `MPX${Math.floor(10000000 + Math.random() * 90000000)}`;
      
      onConfirmDeposit(depositAmount, curr as any, mockHash, selectedAsset === 'KES_MPESA' ? 'M-PESA Instant Deposit' : `Crypto Deposit (${selectedAsset})`);

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
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">Deposit Investment Capital</h2>
              <p className="text-xs text-slate-400">Institutional instant settlement rails (KES)</p>
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
        <div className="p-6 space-y-5 text-xs">
          
          {/* M-PESA Option Banner */}
          {onOpenMpesa && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Kenya Lipa Na M-PESA Direct STK</div>
                  <div className="text-[11px] text-emerald-300">Paybill 505031 • Instant Auto Crediting</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMpesa();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
              >
                M-PESA Menu
              </button>
            </div>
          )}

          {/* Network Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-2">Select Payment Channel</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'KES_MPESA', label: 'M-PESA (KES)', fee: 'Instant Auto' },
                { id: 'USDT_TRC20', label: 'USDT TRC20', fee: 'Zero Fee' },
                { id: 'USDT_ERC20', label: 'USDT ERC20', fee: 'Standard' },
                { id: 'BTC', label: 'Bitcoin (BTC)', fee: 'Native' },
                { id: 'ETH', label: 'Ethereum (ETH)', fee: 'Native' }
              ].map((coin) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => setSelectedAsset(coin.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedAsset === coin.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-400 shadow-md'
                      : 'bg-[#0E131F] text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold truncate">{coin.label}</div>
                  <div className="text-[10px] opacity-80">{coin.fee}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Deposit Amount (KES)</label>
            <div className="relative">
              <span className="text-xs font-bold text-amber-400 absolute left-3 top-3 font-mono">KES</span>
              <input
                type="number"
                min={500}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full pl-12 pr-3 py-2.5 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Deposit Address Box */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Payment Reference / Vault Destination</label>
            <div className="flex items-center gap-2 bg-[#07090E] border border-slate-700 p-2 rounded-xl">
              <span className="font-mono text-amber-300 text-[11px] truncate flex-1 pl-2">
                {activeAddress}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleExecuteDeposit}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>{isProcessing ? 'Verifying Deposit Ingress...' : `Confirm Deposit of Ksh ${depositAmount.toLocaleString()}`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
