import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Sparkles, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvestmentPlan, WalletState } from '../types';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: InvestmentPlan | null;
  wallet: WalletState;
  onConfirmInvest: (plan: InvestmentPlan, amount: number) => void;
  onOpenDeposit: () => void;
}

export const InvestModal: React.FC<InvestModalProps> = ({
  isOpen,
  onClose,
  plan,
  wallet,
  onConfirmInvest,
  onOpenDeposit
}) => {
  if (!isOpen || !plan) return null;

  const [investAmount, setInvestAmount] = useState<number>(
    Math.max(plan.minDeposit, Math.min(plan.maxDeposit, 2500))
  );
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successStep, setSuccessStep] = useState(false);

  const dailyYield = (investAmount * (plan.dailyRoi / 100));
  const totalProfit = dailyYield * plan.durationDays;
  const totalReturn = investAmount + totalProfit;

  const hasSufficientBalance = wallet.availableCash >= investAmount;

  const handleExecuteInvest = () => {
    setErrorMessage('');

    if (investAmount < plan.minDeposit) {
      setErrorMessage(`Minimum deposit for ${plan.name} is $${plan.minDeposit.toLocaleString()}.`);
      return;
    }

    if (investAmount > plan.maxDeposit) {
      setErrorMessage(`Maximum deposit for ${plan.name} is $${plan.maxDeposit.toLocaleString()}.`);
      return;
    }

    if (!hasSufficientBalance) {
      setErrorMessage('Insufficient available cash in your wallet balance.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        onConfirmInvest(plan, investAmount);
        setSuccessStep(false);
        onClose();
      }, 1400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 font-heading">Lock Investment Plan</h3>
              <p className="text-xs text-slate-500">{plan.name} • {plan.dailyRoi}% Daily Yield</p>
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
            <h4 className="text-xl font-black text-slate-900 font-heading">Investment Activated!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              ${investAmount.toLocaleString()} has been placed into {plan.name}. Your first daily yield accrues in 24 hours.
            </p>
          </div>
        ) : (
          <div className="my-5 space-y-4 text-xs">
            
            {/* Balance Preview */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase">Available Wallet Balance</span>
                <div className="text-xl font-black text-slate-900 font-mono">
                  ${wallet.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
                </div>
              </div>

              {!hasSufficientBalance && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDeposit();
                  }}
                  className="text-xs font-bold text-sky-700 bg-white border border-sky-300 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-sky-100 cursor-pointer"
                >
                  + Deposit Funds
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Investment Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Capital Amount to Invest
              </label>
              <div className="relative mb-2">
                <span className="text-slate-400 font-bold absolute left-3 top-2.5">$</span>
                <input
                  type="number"
                  min={plan.minDeposit}
                  max={plan.maxDeposit}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Min: ${plan.minDeposit.toLocaleString()}</span>
                <span>Max: ${plan.maxDeposit.toLocaleString()}</span>
              </div>
            </div>

            {/* Projected Returns Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                Contract Returns Summary
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Daily ROI (+{plan.dailyRoi}%):</span>
                <span className="font-mono font-bold text-emerald-400">+${dailyYield.toFixed(2)} / day</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Contract Duration:</span>
                <span className="font-mono font-bold text-white">{plan.durationDays} Days</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Net Profit Expected:</span>
                <span className="font-mono font-bold text-emerald-400">+${totalProfit.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between text-xs font-bold text-white">
                <span>Total Maturity Payout:</span>
                <span className="font-mono text-base font-black text-white">${totalReturn.toFixed(2)} USDT</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              id="confirm-invest-btn"
              type="button"
              disabled={isProcessing || !hasSufficientBalance}
              onClick={handleExecuteInvest}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isProcessing ? (
                <span>Locking Contract on Chain...</span>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Confirm & Activate Plan (${investAmount.toLocaleString()})</span>
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
