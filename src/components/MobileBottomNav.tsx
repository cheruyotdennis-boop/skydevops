import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Smartphone, 
  Users, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMpesa: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMpesa
}) => {
  return (
    <nav 
      id="mobile-bottom-navbar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090F]/95 backdrop-blur-2xl border-t border-amber-500/30 px-2 py-2 shadow-2xl safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {/* Overview Tab */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Overview</span>
          {activeTab === 'overview' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5"></span>
          )}
        </button>

        {/* Investments / Yield Plans */}
        <button
          onClick={() => setActiveTab('investments')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'investments'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Yield Plans</span>
          {activeTab === 'investments' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5"></span>
          )}
        </button>

        {/* Center Floating M-PESA Action Button */}
        <button
          onClick={onOpenMpesa}
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-slate-950 p-2.5 rounded-full shadow-lg shadow-emerald-500/30 border-2 border-emerald-300 font-black active:scale-95 transition-transform cursor-pointer"
        >
          <Zap className="w-5 h-5 fill-slate-950" />
          <span className="text-[8px] font-black uppercase tracking-wider">M-PESA</span>
        </button>

        {/* Team / Referrals */}
        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'referrals'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Referrals</span>
          {activeTab === 'referrals' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5"></span>
          )}
        </button>

        {/* Security & KYC */}
        <button
          onClick={() => setActiveTab('security')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">KYC & 2FA</span>
          {activeTab === 'security' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
