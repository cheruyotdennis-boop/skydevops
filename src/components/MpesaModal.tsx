import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  CheckCircle2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Coins, 
  Clock, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  PhoneCall,
  Send
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { safeCopyText } from '../utils/storage';
import { UserProfile, WalletState, PlatformContacts } from '../types';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  wallet: WalletState;
  contacts: PlatformContacts;
  onConfirmMpesaDeposit: (usdAmount: number, kesAmount: number, receiptCode: string, phone: string) => void;
  onConfirmMpesaWithdrawal: (usdAmount: number, kesAmount: number, receiptCode: string, phone: string) => void;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({
  isOpen,
  onClose,
  user,
  wallet,
  contacts,
  onConfirmMpesaDeposit,
  onConfirmMpesaWithdrawal
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [depositMethod, setDepositMethod] = useState<'stk_push' | 'paybill_manual'>('stk_push');
  
  // Deposit state
  const [kesAmount, setKesAmount] = useState<number>(10000);
  const [mpesaPhone, setMpesaPhone] = useState(user.mpesaNumber || user.phone || '0712345678');
  const [manualReceiptCode, setManualReceiptCode] = useState('');
  
  // Withdrawal state
  const [withdrawKesAmount, setWithdrawKesAmount] = useState<number>(5000);
  const [withdrawPhone, setWithdrawPhone] = useState(user.mpesaNumber || user.phone || '0712345678');

  // STK Simulation state
  const [stkStatus, setStkStatus] = useState<'idle' | 'prompting' | 'pin_entering' | 'success'>('idle');
  const [simulatedPin, setSimulatedPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedPaybill, setCopiedPaybill] = useState(false);

  const handleCopyPaybill = () => {
    safeCopyText(contacts.mpesaPaybill);
    setCopiedPaybill(true);
    setTimeout(() => setCopiedPaybill(false), 2000);
  };

  // 1. Trigger STK push prompt simulation
  const handleTriggerStk = () => {
    setErrorMessage('');
    if (!mpesaPhone || mpesaPhone.length < 9) {
      setErrorMessage('Please enter a valid Safaricom phone number (e.g. 0712345678).');
      return;
    }
    if (kesAmount < 100) {
      setErrorMessage('Minimum M-PESA deposit is KES 100.');
      return;
    }

    setStkStatus('prompting');
    setTimeout(() => {
      setStkStatus('pin_entering');
    }, 800);
  };

  // 2. User confirms PIN in phone prompt
  const handleConfirmMpesaPin = () => {
    if (!simulatedPin || simulatedPin.length < 4) {
      setErrorMessage('Please enter a 4-digit M-PESA PIN.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStkStatus('success');
      triggerConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const generatedReceipt = `SL${Math.random().toString(36).substring(2, 6).toUpperCase()}9X${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

      setTimeout(() => {
        onConfirmMpesaDeposit(kesAmount, kesAmount, generatedReceipt, mpesaPhone);
        setStkStatus('idle');
        onClose();
      }, 1500);
    }, 1200);
  };

  // 3. Manual Paybill Verification
  const handleManualVerify = () => {
    setErrorMessage('');
    if (!manualReceiptCode.trim() || manualReceiptCode.length < 6) {
      setErrorMessage('Please enter a valid 10-character M-PESA confirmation code.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStkStatus('success');
      triggerConfetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        onConfirmMpesaDeposit(kesAmount, kesAmount, manualReceiptCode.toUpperCase(), mpesaPhone);
        setStkStatus('idle');
        onClose();
      }, 1400);
    }, 1000);
  };

  // 4. M-PESA B2C Withdrawal
  const handleExecuteWithdrawal = () => {
    setErrorMessage('');
    if (withdrawKesAmount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }
    if (withdrawKesAmount > wallet.availableCash) {
      setErrorMessage(`Insufficient available cash (Ksh ${wallet.availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2 })} max).`);
      return;
    }
    if (!withdrawPhone.trim()) {
      setErrorMessage('Please enter your recipient Safaricom M-PESA number.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStkStatus('success');
      triggerConfetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

      const generatedReceipt = `SK${Math.random().toString(36).substring(2, 6).toUpperCase()}8X${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

      setTimeout(() => {
        onConfirmMpesaWithdrawal(withdrawKesAmount, withdrawKesAmount, generatedReceipt, withdrawPhone);
        setStkStatus('idle');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0B0F17] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-600/30 font-black">
              <span className="tracking-tighter font-mono text-sm">M-PESA</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-lg text-white font-heading">Lipa Na M-PESA</h3>
                <span className="text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Safaricom Kenya
                </span>
              </div>
              <p className="text-xs text-slate-400">Paybill 505031 • Instant KES settlement to balance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {stkStatus === 'success' ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-white font-heading">
              {mode === 'deposit' ? 'M-PESA Payment Received!' : 'M-PESA Payout Dispatched!'}
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {mode === 'deposit' 
                ? `KES ${kesAmount.toLocaleString()} has been credited to your Quantiq Prime balance.`
                : `KES ${withdrawKesAmount.toLocaleString()} sent directly to Safaricom ${withdrawPhone}.`
              }
            </p>
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 font-semibold inline-block">
              Safaricom SMS confirmation dispatched
            </div>
          </div>
        ) : stkStatus === 'prompting' || stkStatus === 'pin_entering' ? (
          
          /* Interactive STK Push Simulation Phone Dialog */
          <div className="my-5 space-y-4">
            <div className="bg-[#07090E] text-white rounded-3xl p-5 border-2 border-emerald-500/60 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Safaricom STK Push Simulation</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">SIM 1 • Safaricom</span>
              </div>

              <div className="my-4 text-center space-y-2">
                <div className="text-xs text-slate-300">
                  Do you want to pay <b className="text-white font-mono">KES {kesAmount.toLocaleString()}</b> to:
                </div>
                <div className="text-sm font-extrabold text-amber-400 font-mono">
                  QUANTIQ PRIME (PAYBILL {contacts.mpesaPaybill})
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Account: {user.username}
                </div>

                <div className="pt-3">
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Enter M-PESA PIN on your phone ({mpesaPhone}):
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={simulatedPin}
                    onChange={(e) => setSimulatedPin(e.target.value)}
                    placeholder="••••"
                    className="w-32 mx-auto text-center font-mono text-lg tracking-widest bg-slate-900 border border-slate-700 rounded-xl py-1.5 text-white focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStkStatus('idle')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="mpesa-pin-confirm-btn"
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmMpesaPin}
                  className="py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl transition-colors font-black flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isProcessing ? 'Authorizing...' : 'Send PIN'}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-500">
              Direct API integration with Safaricom Daraja M-PESA Gateway.
            </p>
          </div>
        ) : (
          
          /* Main Deposit / Withdrawal Form */
          <div className="my-5 space-y-4 text-xs">
            
            {/* Mode Switcher */}
            <div className="flex bg-[#07090E] p-1 rounded-2xl border border-slate-800 font-bold">
              <button
                id="mpesa-mode-deposit"
                type="button"
                onClick={() => setMode('deposit')}
                className={`w-1/2 py-2 rounded-xl transition-all cursor-pointer ${
                  mode === 'deposit' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Deposit via M-PESA
              </button>
              <button
                id="mpesa-mode-withdraw"
                type="button"
                onClick={() => setMode('withdraw')}
                className={`w-1/2 py-2 rounded-xl transition-all cursor-pointer ${
                  mode === 'withdraw' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Withdraw to M-PESA
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {mode === 'deposit' ? (
              <>
                {/* Method selector: STK Push vs Manual Paybill */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositMethod('stk_push')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      depositMethod === 'stk_push'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-[#0E131F] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>M-PESA STK Push</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Prompt appears on phone</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepositMethod('paybill_manual')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      depositMethod === 'paybill_manual'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-[#0E131F] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Paybill / Till Pay</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Enter code manually</div>
                  </button>
                </div>

                {depositMethod === 'stk_push' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Safaricom Phone Number (for STK Prompt)
                      </label>
                      <input
                        id="mpesa-phone-input"
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="0712345678 or 254712345678"
                        className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>Deposit Amount (KES)</span>
                        <span className="text-emerald-400 font-mono">Instant balance credit</span>
                      </label>
                      <div className="relative mb-2">
                        <span className="text-slate-400 font-bold absolute left-3 top-2 text-xs">KES</span>
                        <input
                          id="mpesa-kes-amount"
                          type="number"
                          min="100"
                          step="500"
                          value={kesAmount}
                          onChange={(e) => setKesAmount(Math.max(0, Number(e.target.value)))}
                          className="w-full pl-12 pr-4 py-2 bg-[#07090E] border border-slate-700 rounded-xl font-mono font-black text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap gap-1.5">
                        {[5000, 10000, 25000, 50000, 100000, 200000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setKesAmount(amt)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                              kesAmount === amt
                                ? 'bg-emerald-600 text-slate-950 font-black border-emerald-500'
                                : 'bg-[#07090E] text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            KES {amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      id="trigger-stk-push-btn"
                      type="button"
                      onClick={handleTriggerStk}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Send M-PESA STK Prompt (KES {kesAmount.toLocaleString()})</span>
                    </button>
                  </div>
                ) : (
                  /* Manual Paybill Instructions */
                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#07090E] border border-slate-800 rounded-2xl space-y-2 text-xs">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>Quantiq Prime Paybill Details:</span>
                        <span className="text-emerald-400 font-mono">Instant Auto-Verify</span>
                      </div>

                      <div className="flex items-center justify-between bg-[#0E131F] p-2 rounded-xl border border-slate-700 font-mono">
                        <span>Paybill Business No: <b className="text-amber-400">{contacts.mpesaPaybill}</b></span>
                        <button onClick={handleCopyPaybill} className="text-emerald-400 font-bold p-1 cursor-pointer">
                          {copiedPaybill ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-[#0E131F] p-2 rounded-xl border border-slate-700 font-mono">
                        <span>Account No: <b className="text-amber-400">{user.username}</b> (or {contacts.mpesaPaybill})</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        M-PESA Confirmation Receipt Code (e.g. SLD89X7Q21)
                      </label>
                      <input
                        type="text"
                        value={manualReceiptCode}
                        onChange={(e) => setManualReceiptCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SLD89X7Q21"
                        className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl font-mono font-bold uppercase text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleManualVerify}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isProcessing ? 'Verifying Safaricom Receipt...' : 'Confirm Receipt & Credit Balance'}</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Withdrawal via M-PESA */
              <div className="space-y-3">
                <div className="p-3 bg-[#07090E] border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">Available Balance:</span>
                  <span className="font-mono font-bold text-white">Ksh {wallet.availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Withdrawal Amount (KES)</span>
                    <span className="text-emerald-400 font-mono">Instant Safaricom B2C</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    max={wallet.availableCash}
                    value={withdrawKesAmount}
                    onChange={(e) => setWithdrawKesAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Recipient Safaricom Phone Number
                  </label>
                  <input
                    type="tel"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecuteWithdrawal}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{isProcessing ? 'Dispatching B2C Payment...' : `Withdraw KES ${withdrawKesAmount.toLocaleString()} to M-PESA`}</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
