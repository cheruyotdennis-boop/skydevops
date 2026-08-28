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
import { WalletState, ActiveInvestment } from '../types';

interface FinancialAnalyticsViewProps {
  wallet: WalletState;
  activeInvestments: ActiveInvestment[];
}

const MONTHLY_EARNINGS_DATA = [
  { month: 'Mar 2026', directYield: 45000, referralBonus: 12000, total: 57000 },
  { month: 'Apr 2026', directYield: 68000, referralBonus: 24000, total: 92000 },
  { month: 'May 2026', directYield: 110000, referralBonus: 38000, total: 148000 },
  { month: 'Jun 2026', directYield: 175000, referralBonus: 58000, total: 233000 },
  { month: 'Jul 2026', directYield: 260000, referralBonus: 88000, total: 348000 },
  { month: 'Aug 2026', directYield: 345000, referralBonus: 124000, total: 469000 },
];

const PROJECTION_DATA = [
  { days: 'Current (Day 0)', conservative: 94500, moderate: 94500, aggressive: 94500 },
  { days: '30 Days', conservative: 145000, moderate: 178000, aggressive: 220000 },
  { days: '60 Days', conservative: 220000, moderate: 310000, aggressive: 460000 },
  { days: '90 Days', conservative: 340000, moderate: 540000, aggressive: 890000 },
  { days: '180 Days', conservative: 780000, moderate: 1450000, aggressive: 2600000 },
];

export const FinancialAnalyticsView: React.FC<FinancialAnalyticsViewProps> = ({
  wallet,
  activeInvestments
}) => {
  const [selectedProjection, setSelectedProjection] = useState<'moderate' | 'conservative' | 'aggressive'>('moderate');
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [hoveredLineIdx, setHoveredLineIdx] = useState<number | null>(null);

  // SVG dimensions for Bar Chart
  const barSvgW = 600;
  const barSvgH = 220;
  const barPadX = 45;
  const barPadY = 25;
  const barMaxVal = 400000;
  const barPlotW = barSvgW - barPadX * 2;
  const barPlotH = barSvgH - barPadY * 2;

  // SVG dimensions for Line Chart
  const lineSvgW = 600;
  const lineSvgH = 220;
  const linePadX = 45;
  const linePadY = 25;
  const lineMaxVal = selectedProjection === 'aggressive' ? 2800000 : selectedProjection === 'moderate' ? 1600000 : 900000;
  const linePlotW = lineSvgW - linePadX * 2;
  const linePlotH = lineSvgH - linePadY * 2;

  const projectionPoints = PROJECTION_DATA.map((d, i) => {
    const val = d[selectedProjection];
    const x = linePadX + (i / (PROJECTION_DATA.length - 1)) * linePlotW;
    const y = linePadY + linePlotH - (val / lineMaxVal) * linePlotH;
    return { x, y, data: d, val };
  });

  const linePath = projectionPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
  const lineArea = `${linePath} L ${projectionPoints[projectionPoints.length - 1].x.toFixed(1)} ${(linePadY + linePlotH).toFixed(1)} L ${projectionPoints[0].x.toFixed(1)} ${(linePadY + linePlotH).toFixed(1)} Z`;

  return (
    <div className="space-y-6">
      
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">
            Quantiq Prime Yield Analytics (KES)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deep algorithmic audit of historical dividends, active contract velocities, and compounding forecasts in Kenyan Shillings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0B0F17] border border-amber-500/30 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Compound Rate</span>
            <div className="text-sm font-black text-white font-mono">+18.4% / mo</div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0B0F17]/90 rounded-3xl p-5 border border-amber-500/20 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historical Total Yield</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-heading font-mono">
            Ksh {wallet.totalEarnings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Across active institutional contracts
          </div>
        </div>

        <div className="bg-[#0B0F17]/90 rounded-3xl p-5 border border-amber-500/20 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Affiliate Yield Velocity</div>
          <div className="text-2xl font-black text-amber-400 mt-1 font-heading font-mono">
            Ksh {wallet.referralEarnings.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            20% direct sponsor bonus
          </div>
        </div>

        <div className="bg-[#0B0F17]/90 rounded-3xl p-5 border border-amber-500/20 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Daily Payout</div>
          <div className="text-2xl font-black text-white mt-1 font-heading font-mono">
            Ksh {wallet.todayYield.toLocaleString('en-KE', { minimumFractionDigits: 2 })} / day
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-bold">
            Settled every 24 hours at 00:00 EAT
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="bg-[#0B0F17]/90 rounded-3xl p-6 border border-amber-500/20 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white font-heading">Monthly Harvest Breakdown</h2>
            <p className="text-xs text-slate-400">Direct algorithmic yield vs. affiliate commissions (KES)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">Direct Yield</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Affiliate Bonus</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-4 relative">
          <svg viewBox={`0 0 ${barSvgW} ${barSvgH}`} className="w-full h-full overflow-visible">
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = barPadY + barPlotH * (1 - ratio);
              const val = ratio * barMaxVal;
              return (
                <g key={idx}>
                  <line 
                    x1={barPadX} 
                    y1={y} 
                    x2={barSvgW - barPadX} 
                    y2={y} 
                    stroke="#1E293B" 
                    strokeDasharray="3 3" 
                  />
                  <text 
                    x={barPadX - 6} 
                    y={y + 3} 
                    fill="#64748B" 
                    fontSize="9" 
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {MONTHLY_EARNINGS_DATA.map((d, i) => {
              const slotWidth = barPlotW / MONTHLY_EARNINGS_DATA.length;
              const slotCenterX = barPadX + (i + 0.5) * slotWidth;
              const barWidth = 14;
              
              const hDirect = (d.directYield / barMaxVal) * barPlotH;
              const yDirect = barPadY + barPlotH - hDirect;
              
              const hRef = (d.referralBonus / barMaxVal) * barPlotH;
              const yRef = barPadY + barPlotH - hRef;

              return (
                <g key={i}>
                  {/* Direct Yield Bar (Amber) */}
                  <rect
                    x={slotCenterX - barWidth - 2}
                    y={yDirect}
                    width={barWidth}
                    height={hDirect}
                    rx="3"
                    fill="#F59E0B"
                    className="transition-all hover:opacity-80"
                  />
                  {/* Referral Bonus Bar (Emerald) */}
                  <rect
                    x={slotCenterX + 2}
                    y={yRef}
                    width={barWidth}
                    height={hRef}
                    rx="3"
                    fill="#10B981"
                    className="transition-all hover:opacity-80"
                  />
                  {/* Month Label */}
                  <text
                    x={slotCenterX}
                    y={barSvgH - 6}
                    fill="#64748B"
                    fontSize="9"
                    textAnchor="middle"
                    className="font-medium"
                  >
                    {d.month}
                  </text>

                  {/* Interactive hit strip */}
                  <rect
                    x={slotCenterX - slotWidth / 2}
                    y={0}
                    width={slotWidth}
                    height={barSvgH}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredBarIdx(i)}
                    onMouseLeave={() => setHoveredBarIdx(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Bar Hover Tooltip */}
          {hoveredBarIdx !== null && MONTHLY_EARNINGS_DATA[hoveredBarIdx] && (
            <div 
              className="absolute top-2 bg-[#07090E]/95 border border-amber-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none z-20 text-xs transition-all"
              style={{
                left: `${Math.min(Math.max(10, ((hoveredBarIdx + 0.5) / MONTHLY_EARNINGS_DATA.length) * 100 - 15), 75)}%`
              }}
            >
              <div className="font-bold text-amber-300 font-mono mb-1">{MONTHLY_EARNINGS_DATA[hoveredBarIdx].month}</div>
              <div className="flex items-center justify-between gap-4 text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Direct Yield:
                </span>
                <span className="font-mono font-bold text-amber-400">Ksh {MONTHLY_EARNINGS_DATA[hoveredBarIdx].directYield.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-slate-300 mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Affiliate Bonus:
                </span>
                <span className="font-mono font-bold text-emerald-400">Ksh {MONTHLY_EARNINGS_DATA[hoveredBarIdx].referralBonus.toLocaleString()}</span>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between gap-4 font-bold text-white">
                <span>Total Month:</span>
                <span className="font-mono text-yellow-300">Ksh {MONTHLY_EARNINGS_DATA[hoveredBarIdx].total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projection Line Chart */}
      <div className="bg-[#0B0F17]/90 rounded-3xl p-6 border border-amber-500/20 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white font-heading">6-Month Capital Compound Forecast (KES)</h2>
            <p className="text-xs text-slate-400">Projected portfolio growth based on algorithmic reinvestment</p>
          </div>
          <div className="flex bg-[#07090E] p-1 rounded-xl border border-slate-800 text-xs font-bold">
            {(['conservative', 'moderate', 'aggressive'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedProjection(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  selectedProjection === mode
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full mt-4 relative">
          <svg viewBox={`0 0 ${lineSvgW} ${lineSvgH}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="colorProjGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0"/>
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = linePadY + linePlotH * (1 - ratio);
              const val = ratio * lineMaxVal;
              return (
                <g key={idx}>
                  <line 
                    x1={linePadX} 
                    y1={y} 
                    x2={lineSvgW - linePadX} 
                    y2={y} 
                    stroke="#1E293B" 
                    strokeDasharray="3 3" 
                  />
                  <text 
                    x={linePadX - 6} 
                    y={y + 3} 
                    fill="#64748B" 
                    fontSize="9" 
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : `${(val/1000).toFixed(0)}k`}
                  </text>
                </g>
              );
            })}

            {/* Area and Line Path */}
            <path d={lineArea} fill="url(#colorProjGold)" />
            <path d={linePath} fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

            {/* Points & Labels */}
            {projectionPoints.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#F59E0B"
                  stroke="#07090E"
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={lineSvgH - 6}
                  fill="#64748B"
                  fontSize="9"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {p.data.days}
                </text>
              </g>
            ))}

            {/* Interactive Cursor */}
            {hoveredLineIdx !== null && projectionPoints[hoveredLineIdx] && (
              <g>
                <line
                  x1={projectionPoints[hoveredLineIdx].x}
                  y1={linePadY}
                  x2={projectionPoints[hoveredLineIdx].x}
                  y2={linePadY + linePlotH}
                  stroke="#F59E0B"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={projectionPoints[hoveredLineIdx].x}
                  cy={projectionPoints[hoveredLineIdx].y}
                  r="7"
                  fill="#FEF08A"
                  stroke="#F59E0B"
                  strokeWidth="3"
                />
              </g>
            )}

            {/* Interactive Hit strips */}
            {projectionPoints.map((_, i) => {
              const x = linePadX + (i / (PROJECTION_DATA.length - 1)) * linePlotW;
              const width = linePlotW / PROJECTION_DATA.length;
              return (
                <rect
                  key={i}
                  x={x - width / 2}
                  y={0}
                  width={width}
                  height={lineSvgH}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredLineIdx(i)}
                  onMouseLeave={() => setHoveredLineIdx(null)}
                />
              );
            })}
          </svg>

          {/* Line Tooltip */}
          {hoveredLineIdx !== null && projectionPoints[hoveredLineIdx] && (
            <div 
              className="absolute top-2 bg-[#07090E]/95 border border-amber-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none z-20 text-xs transition-all"
              style={{
                left: `${Math.min(Math.max(10, (hoveredLineIdx / (PROJECTION_DATA.length - 1)) * 100 - 15), 70)}%`
              }}
            >
              <div className="font-bold text-amber-300 font-mono mb-1">{projectionPoints[hoveredLineIdx].data.days}</div>
              <div className="flex items-center justify-between gap-4 text-slate-300">
                <span className="capitalize">{selectedProjection} Compound:</span>
                <span className="font-mono font-bold text-white text-sm">
                  Ksh {projectionPoints[hoveredLineIdx].val.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
