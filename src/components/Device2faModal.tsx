import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  Laptop, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { UserProfile } from '../types';
import { getCurrentDeviceInfo, maskPhone, maskEmail } from '../utils/deviceSecurity';
import { triggerConfetti } from '../utils/confetti';

interface Device2faModalProps {
  isOpen: boolean;
  user: Partial<UserProfile>;
  expectedCode: string;
  onSuccess: (trustedDevice: boolean) => void;
  onCancel: () => void;
  onResendCode: () => string; // returns new code
}

export const Device2faModal: React.FC<Device2faModalProps> = ({
  isOpen,
  user,
  expectedCode,
  onSuccess,
  onCancel,
  onResendCode
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [currentCode, setCurrentCode] = useState<string>(expectedCode);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [trustDevice, setTrustDevice] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes
  const [copiedCodeNotice, setCopiedCodeNotice] = useState<boolean>(false);
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const deviceInfo = getCurrentDeviceInfo();

  useEffect(() => {
    setCurrentCode(expectedCode);
    setOtpValues(['', '', '', '', '', '']);
    setErrorMessage('');
    setSecondsRemaining(300);
    setShowNotificationToast(true);

    // Auto-focus first digit
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, [expectedCode, isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, secondsRemaining]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1).replace(/\D/g, '');
    const newOtp = [...otpValues];
    newOtp[index] = char;
    setOtpValues(newOtp);
    setErrorMessage('');

    // Auto-advance
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    const entered = newOtp.join('');
    if (entered.length === 6) {
      verifyOtp(entered);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtpValues(newOtp);

    if (pastedData.length === 6) {
      verifyOtp(pastedData);
    } else if (pastedData.length < 6) {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const verifyOtp = (codeToVerify?: string) => {
    const fullCode = codeToVerify || otpValues.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      // Allow currentCode or master code 505031
      if (fullCode === currentCode || fullCode === '505031') {
        triggerConfetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onSuccess(trustDevice);
      } else {
        setIsVerifying(false);
        setErrorMessage('Invalid verification code. Please check your SMS/email and try again.');
        inputRefs.current[0]?.focus();
      }
    }, 600);
  };

  const handleResend = () => {
    const newCode = onResendCode();
    setCurrentCode(newCode);
    setSecondsRemaining(300);
    setOtpValues(['', '', '', '', '', '']);
    setErrorMessage('');
    setShowNotificationToast(true);
    setCopiedCodeNotice(true);
    setTimeout(() => setCopiedCodeNotice(false), 2500);
  };

  const autoFillOtp = () => {
    const digits = currentCode.split('');
    setOtpValues(digits);
    verifyOtp(currentCode);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Real-time SMS / Push Notification Simulated Toast */}
      {showNotificationToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-3 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl text-white flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400">Safaricom & Email OTP</span>
                  <span className="text-[10px] text-slate-400 font-mono">Just Now</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Your Quantiq device code is <strong className="font-mono text-amber-300 text-sm tracking-wider">{currentCode}</strong>
                </p>
                <button
                  onClick={autoFillOtp}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>1-Click Auto-Fill Code</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main 2FA Dialog Card */}
      <div className="bg-[#0B0F17] border border-amber-500/40 rounded-3xl max-w-md w-full text-white shadow-2xl overflow-hidden my-auto backdrop-blur-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E131F] via-[#161208] to-[#0E131F] p-6 border-b border-amber-500/20 text-center relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-inner">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
          </div>

          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
            <Lock className="w-3 h-3" />
            <span>2-Factor Device Security</span>
          </span>

          <h2 className="text-xl font-black text-white font-heading mt-1">
            New Device Login Detected
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            For account and capital protection, verify this login attempt.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Detected Device Info Chip */}
          <div className="bg-[#07090E] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">{deviceInfo.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{deviceInfo.ipPlaceholder}</span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              Unrecognized
            </span>
          </div>

          {/* Delivery Notice */}
          <div className="text-xs text-slate-300 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>SMS Dispatched to: {maskPhone(user.phone || user.mpesaNumber)}</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Notice to: {maskEmail(user.email)}</span>
            </div>
          </div>

          {/* 6-Digit OTP Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 text-center">
              Enter 6-Digit Verification Code
            </label>
            <div className="flex items-center justify-between gap-2 max-w-xs mx-auto">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-12 text-center text-xl font-mono font-black rounded-xl bg-[#07090E] border transition-all focus:outline-none ${
                    digit 
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10' 
                      : 'border-slate-700 text-white focus:border-amber-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs p-2.5 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Trust Device Checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none bg-[#07090E] p-3 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={e => setTrustDevice(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4"
            />
            <span>Trust this browser for 30 days (don't ask again on this device)</span>
          </label>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => verifyOtp()}
              disabled={isVerifying || otpValues.join('').length < 6}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed font-heading"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Device Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Device & Access Portal</span>
                </>
              )}
            </button>

            {/* Resend & Timer */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Expires in <strong className="text-white font-mono">{formatTimer(secondsRemaining)}</strong></span>
              
              <button
                onClick={handleResend}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            </div>

            {copiedCodeNotice && (
              <p className="text-center text-[11px] text-emerald-400 font-medium">
                ✓ New 2FA code generated & dispatched to phone/email
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
