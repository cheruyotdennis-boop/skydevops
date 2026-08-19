import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Layers, 
  Lock,
  Flame,
  Zap
} from 'lucide-react';
import { InvestmentPlan, ActiveInvestment, WalletState } from '../types';
import { INVESTMENT_PLANS } from '../data/mockData';

interface InvestmentsViewProps {
  wallet: WalletState;
  activeInvestments: ActiveInvestment[];
  onSelectPlanToInvest: (plan: InvestmentPlan) => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  wallet,
  activeInvestments,
  onSelectPlanToInvest
}) => {
  // Calculator state
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_gold');
  const [calcAmount, setCalcAmount] = useState<number>(5000);
  const [isCompounding, setIsCompounding] = useState<boolean>(false);

  const selectedPlan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId) || INVESTMENT_PLANS[1];

  // Calculation logic
  const dailyYield = (calcAmount * (selectedPlan.dailyRoi / 100));
  const totalDays = selectedPlan.durationDays;
  
  let totalProfit = 0;
  if (isCompounding) {
    // Compound interest: A = P(1 + r)^t - P
    const r = selectedPlan.dailyRoi / 100;
    const finalAmount = calcAmount * Math.pow(1 + r, totalDays);
    totalProfit = finalAmount - calcAmount;
  } else {
    totalProfit = dailyYield * totalDays;
  }

  const totalReturn = calcAmount + totalProfit;
  const netRoiPercent = ((totalProfit / calcAmount) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-heading">
              Investment Packages & Yield Contracts
            </h1>
            <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
              Principal Protected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose institutional-grade algorithmic plans with daily interest payouts directly credited to your wallet.
          </p>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl px-4 py-2 text-right">
          <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">Available Balance</div>
          <div className="text-lg font-black text-slate-900 font-mono">
            ${wallet.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Interactive ROI Calculator */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Interactive ROI & Yield Profit Calculator</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              Simulate Your Growth Before Investing
            </h2>

            {/* Plan Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                1. Select Investment Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INVESTMENT_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      if (calcAmount < plan.minDeposit) setCalcAmount(plan.minDeposit);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedPlanId === plan.id
                        ? 'bg-sky-600 border-sky-400 text-white font-bold shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-extrabold truncate">{plan.name}</div>
                    <div className="text-[11px] text-sky-200 mt-0.5 font-mono">+{plan.dailyRoi}% daily</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Slider & Input */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>2. Deposit Capital Amount (USDT)</span>
                <span className="text-sky-300 font-mono">${calcAmount.toLocaleString()}</span>
              </div>
              
              <div className="relative mb-3">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min={selectedPlan.minDeposit}
                  max={selectedPlan.maxDeposit}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <input
                type="range"
                min={selectedPlan.minDeposit}
                max={selectedPlan.maxDeposit}
                step={100}
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Min: ${selectedPlan.minDeposit.toLocaleString()}</span>
                <span>Max: ${selectedPlan.maxDeposit.toLocaleString()}</span>
              </div>
            </div>

            {/* Compounding switch */}
            <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Enable Daily Auto-Compounding Multiplier</span>
              </div>
              <input
                type="checkbox"
                checked={isCompounding}
                onChange={(e) => setIsCompounding(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-sky-900/60 to-slate-900/90 border border-sky-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-4">
            <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              Projected Earnings Breakdown
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Contract Duration:</span>
                <span className="font-bold text-white font-mono">{totalDays} Calendar Days</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Daily ROI Return:</span>
                <span className="font-bold text-emerald-400 font-mono">+${dailyYield.toFixed(2)} / day</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Total Net Profit Earned:</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  +${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Total Payout (Capital + Yield):</span>
                <span className="text-xl font-black text-white font-mono">
                  ${totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 text-center text-xs text-emerald-300 font-semibold">
                Net ROI: <b className="text-white">+{netRoiPercent}%</b> over {totalDays} days
              </div>
            </div>

            <button
              onClick={() => onSelectPlanToInvest(selectedPlan)}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-xs sm:text-sm"
            >
              <span>Invest ${calcAmount.toLocaleString()} in {selectedPlan.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 4 Investment Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {INVESTMENT_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              plan.popular
                ? 'border-sky-500 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20'
                : 'border-slate-200/80 shadow-xs hover:shadow-md'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                ★ Most Popular Package
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {plan.durationDays} Days Horizon
                </span>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                  Tier {plan.id.split('_')[1].toUpperCase()}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-2 font-heading">
                {plan.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">
                {plan.tagline}
              </p>

              {/* Rate Highlight */}
              <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="text-3xl font-black text-sky-700 font-heading">
                  {plan.dailyRoi}%
                  <span className="text-xs font-bold text-slate-600 ml-1">/ daily</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-medium">
                  Total Yield: <b className="text-slate-900">{(plan.dailyRoi * plan.durationDays).toFixed(0)}% Net ROI</b>
                </div>
              </div>

              {/* Features list */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between text-slate-700 font-semibold pb-1 border-b border-slate-100">
                  <span>Min Deposit:</span>
                  <span className="font-mono text-slate-900 font-bold">${plan.minDeposit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 font-semibold pb-1 border-b border-slate-100">
                  <span>Max Deposit:</span>
                  <span className="font-mono text-slate-900 font-bold">${plan.maxDeposit.toLocaleString()}</span>
                </div>
                
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectPlanToInvest(plan)}
              className="mt-6 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Invest in {plan.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
