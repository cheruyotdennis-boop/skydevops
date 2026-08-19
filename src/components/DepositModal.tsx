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
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WalletState } from '../types';

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

  const [selectedAsset, setSelectedAsset] = useState<'USDT_TRC20' | 'USDT_ERC20' | 'BTC' | 'ETH'>('USDT_TRC20');
  const [depositAmount, setDepositAmount] = useState<number>(2500);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [txHashInput, setTxHashInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successStep, setSuccessStep] = useState(false);

  if (!isOpen) return null;

  const depositAddresses = {
    USDT_TRC20: 'TY7Q6B92PqmK89vXZ01mNa4kVyTe6pQc99',
    USDT_ERC20: '0x89aF49321B008A2d319808389201a4e788bc5541',
    BTC: 'bc1q9p8200193892019384910293481290a1841e7',
    ETH: '0x4428019389201938920193849102934812903491'
  };

  const activeAddress = depositAddresses[selectedAsset];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleExecuteDeposit = () => {
    if (depositAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      
      const simulatedHash = txHashInput.trim() || `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      const assetLabel = selectedAsset.startsWith('USDT') ? 'USDT' : selectedAsset as any;
      const networkLabel = selectedAsset.replace('_', ' ');

      setTimeout(() => {
        onConfirmDeposit(depositAmount, assetLabel, simulatedHash, `${networkLabel} Network Deposit`);
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
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 font-heading">Deposit Capital</h3>
              <p className="text-xs text-slate-500">Fund your Fortune Investment balance</p>
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
            <h4 className="text-xl font-black text-slate-900 font-heading">Deposit Confirmed!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              ${depositAmount.toLocaleString()} USDT has been instantly credited to your available cash balance.
            </p>
          </div>
        ) : (
          <div className="my-5 space-y-4 text-xs">
            
            {/* M-PESA Fast Channel CTA Banner */}
            {onOpenMpesa && (
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center">
                    KES
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-950">Deposit via M-PESA (STK Push)</div>
                    <div className="text-[10px] text-emerald-700">Pay directly with Safaricom in Kenyan Shillings</div>
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

            {/* Asset Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Select Blockchain Payment Method
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'USDT_TRC20', label: 'USDT', sub: 'TRC-20 (Fastest)' },
                  { id: 'USDT_ERC20', label: 'USDT', sub: 'ERC-20' },
                  { id: 'BTC', label: 'Bitcoin', sub: 'BTC Network' },
                  { id: 'ETH', label: 'Ethereum', sub: 'ERC-20' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAsset(item.id as any)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedAsset === item.id
                        ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold ring-2 ring-sky-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Deposit Amount (USDT equivalent)
              </label>
              <div className="relative mb-2">
                <span className="text-slate-400 font-bold absolute left-3 top-2.5">$</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Math.max(10, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {[500, 1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                      depositAmount === amt
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    ${amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Address & QR Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold text-slate-900">Official Deposit Destination:</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Network Active
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 break-all select-all">
                <span>{activeAddress}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-sky-600 hover:text-sky-800 shrink-0 font-bold cursor-pointer"
                >
                  {copiedAddress ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Send only <b>{selectedAsset.replace('_', ' ')}</b> to this address. Credits automatically after 1 network confirmation.
              </p>
            </div>

            {/* Optional Tx Hash input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Transaction Hash / Reference (Optional for manual confirmation)
              </label>
              <input
                type="text"
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                placeholder="e.g. 0x8f72a1b94e3390fa41e78453..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
              />
            </div>

            {/* Confirm CTA */}
            <button
              id="confirm-deposit-action-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleExecuteDeposit}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-98"
            >
              {isProcessing ? (
                <span>Confirming Blockchain Receipt...</span>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Simulate Instant Deposit Credit (${depositAmount.toLocaleString()})</span>
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
