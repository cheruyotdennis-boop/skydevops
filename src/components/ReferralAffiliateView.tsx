import React, { useState } from 'react';
import { 
  Share2, 
  Gift, 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Award, 
  QrCode, 
  MessageCircle, 
  Send, 
  Twitter, 
  Mail,
  DollarSign,
  Layers,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, WalletState, ReferralMember } from '../types';
import { INITIAL_REFERRALS } from '../data/mockData';

interface ReferralAffiliateViewProps {
  user: UserProfile;
  wallet: WalletState;
}

export const ReferralAffiliateView: React.FC<ReferralAffiliateViewProps> = ({
  user,
  wallet
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [referrals, setReferrals] = useState<ReferralMember[]>(INITIAL_REFERRALS);
  const [selectedTierTab, setSelectedTierTab] = useState<1 | 2 | 3>(1);

  const referralUrl = `https://fortune-investment.com/register?ref=${user.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tier1Members = referrals.filter(r => r.tierLevel === 1);
  const tier2Members = referrals.filter(r => r.tierLevel === 2);
  const tier3Members = referrals.filter(r => r.tierLevel === 3);

  const displayedMembers = 
    selectedTierTab === 1 ? tier1Members :
    selectedTierTab === 2 ? tier2Members : tier3Members;

  const totalTeamDeposits = referrals.reduce((sum, r) => sum + r.activeDeposits, 0);

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-heading">
              Affiliate Program & Referral Network
            </h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
              VIP Sponsor #{user.referralCode}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Invite friends and global investors to earn instant 3-tier commissions credited continuously to your cash balance.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-right">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Total Commissions Earned</div>
          <div className="text-lg font-black text-amber-700 font-mono">
            ${wallet.referralEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Main Referral Invitation Card */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Link Controls (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Your Unique Referral Invitation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Share Fortune Investment & Earn up to 12% Total Network Yield
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Every member who signs up using your sponsor link <span className="text-sky-300 font-mono font-bold">#{user.referralCode}</span> generates instant passive rewards on every deposit they make.
            </p>

            {/* Link Box */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Shareable Registration URL (with ref={user.referralCode})
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-800/90 border border-slate-700 p-2 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="w-full bg-transparent px-3 py-2 text-xs font-mono text-sky-200 focus:outline-none select-all truncate"
                />
                <button
                  id="copy-affiliate-link-btn"
                  onClick={handleCopyLink}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Social Share Shortcuts */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Direct Share:</span>
              
              <a
                href={`https://wa.me/?text=Join%20Fortune%20Investment%20with%20me%20and%20earn%20daily%20yields:%20${encodeURIComponent(referralUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=Join%20Fortune%20Investment%20for%20daily%20passive%20wealth`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=Growing%20my%20portfolio%20with%20Fortune%20Investment.%20Check%20it%20out:%20${encodeURIComponent(referralUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </a>
            </div>

          </div>

          {/* QR Code & Code Box (4 cols) */}
          <div className="lg:col-span-4 bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-lg flex items-center justify-center">
              {/* Simulated QR Code SVG */}
              <div className="w-full h-full border-4 border-slate-900 rounded-lg p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-slate-900 rounded-sm"></div>
                  <div className="w-6 h-6 bg-slate-900 rounded-sm"></div>
                </div>
                <div className="text-[10px] font-black text-slate-900 tracking-tighter">
                  REF {user.referralCode}
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-slate-900 rounded-sm"></div>
                  <div className="w-6 h-6 bg-sky-600 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-300">Direct Sponsor ID:</span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xl font-black font-mono text-sky-400">#{user.referralCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="text-slate-300 hover:text-white p-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3-Tier Commission Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1 */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tier 1 Direct</span>
            <span className="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              8% Instant
            </span>
          </div>
          <div className="text-3xl font-black text-sky-700 mt-2 font-heading">
            8.00%
          </div>
          <p className="text-xs text-slate-500 mt-1">Directly referred investors using your link.</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
            <span>Members: <b className="text-slate-900">{tier1Members.length} Active</b></span>
            <span>Earned: <b className="text-emerald-600">${tier1Members.reduce((a,b)=>a+b.commissionEarned, 0)}</b></span>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tier 2 Secondary</span>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              3% Passive
            </span>
          </div>
          <div className="text-3xl font-black text-blue-700 mt-2 font-heading">
            3.00%
          </div>
          <p className="text-xs text-slate-500 mt-1">Users invited by your Tier 1 direct members.</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
            <span>Members: <b className="text-slate-900">{tier2Members.length} Active</b></span>
            <span>Earned: <b className="text-emerald-600">${tier2Members.reduce((a,b)=>a+b.commissionEarned, 0)}</b></span>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tier 3 Network</span>
            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
              1% Extended
            </span>
          </div>
          <div className="text-3xl font-black text-cyan-700 mt-2 font-heading">
            1.00%
          </div>
          <p className="text-xs text-slate-500 mt-1">Deep network downline referrals.</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
            <span>Members: <b className="text-slate-900">{tier3Members.length} Active</b></span>
            <span>Earned: <b className="text-emerald-600">${tier3Members.reduce((a,b)=>a+b.commissionEarned, 0)}</b></span>
          </div>
        </div>

      </div>

      {/* Downline Members Table */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Your Referral Network Tree</h2>
            <p className="text-xs text-slate-500">Total team volume: ${totalTeamDeposits.toLocaleString()} USDT</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedTierTab(1)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTierTab === 1 ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Tier 1 ({tier1Members.length})
            </button>
            <button
              onClick={() => setSelectedTierTab(2)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTierTab === 2 ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Tier 2 ({tier2Members.length})
            </button>
            <button
              onClick={() => setSelectedTierTab(3)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTierTab === 3 ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Tier 3 ({tier3Members.length})
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="pb-3 font-semibold">User Handle</th>
                <th className="pb-3 font-semibold">Joined Date</th>
                <th className="pb-3 font-semibold">Active Capital</th>
                <th className="pb-3 font-semibold">Commission Payout</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-mono text-xs">
                      @{member.username.charAt(0).toUpperCase()}
                    </span>
                    <span>@{member.username}</span>
                  </td>
                  <td className="py-3 text-slate-500">{member.joinedDate}</td>
                  <td className="py-3 font-mono font-bold text-slate-900">
                    ${member.activeDeposits.toLocaleString()} USDT
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-600">
                    +${member.commissionEarned.toLocaleString()} USDT
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {member.status}
                    </span>
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
