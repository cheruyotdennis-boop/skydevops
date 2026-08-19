import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Coins, 
  DollarSign, 
  Layers, 
  Share2, 
  Check, 
  Copy, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Activity,
  Flame,
  Smartphone,
  PhoneCall
} from 'lucide-react';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import confetti from 'canvas-confetti';
import { UserProfile, WalletState, ActiveInvestment, Transaction, ChartDataPoint } from '../types';
import { HISTORICAL_GROWTH_DATA } from '../data/mockData';

interface DashboardOverviewProps {
  user: UserProfile;
  wallet: WalletState;
  activeInvestments: ActiveInvestment[];
  transactions: Transaction[];
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenMpesa: () => void;
  onOpenContacts: () => void;
  onOpenInvest: () => void;
  onOpenReferral: () => void;
  onViewAllTransactions: () => void;
  onClaimDailyYield: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  wallet,
  activeInvestments,
  transactions,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenMpesa,
  onOpenContacts,
  onOpenInvest,
  onOpenReferral,
  onViewAllTransactions,
  onClaimDailyYield
}) => {

  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '3M' | '1Y'>('7D');
  const [chartMetric, setChartMetric] = useState<'portfolio' | 'profit'>('portfolio');
  const [copiedLink, setCopiedLink] = useState(false);
  const [liveYieldCounter, setLiveYieldCounter] = useState(wallet.todayYield);

  // Live real-time sub-cent ticking yield effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveYieldCounter(prev => +(prev + 0.0012).toFixed(4));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartData = HISTORICAL_GROWTH_DATA[timeframe] || HISTORICAL_GROWTH_DATA['7D'];

  const referralUrl = `https://fortune-investment.com/register?ref=${user.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaim = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClaimDailyYield();
  };

  const pieData = [
    { name: 'Gold Plan (3.5%)', value: 15000, color: '#0284c7' },
    { name: 'Platinum (4.8%)', value: 10000, color: '#38bdf8' },
    { name: 'Silver Plan (2.2%)', value: 3400.5, color: '#93c5fd' },
    { name: 'Available Cash', value: wallet.availableCash, color: '#0f172a' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Live Yield Streamer Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-sky-800/40">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {user.tier} Account • Verified
              </span>
              <span className="text-xs text-slate-300">
                Sponsor ID: <b className="font-mono text-white">#{user.referralCode}</b>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Welcome back, <span className="text-sky-400">{user.fullName.split(' ')[0]}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your investment assets are generating daily automated returns. All 3 active high-yield contracts are compounding normally.
            </p>
          </div>

          {/* Real-time Yield Accrual Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:w-96 shrink-0">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-sky-200 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Accruing Yield (24h)</span>
              </div>
              <div className="text-2xl font-black font-mono text-white mt-1 flex items-baseline gap-1">
                <span>${liveYieldCounter.toFixed(2)}</span>
                <span className="text-xs font-normal text-sky-300">USDT</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                +3.52% avg daily rate
              </div>
            </div>

            <button
              id="claim-yield-btn"
              onClick={handleClaim}
              className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Claim to Wallet</span>
            </button>
          </div>
        </div>

        {/* Quick Link Share Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <span className="font-semibold text-sky-300 shrink-0">Personal Affiliate Link:</span>
            <span className="font-mono text-slate-300 bg-black/30 px-2.5 py-1 rounded-lg border border-white/10 truncate select-all">
              {referralUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="copy-ref-link-btn"
              onClick={handleCopyLink}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-bold transition-all border border-white/10 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={onOpenReferral}
              className="flex items-center gap-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-3 py-1.5 rounded-lg font-bold transition-all border border-sky-400/20 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Affiliate Hub</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Balance */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Portfolio Value</span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-heading">
              ${wallet.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Available to withdraw:</span>
            <span className="font-bold text-slate-800">${wallet.availableCash.toFixed(2)}</span>
          </div>
        </div>

        {/* Card 2: Active Investments */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Capital in Yield</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-heading">
              ${wallet.activeInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-sky-600 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>{activeInvestments.length} Active Packages</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Daily Expected Yield:</span>
            <span className="font-bold text-emerald-600">+${(wallet.todayYield).toFixed(2)}</span>
          </div>
        </div>

        {/* Card 3: Total Profit */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cumulative Net Profit</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 font-heading">
              +${wallet.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>All-time net returns realized</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall ROI:</span>
            <span className="font-bold text-slate-900">+45.56%</span>
          </div>
        </div>

        {/* Card 4: Referral Commissions */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Affiliate Commissions</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-heading">
              ${wallet.referralEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <span>Tier 1 (8%) + Tier 2 (3%)</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Active Team Members:</span>
            <span className="font-bold text-sky-700">6 Referrals</span>
          </div>
        </div>

      </div>

      {/* Safaricom M-PESA & Kenya Quick Action Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center font-mono text-sm shrink-0 shadow-lg shadow-emerald-500/20">
            M-PESA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white font-heading">
                Lipa Na M-PESA Kenya Fast Channel
              </h3>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Paybill: 505031
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Deposit via STK Push or withdraw straight to your Safaricom mobile line in KES (Rate: $1 ≈ 130 KES).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            id="dash-mpesa-deposit-btn"
            onClick={onOpenMpesa}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>M-PESA Express</span>
          </button>

          <button
            id="dash-contacts-btn"
            onClick={onOpenContacts}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Nairobi Desk & Contacts</span>
          </button>
        </div>
      </div>

      {/* Interactive Financial Growth Chart Section */}

      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-heading">Financial Growth & Earnings Trajectory</h2>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Verified Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical portfolio performance, capital valuation, and accumulated interest payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartMetric('portfolio')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === 'portfolio' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Portfolio Value
              </button>
              <button
                onClick={() => setChartMetric('profit')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === 'profit' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Net Profit
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex bg-sky-50 p-1 rounded-xl text-xs font-bold border border-sky-200">
              {(['7D', '1M', '3M', '1Y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    timeframe === t ? 'bg-sky-600 text-white shadow-2xs' : 'text-sky-800 hover:text-sky-950'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="mt-6 h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="growthColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '12px', 
                  border: '1px solid #1e293b', 
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, chartMetric === 'portfolio' ? 'Portfolio Valuation' : 'Net Profit']}
              />
              {chartMetric === 'portfolio' ? (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="portfolioValue" 
                    stroke="#0284c7" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#growthColor)" 
                    name="Portfolio Value"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="investedCapital" 
                    stroke="#94a3b8" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    fill="none" 
                    name="Invested Base"
                  />
                </>
              ) : (
                <Area 
                  type="monotone" 
                  dataKey="totalProfit" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#profitColor)" 
                  name="Cumulative Profit"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Stats Strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 rounded-xl p-3">
            <span className="text-slate-500 font-medium">Average Daily ROI</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">3.50% / day</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <span className="text-slate-500 font-medium">Next Payout Cycle</span>
            <div className="text-sm font-bold text-sky-700 mt-0.5">In 4 hrs 22 min</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <span className="text-slate-500 font-medium">Compounding Rate</span>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">Active (105% APR)</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <span className="text-slate-500 font-medium">Capital Protection</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">100% Principal Return</div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Active Investments & Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Investments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">Active Yield Portfolios</h2>
              <p className="text-xs text-slate-500">Currently earning continuous interest payouts</p>
            </div>
            <button
              onClick={onOpenInvest}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <span>+ Add Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {activeInvestments.map((inv) => {
              const progressPct = Math.min(100, Math.round((inv.daysPassed / inv.totalDays) * 100));
              return (
                <div key={inv.id} className="p-4 rounded-2xl border border-sky-100 bg-sky-50/30 hover:bg-sky-50/60 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{inv.planName}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Principal: <b className="text-slate-800">${inv.investedAmount.toLocaleString()}</b> • Daily: <b className="text-emerald-600">+${inv.dailyYieldAmount.toFixed(2)}</b> ({inv.dailyRoi}%)
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-500">Total Accrued</div>
                      <div className="text-base font-extrabold text-emerald-600 font-mono">
                        +${inv.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Progress: Day {inv.daysPassed} of {inv.totalDays}</span>
                      <span className="font-bold text-sky-700">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asset & Portfolio Allocation Donut */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Asset Distribution</h2>
            <p className="text-xs text-slate-500">Breakdown of active capital vs cash</p>

            <div className="h-48 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Value']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                <span className="text-sm font-black text-slate-900">${(wallet.totalBalance / 1000).toFixed(1)}k</span>
              </div>
            </div>

            <div className="space-y-2 text-xs mt-2">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenInvest}
            className="mt-4 w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl transition-colors border border-sky-200 cursor-pointer text-center"
          >
            Explore All 4 Investment Plans
          </button>
        </div>

      </div>

      {/* Recent Transactions Mini-Ledger */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Recent Transaction History</h2>
            <p className="text-xs text-slate-500">Live ledger of deposits, withdrawals, and automated daily payouts</p>
          </div>
          <button
            id="view-all-tx-btn"
            onClick={onViewAllTransactions}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Method / Route</th>
                <th className="pb-3 font-semibold text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-medium text-slate-900 flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      tx.type === 'DEPOSIT' ? 'bg-sky-100 text-sky-700' :
                      tx.type === 'ROI_PAYOUT' ? 'bg-emerald-100 text-emerald-700' :
                      tx.type === 'REFERRAL_BONUS' ? 'bg-amber-100 text-amber-700' :
                      tx.type === 'WITHDRAWAL' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {tx.type === 'DEPOSIT' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                      {tx.type === 'ROI_PAYOUT' && <TrendingUp className="w-3.5 h-3.5" />}
                      {tx.type === 'REFERRAL_BONUS' && <Sparkles className="w-3.5 h-3.5" />}
                      {tx.type === 'WITHDRAWAL' && <ArrowUpRight className="w-3.5 h-3.5" />}
                      {tx.type === 'INVESTMENT' && <Layers className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{tx.type.replace('_', ' ')}</div>
                      <div className="text-[10px] text-slate-400">{tx.note}</div>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className={`font-mono font-bold ${
                      tx.type === 'WITHDRAWAL' || tx.type === 'INVESTMENT' ? 'text-slate-900' : 'text-emerald-600'
                    }`}>
                      {tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {tx.currency}
                    </span>
                  </td>

                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3 text-slate-600 font-mono text-[11px] truncate max-w-xs">
                    {tx.methodOrAddress}
                  </td>

                  <td className="py-3 text-right text-slate-500 text-[11px] whitespace-nowrap">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
