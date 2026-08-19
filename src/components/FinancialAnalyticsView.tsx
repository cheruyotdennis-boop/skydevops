import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { WalletState, ActiveInvestment } from '../types';

interface FinancialAnalyticsViewProps {
  wallet: WalletState;
  activeInvestments: ActiveInvestment[];
}

const MONTHLY_EARNINGS_DATA = [
  { month: 'Mar 2026', directYield: 1420, referralBonus: 320, total: 1740 },
  { month: 'Apr 2026', directYield: 2100, referralBonus: 640, total: 2740 },
  { month: 'May 2026', directYield: 3400, referralBonus: 980, total: 4380 },
  { month: 'Jun 2026', directYield: 5200, referralBonus: 1450, total: 6650 },
  { month: 'Jul 2026', directYield: 7800, referralBonus: 2200, total: 10000 },
  { month: 'Aug 2026', directYield: 9820, referralBonus: 3120, total: 12940 },
];

const PROJECTION_DATA = [
  { days: 'Current (Day 0)', conservative: 34850, moderate: 34850, aggressive: 34850 },
  { days: '30 Days Ahead', conservative: 42500, moderate: 47200, aggressive: 52400 },
  { days: '60 Days Ahead', conservative: 51800, moderate: 63900, aggressive: 78900 },
  { days: '90 Days Ahead', conservative: 63200, moderate: 86500, aggressive: 118700 },
  { days: '180 Days Ahead', conservative: 115000, moderate: 198000, aggressive: 340000 },
];

export const FinancialAnalyticsView: React.FC<FinancialAnalyticsViewProps> = ({
  wallet,
  activeInvestments
}) => {
  const [selectedProjection, setSelectedProjection] = useState<'moderate' | 'conservative' | 'aggressive'>('moderate');

  return (
    <div className="space-y-6">
      
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Financial Analytics & Yield Forecasting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deep-dive metrics on historical returns, cashflow velocity, and algorithmic growth projections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Benchmark Rating:</span>
          <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            AAA Institutional Yield
          </span>
        </div>
      </div>

      {/* 3 Key Statistical Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Average Daily Cashflow</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-heading">
            +${(wallet.todayYield).toFixed(2)} <span className="text-xs font-semibold text-emerald-600">/ 24 hrs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Projected weekly yield: ${(wallet.todayYield * 7).toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Compounding Multiplier</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-heading">
            2.45x <span className="text-xs font-semibold text-slate-500">Efficiency</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Reinvestment acceleration enabled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Capital Safety Ratio</span>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-heading">
            100% <span className="text-xs font-semibold text-sky-600">Reserve Backed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Smart contract principal guarantee</p>
        </div>
      </div>

      {/* Monthly Cashflow Breakdown Chart */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Monthly Yield & Affiliate Revenue Growth</h2>
            <p className="text-xs text-slate-500">Separation of direct plan ROI vs affiliate network commissions</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded bg-sky-600"></span>
              <span>Direct Plan ROI</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              <span>Affiliate Bonuses</span>
            </div>
          </div>
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_EARNINGS_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Bar dataKey="directYield" fill="#0284c7" radius={[4, 4, 0, 0]} name="Direct Yield" />
              <Bar dataKey="referralBonus" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Affiliate Bonus" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Algorithmic Projection Engine */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Future Value Growth Projection (Compound Engine)</h2>
            <p className="text-xs text-slate-500">Simulate portfolio trajectory based on current $34,850 base capital</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedProjection('conservative')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedProjection === 'conservative' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Conservative (2.2%)
            </button>
            <button
              onClick={() => setSelectedProjection('moderate')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedProjection === 'moderate' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Moderate (3.5%)
            </button>
            <button
              onClick={() => setSelectedProjection('aggressive')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedProjection === 'aggressive' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Aggressive (4.8%)
            </button>
          </div>
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PROJECTION_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="days" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Projected Valuation']}
              />
              <Line 
                type="monotone" 
                dataKey={selectedProjection} 
                stroke="#0284c7" 
                strokeWidth={3.5}
                dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-700">
            Based on maintaining active contracts and daily re-investments at selected {selectedProjection} rate.
          </div>
          <div className="text-right shrink-0">
            <span className="text-slate-500">180-Day Target: </span>
            <span className="font-extrabold font-mono text-sky-700 text-sm">
              ${PROJECTION_DATA[4][selectedProjection].toLocaleString()} USDT
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
