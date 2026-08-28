import React from 'react';

interface QuantiqLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const QuantiqLogo: React.FC<QuantiqLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const primeSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[11px] tracking-[0.35em]',
    lg: 'text-sm tracking-[0.4em]',
    xl: 'text-base tracking-[0.45em]'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 3D Metallic Emblem Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 via-amber-300 to-slate-200 shadow-lg shadow-amber-500/20`}>
        <div className="w-full h-full bg-[#07090E] rounded-[14px] flex items-center justify-center p-1 overflow-hidden relative group">
          {/* Subtle gold inner glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-transparent to-slate-300/10 pointer-events-none"></div>
          
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="30%" stopColor="#D4AF37" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#E2E8F0" />
                <stop offset="75%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="chartGold" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FEF08A" />
              </linearGradient>
            </defs>

            {/* Interlocked Golden 'Q' ring */}
            <circle cx="45" cy="45" r="28" stroke="url(#goldGrad)" strokeWidth="8" fill="none" />
            
            {/* Q tail extending diagonally */}
            <path d="M52 52 L72 74 L60 84 L40 62 Z" fill="url(#goldGrad)" />

            {/* Silver 'P' curve interlocking */}
            <path 
              d="M48 24 L72 24 C82 24, 88 32, 88 42 C88 52, 80 58, 68 58 L54 58 L72 82 L60 88 L44 64" 
              stroke="url(#silverGrad)" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
            />

            {/* Candlestick Trading Bars inside the Q */}
            {/* Bar 1 */}
            <line x1="33" y1="52" x2="33" y2="60" stroke="url(#chartGold)" strokeWidth="1.5" />
            <rect x="30.5" y="55" width="5" height="10" rx="1" fill="url(#chartGold)" />
            {/* Bar 2 */}
            <line x1="43" y1="42" x2="43" y2="58" stroke="url(#chartGold)" strokeWidth="1.5" />
            <rect x="40.5" y="45" width="5" height="18" rx="1" fill="url(#chartGold)" />
            {/* Bar 3 */}
            <line x1="53" y1="32" x2="53" y2="52" stroke="url(#chartGold)" strokeWidth="1.5" />
            <rect x="50.5" y="35" width="5" height="22" rx="1" fill="url(#chartGold)" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center tracking-wider">
          <span className={`font-black uppercase tracking-[0.18em] text-white font-heading ${textSizes[size]}`}>
            QUANTI
          </span>
          <span className={`font-black uppercase tracking-[0.18em] bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-heading ${textSizes[size]}`}>
            Q
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <div className="h-[1px] w-3 sm:w-5 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-400"></div>
          <span className={`font-extrabold text-amber-400 uppercase font-heading ${primeSizes[size]}`}>
            PRIME
          </span>
          <div className="h-[1px] w-3 sm:w-5 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-400"></div>
        </div>

        {showTagline && size !== 'sm' && (
          <div className="text-[9px] tracking-[0.16em] text-slate-400 font-semibold uppercase mt-0.5 hidden sm:block">
            Trade Smart <span className="text-amber-500/80 mx-1">|</span> Invest Wise <span className="text-amber-500/80 mx-1">|</span> Grow Together
          </div>
        )}
      </div>
    </div>
  );
};
