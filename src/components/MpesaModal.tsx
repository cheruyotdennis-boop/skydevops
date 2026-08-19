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
import confetti from 'canvas-confetti';
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
  const [kesAmount, setKesAmount] = useState<number>(13000); // KES 13,000 = $100
  const [mpesaPhone, setMpesaPhone] = useState(user.mpesaNumber || user.phone || '0712345678');
  const [manualReceiptCode, setManualReceiptCode] = useState('');
  
  // Withdrawal state
  const [withdrawUsdAmount, setWithdrawUsdAmount] = useState<number>(100);
  const [withdrawPhone, setWithdrawPhone] = useState(user.mpesaNumber || user.phone || '0712345678');

  // STK Simulation state
  const [stkStatus, setStkStatus] = useState<'idle' | 'prompting' | 'pin_entering' | 'success'>('idle');
  const [simulatedPin, setSimulatedPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedPaybill, setCopiedPaybill] = useState(false);
  const [copiedTill, setCopiedTill] = useState(false);

  const rate = contacts.kesUsdExchangeRate || 130;
  const usdEquivalent = +(kesAmount / rate).toFixed(2);
  const withdrawKesEquivalent = +(withdrawUsdAmount * rate).toFixed(2);

  const handleCopyPaybill = () => {
    navigator.clipboard.writeText(contacts.mpesaPaybill);
    setCopiedPaybill(true);
    setTimeout(() => setCopiedPaybill(false), 2000);
  };

  const handleCopyTill = () => {
    navigator.clipboard.writeText(contacts.mpesaTillNumber);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  // 1. Send STK Push prompt to phone
  const handleTriggerStk = () => {
    setErrorMessage('');
    if (!mpesaPhone.trim()) {
      setErrorMessage('Please enter a valid Safaricom M-PESA phone number.');
      return;
    }
    if (kesAmount < 100) {
      setErrorMessage('Minimum M-PESA deposit is KES 100.');
      return;
    }

    setStkStatus('prompting');
    setTimeout(() => {
      setStkStatus('pin_entering');
    }, 900);
  };

  // 2. Submit M-PESA PIN in the interactive STK dialog
  const handleConfirmMpesaPin = () => {
    if (simulatedPin.length < 4) {
      setErrorMessage('Please enter a 4-digit M-PESA PIN.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStkStatus('success');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const generatedReceipt = `SL${Math.random().toString(36).substring(2, 6).toUpperCase()}9X${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

      setTimeout(() => {
        onConfirmMpesaDeposit(usdEquivalent, kesAmount, generatedReceipt, mpesaPhone);
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
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        onConfirmMpesaDeposit(usdEquivalent, kesAmount, manualReceiptCode.toUpperCase(), mpesaPhone);
        setStkStatus('idle');
        onClose();
      }, 1400);
    }, 1000);
  };

  // 4. M-PESA B2C Withdrawal
  const handleExecuteWithdrawal = () => {
    setErrorMessage('');
    if (withdrawUsdAmount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }
    if (withdrawUsdAmount > wallet.availableCash) {
      setErrorMessage(`Insufficient available cash ($${wallet.availableCash.toFixed(2)} max).`);
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
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

      const generatedReceipt = `SK${Math.random().toString(36).substring(2, 6).toUpperCase()}8X${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

      setTimeout(() => {
        onConfirmMpesaWithdrawal(withdrawUsdAmount, withdrawKesEquivalent, generatedReceipt, withdrawPhone);
        setStkStatus('idle');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-black">
              <span className="tracking-tighter font-mono text-sm">M-PESA</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-lg text-slate-900 font-heading">Lipa Na M-PESA</h3>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Safaricom Kenya
                </span>
              </div>
              <p className="text-xs text-slate-500">Fast Kenyan Shillings (KES) deposits & instant cashouts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {stkStatus === 'success' ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 font-heading">
              {mode === 'deposit' ? 'M-PESA Payment Received!' : 'M-PESA Payout Dispatched!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {mode === 'deposit' 
                ? `KES ${kesAmount.toLocaleString()} ($${usdEquivalent.toFixed(2)} USD) has been credited to your Fortune wallet.`
                : `KES ${withdrawKesEquivalent.toLocaleString()} ($${withdrawUsdAmount.toFixed(2)} USD) sent to Safaricom ${withdrawPhone}.`
              }
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs font-mono text-emerald-800 font-semibold inline-block">
              Safaricom SMS confirmation dispatched
            </div>
          </div>
        ) : stkStatus === 'prompting' || stkStatus === 'pin_entering' ? (
          
          /* Interactive STK Push Simulation Phone Dialog */
          <div className="my-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 border-2 border-emerald-500/40 shadow-2xl relative">
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
                <div className="text-sm font-extrabold text-emerald-400 font-mono">
                  FORTUNE INVESTMENT
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Paybill: {contacts.mpesaPaybill} • Acc: {user.username}
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
                    className="w-32 mx-auto text-center font-mono text-lg tracking-widest bg-slate-800 border border-slate-700 rounded-xl py-1.5 text-white focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStkStatus('idle')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="mpesa-pin-confirm-btn"
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmMpesaPin}
                  className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors font-black flex items-center justify-center gap-1"
                >
                  {isProcessing ? 'Authorizing...' : 'Send PIN'}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-500">
              Simulating direct integration with Safaricom Daraja M-PESA API.
            </p>
          </div>
        ) : (
          
          /* Main Deposit / Withdrawal Form */
          <div className="my-5 space-y-4 text-xs">
            
            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl font-bold">
              <button
                id="mpesa-mode-deposit"
                type="button"
                onClick={() => setMode('deposit')}
                className={`w-1/2 py-2 rounded-lg transition-all ${
                  mode === 'deposit' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deposit via M-PESA
              </button>
              <button
                id="mpesa-mode-withdraw"
                type="button"
                onClick={() => setMode('withdraw')}
                className={`w-1/2 py-2 rounded-lg transition-all ${
                  mode === 'withdraw' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Withdraw to M-PESA
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
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
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      depositMethod === 'stk_push'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>M-PESA STK Push</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">Prompt appears on your phone</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepositMethod('paybill_manual')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      depositMethod === 'paybill_manual'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Paybill / Till Pay</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Enter code manually</div>
                  </button>
                </div>

                {depositMethod === 'stk_push' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Safaricom Phone Number (for STK Prompt)
                      </label>
                      <input
                        id="mpesa-phone-input"
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="0712345678 or 254712345678"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Deposit Amount (KES)</span>
                        <span className="text-emerald-700 font-mono">≈ ${usdEquivalent} USD (Rate: 1 USD = {rate} KES)</span>
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
                          className="w-full pl-12 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap gap-1.5">
                        {[1300, 6500, 13000, 32500, 65000, 130000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setKesAmount(amt)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                              kesAmount === amt
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            KES {amt.toLocaleString()} (${(amt/rate).toFixed(0)})
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      id="trigger-stk-push-btn"
                      type="button"
                      onClick={handleTriggerStk}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Send M-PESA STK Push Prompt (KES {kesAmount.toLocaleString()})</span>
                    </button>
                  </div>
                ) : (
                  /* Manual Paybill Instructions */
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Fortune M-PESA Paybill Details:</span>
                        <span className="text-emerald-600 font-mono">Instant Auto-Verify</span>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 font-mono">
                        <span>Paybill Business No: <b>{contacts.mpesaPaybill}</b></span>
                        <button onClick={handleCopyPaybill} className="text-emerald-600 font-bold p-1">
                          {copiedPaybill ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 font-mono">
                        <span>Account No: <b>{user.username}</b> (or {contacts.mpesaPaybill})</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        M-PESA Confirmation Receipt Code (e.g. SLD89X7Q21)
                      </label>
                      <input
                        type="text"
                        value={manualReceiptCode}
                        onChange={(e) => setManualReceiptCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SLD89X7Q21"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleManualVerify}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Credit M-PESA Code</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Withdrawal Section */
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase">Available for M-PESA Payout</span>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      ${wallet.availableCash.toFixed(2)} USD ≈ KES {(wallet.availableCash * rate).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Withdraw Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="text-slate-400 font-bold absolute left-3 top-2.5">$</span>
                    <input
                      type="number"
                      min="5"
                      max={wallet.availableCash}
                      value={withdrawUsdAmount}
                      onChange={(e) => setWithdrawUsdAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                    You will receive: <b>KES {withdrawKesEquivalent.toLocaleString()}</b> on your phone
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Safaricom Phone Number
                  </label>
                  <input
                    type="tel"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  disabled={isProcessing || withdrawUsdAmount <= 0 || withdrawUsdAmount > wallet.availableCash}
                  onClick={handleExecuteWithdrawal}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send KES {withdrawKesEquivalent.toLocaleString()} to M-PESA ({withdrawPhone})</span>
                </button>
              </div>
            )}

            {/* Official Support Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>M-PESA Support Hotline: <b>{contacts.supportPhone}</b></span>
              <span>24/7 Fast Payouts</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
