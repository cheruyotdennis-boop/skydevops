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
  Zap,
  LogIn,
  Unlock,
  Check
} from 'lucide-react';
import { InvestmentPlan, ActiveInvestment, WalletState } from '../types';
import { INVESTMENT_PLANS } from '../data/mockData';

interface InvestmentsViewProps {
  wallet: WalletState;
  activeInvestments: ActiveInvestment[];
  isAuthenticated?: boolean;
  onSelectPlanToInvest: (plan: InvestmentPlan) => void;
  onRedirectToAuth?: (plan: InvestmentPlan) => void;
  onReleaseMaturedContract?: (contractId: string) => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  wallet,
  activeInvestments,
  isAuthenticated = true,
  onSelectPlanToInvest,
  onRedirectToAuth,
  onReleaseMaturedContract
}) => {
  // Calculator state
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_silver');
  const [calcAmount, setCalcAmount] = useState<number>(30000);
  const [isCompounding, setIsCompounding] = useState<boolean>(false);

  const selectedPlan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId) || INVESTMENT_PLANS[0];

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

  const handlePlanClick = (plan: InvestmentPlan) => {
    if (!isAuthenticated && onRedirectToAuth) {
      onRedirectToAuth(plan);
    } else {
      onSelectPlanToInvest(plan);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-heading">
              Quantiq Prime Yield Contracts
            </h1>
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Capital Locked Until Maturity</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose institutional algorithmic plans with 7.5% daily interest payouts automatically credited to your balance every 24 hours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0B0F17] border border-amber-500/30 rounded-2xl px-4 py-2 text-right shadow-lg">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Available Liquid Cash</div>
            <div className="text-base sm:text-lg font-black text-white font-mono">
              Ksh {wallet.availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-[#0B0F17] border border-slate-700/80 rounded-2xl px-4 py-2 text-right shadow-lg">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Locked Capital</span>
            </div>
            <div className="text-base sm:text-lg font-black text-amber-300 font-mono">
              Ksh {wallet.activeInvested.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Capital Lock & Maturity Rule Info Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-[#0B0F17] border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-amber-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>Security Policy: Balance Locked Until Maturity</span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">Automated 7.5% Daily ROI</span>
            </div>
            <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5 leading-relaxed">
              When activating a contract, your principal is safely locked for the contract horizon (10, 15, or 20 days). Your daily 7.5% yield is paid out every 24h into your liquid cash, and the principal unlocks automatically upon contract maturity.
            </p>
          </div>
        </div>
        {!isAuthenticated && (
          <button
            onClick={() => onRedirectToAuth && onRedirectToAuth(selectedPlan)}
            className="shrink-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:from-amber-400 hover:to-yellow-400 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Invest</span>
          </button>
        )}
      </div>

      {/* Active Locked Contracts if any exist */}
      {activeInvestments.length > 0 && (
        <div className="bg-[#0B0F17]/95 rounded-3xl p-6 border border-amber-500/30 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-heading">
                Active Locked Yield Contracts ({activeInvestments.length})
              </h2>
            </div>
            <span className="text-xs text-amber-400 font-bold">
              Total Locked: Ksh {wallet.activeInvested.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeInvestments.map((inv) => {
              const progressPct = Math.min(100, Math.round((inv.daysPassed / inv.totalDays) * 100));
              const isMatured = inv.daysPassed >= inv.totalDays;

              return (
                <div 
                  key={inv.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isMatured 
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                      : 'bg-[#0E131F] border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xs font-bold text-white font-heading">{inv.planName}</div>
                      <div className="text-[11px] text-slate-400">Contract #{inv.id}</div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                      isMatured
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isMatured ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                      <span>{isMatured ? 'Matured — Ready to Release' : `Locked: Day ${inv.daysPassed} of ${inv.totalDays}`}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Locked Principal</div>
                      <div className="text-xs font-black text-amber-400 font-mono">Ksh {inv.investedAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Daily Yield</div>
                      <div className="text-xs font-black text-emerald-400 font-mono">+Ksh {inv.dailyYieldAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Maturity Date</div>
                      <div className="text-xs font-bold text-slate-200 font-mono">{inv.maturityDate}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Maturity Lock Progress</span>
                      <span className="text-amber-400 font-bold">{progressPct}% ({inv.daysPassed}/{inv.totalDays} Days)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isMatured ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  {isMatured && onReleaseMaturedContract && (
                    <button
                      onClick={() => onReleaseMaturedContract(inv.id)}
                      className="mt-3 w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black rounded-xl hover:from-emerald-400 hover:to-teal-400 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Release Ksh {inv.investedAmount.toLocaleString()} Principal to Liquid Cash</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive ROI Calculator */}
      <div className="bg-[#0B0F17]/95 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30 relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Institutional ROI Yield Calculator (KES)</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              Forecast Growth & Compounded Returns
            </h2>

            {/* Plan Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                1. Select Yield Package Tier
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
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-[#0E131F] border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-extrabold truncate">{plan.name}</div>
                    <div className={`text-[11px] mt-0.5 font-mono ${selectedPlanId === plan.id ? 'text-slate-900 font-bold' : 'text-amber-400'}`}>
                      +{plan.dailyRoi}% daily • {plan.durationDays}d
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Slider & Input */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>2. Deposit Capital (Kenyan Shillings)</span>
                <span className="text-amber-400 font-mono font-bold">Ksh {calcAmount.toLocaleString()}</span>
              </div>
              
              <div className="relative mb-3">
                <span className="text-xs font-bold text-amber-400 absolute left-3 top-3 font-mono">KES</span>
                <input
                  type="number"
                  min={selectedPlan.minDeposit}
                  max={selectedPlan.maxDeposit}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#0E131F] border border-amber-500/40 rounded-xl py-2.5 pl-12 pr-4 text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Slider */}
              <input
                type="range"
                min={selectedPlan.minDeposit}
                max={selectedPlan.maxDeposit}
                step={1000}
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>Min: Ksh {selectedPlan.minDeposit.toLocaleString()}</span>
                <span>Max: Ksh {selectedPlan.maxDeposit.toLocaleString()}</span>
              </div>
            </div>

            {/* Compounding Toggle */}
            <div className="flex items-center justify-between bg-[#0E131F] p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Compound Daily Yields</div>
                  <div className="text-[11px] text-slate-400">Auto-reinvest daily 7.5% for geometric profit growth</div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setIsCompounding(!isCompounding)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isCompounding ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
              </button>
            </div>

          </div>

          {/* Result Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0E131F] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase text-slate-400">Contract Term</span>
              <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40">
                🔒 {totalDays} Days Locked Horizon
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Initial Principal (Locked):</span>
                <span className="text-sm font-bold text-white font-mono">
                  Ksh {calcAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Daily Automated ROI (7.5%):</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  +Ksh {dailyYield.toLocaleString('en-KE', { minimumFractionDigits: 2 })} / day
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Referral Bonus on Referee (10%):</span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  +Ksh {(calcAmount * 0.10).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Net Yield Profit:</span>
                <span className="text-sm font-extrabold text-emerald-300 font-mono">
                  +Ksh {totalProfit.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Total Payout (Capital + Yield):</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  Ksh {totalReturn.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 text-center text-xs text-emerald-300 font-bold">
                Net ROI: <b className="text-white">+{netRoiPercent}%</b> over {totalDays} days • Principal returns on maturity
              </div>
            </div>

            <button
              onClick={() => handlePlanClick(selectedPlan)}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3.5 rounded-xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-xs sm:text-sm"
            >
              {isAuthenticated ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Lock in Ksh {calcAmount.toLocaleString()} in {selectedPlan.name}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register to Activate {selectedPlan.name}</span>
                </>
              )}
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
            className={`relative bg-[#0B0F17]/90 rounded-3xl p-6 border transition-all flex flex-col justify-between backdrop-blur-xl ${
              plan.popular
                ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                : 'border-slate-800 shadow-md hover:border-amber-500/40'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                ★ Prime Recommended
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{plan.durationDays} Days Horizon</span>
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Tier {plan.id.split('_')[1].toUpperCase()}
                </span>
              </div>

              <h3 className="text-lg font-black text-white mt-2 font-heading">
                {plan.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[32px] leading-relaxed">
                {plan.tagline}
              </p>

              {/* Rate Highlight */}
              <div className="mt-4 p-4 rounded-2xl bg-[#07090E] border border-amber-500/30">
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {plan.dailyRoi}%
                  <span className="text-xs font-bold text-slate-400 ml-1">/ daily</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-medium flex items-center justify-between">
                  <span>Total Yield: <b className="text-emerald-400 font-mono">{(plan.dailyRoi * plan.durationDays).toFixed(0)}% Net</b></span>
                  <span className="text-amber-400 font-bold font-mono">🔒 Locked {plan.durationDays}d</span>
                </div>
              </div>

              {/* Features list */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between text-slate-400 font-semibold pb-1 border-b border-slate-800">
                  <span>Min Deposit:</span>
                  <span className="font-mono text-white font-bold">Ksh {plan.minDeposit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-semibold pb-1 border-b border-slate-800">
                  <span>Max Deposit:</span>
                  <span className="font-mono text-white font-bold">Ksh {plan.maxDeposit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-amber-400 font-semibold pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Lock Terms:</span>
                  </span>
                  <span className="font-bold text-white">Locked until maturity</span>
                </div>
                
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePlanClick(plan)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isAuthenticated ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Invest in {plan.name}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to Select Plan</span>
                </>
              )}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
