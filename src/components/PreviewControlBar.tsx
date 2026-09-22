import React from 'react';
import { 
  Smartphone, 
  Monitor, 
  UserCheck, 
  Sparkles, 
  ExternalLink,
  Users,
  Eye,
  RefreshCw
} from 'lucide-react';

export type PreviewMode = 'desktop' | 'mobile' | 'new_user_landing';

interface PreviewControlBarProps {
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  currentUser: string;
  isGuest: boolean;
  isAdmin?: boolean;
  onSimulateNewUser: () => void;
  onResetSession: () => void;
  onOpenDatabase?: () => void;
}

export const PreviewControlBar: React.FC<PreviewControlBarProps> = ({
  previewMode,
  setPreviewMode,
  currentUser,
  isGuest,
  isAdmin = false,
  onSimulateNewUser,
  onResetSession,
  onOpenDatabase
}) => {
  return (
    <div 
      id="launch-preview-control-bar"
      className="bg-[#05070C] border-b border-amber-500/30 text-slate-200 px-3 py-2 text-xs sticky top-0 z-50 shadow-2xl backdrop-blur-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-full font-black text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LAUNCH PREVIEW MODE</span>
          </div>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            {previewMode === 'new_user_landing' 
              ? 'Showing what a new visitor sees via your link' 
              : `Active User: ${isGuest ? 'Guest Investor' : currentUser}`}
          </span>
        </div>

        {/* Center Mode Switcher Tabs */}
        <div className="flex items-center bg-[#0C101A] border border-slate-800 p-0.5 rounded-xl">
          {/* New User View Tab */}
          <button
            id="btn-preview-new-user"
            type="button"
            onClick={() => setPreviewMode('new_user_landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewMode === 'new_user_landing'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>New User View</span>
          </button>

          {/* Mobile View Tab */}
          <button
            id="btn-preview-mobile"
            type="button"
            onClick={() => setPreviewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewMode === 'mobile'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View (Phone)</span>
          </button>

          {/* Desktop View Tab */}
          <button
            id="btn-preview-desktop"
            type="button"
            onClick={() => setPreviewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewMode === 'desktop'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isAdmin && onOpenDatabase && (
            <button
              onClick={onOpenDatabase}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-3 py-1 rounded-lg text-[11px] shadow-sm transition-all cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Customer DB</span>
            </button>
          )}

          {previewMode !== 'new_user_landing' && (
            <button
              onClick={onSimulateNewUser}
              className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Simulate New Sign-Up</span>
            </button>
          )}
          
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>Sponsor ID:</span>
            <span className="text-amber-300 font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">#505031</span>
          </div>
        </div>

      </div>
    </div>
  );
};
