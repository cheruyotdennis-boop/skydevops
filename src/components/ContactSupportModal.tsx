import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  Check, 
  Copy, 
  Building2, 
  Clock, 
  Smartphone
} from 'lucide-react';
import { PlatformContacts, UserProfile } from '../types';
import { safeCopyText } from '../utils/storage';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: PlatformContacts;
  user?: UserProfile;
  onUpdateContacts?: (updated: PlatformContacts) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
  contacts
}) => {
  if (!isOpen) return null;

  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    safeCopyText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B0F17] border border-amber-500/30 rounded-3xl max-w-xl w-full text-white shadow-2xl my-auto max-h-[92vh] flex flex-col backdrop-blur-2xl overflow-hidden">
        
        {/* Header */}
        <div className="shrink-0 p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 bg-[#0E131F]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white font-heading">Official Support & Liaison Contacts</h3>
              <p className="text-xs text-slate-400">Nairobi Regional Executive Headquarters & Safaricom Rails</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain text-xs">

          {/* Quick Action Channels */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/${(contacts.whatsappSupport || '').replace(/[^0-9]/g, '')}?text=Hello%20Quantiq%20Prime%20Support`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">WhatsApp VIP</div>
                <div className="text-[10px] text-emerald-400 font-mono">{contacts.whatsappSupport}</div>
              </div>
            </a>

            <a
              href={`https://t.me/${(contacts.telegramSupport || '').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-[#0E131F] hover:bg-slate-800 border border-amber-500/30 text-amber-300 flex items-center gap-2.5 transition-colors"
            >
              <Send className="w-5 h-5" />
              <div>
                <div className="font-bold text-white">Telegram Desk</div>
                <div className="text-[10px] text-amber-400 font-mono">{contacts.telegramSupport}</div>
              </div>
            </a>
          </div>

          {/* Detailed list */}
          <div className="space-y-2.5 bg-[#07090E] p-4 rounded-2xl border border-slate-800">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>M-PESA Official Paybill:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400">{contacts.mpesaPaybill}</span>
                <button onClick={() => handleCopy(contacts.mpesaPaybill, 'paybill')} className="text-slate-400 hover:text-white cursor-pointer" title="Copy Paybill">
                  {copiedItem === 'paybill' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>M-PESA Buy Goods Till:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-400">{contacts.mpesaTillNumber || '1234'}</span>
                <span className="text-[10px] text-slate-500 font-mono italic">(Placeholder 1234)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Nairobi Support Line:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white">{contacts.supportPhone}</span>
                <button onClick={() => handleCopy(contacts.supportPhone, 'phone')} className="text-slate-400 hover:text-white cursor-pointer" title="Copy Hotline">
                  {copiedItem === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Official Support Email:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white text-[11px]">{contacts.supportEmail}</span>
                <button onClick={() => handleCopy(contacts.supportEmail, 'email')} className="text-slate-400 hover:text-white cursor-pointer" title="Copy Email">
                  {copiedItem === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between pt-1 text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Physical Address:</span>
              </div>
              <span className="font-semibold text-right text-slate-400 max-w-[200px]">
                {contacts.officeLocation}
              </span>
            </div>

          </div>

          {/* Official Crypto Deposit Receiving Vaults */}
          <div className="space-y-2 bg-[#07090E] p-4 rounded-2xl border border-amber-500/20">
            <div className="font-bold text-amber-400 text-xs flex items-center justify-between">
              <span>Crypto Deposit Receiving Vaults</span>
              <span className="text-[10px] text-slate-400 font-mono">1 USD = {contacts.kesUsdExchangeRate || 130} KES</span>
            </div>

            <div className="space-y-2 pt-1 text-[11px]">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">USDT (TRC-20):</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-amber-300 text-[10px] truncate max-w-[170px]">
                    {contacts.cryptoDepositWallets?.usdtTrc20 || 'TY7Q6B92PqmK89vXZ01mNa4kVyTe6pQc99'}
                  </span>
                  <button 
                    onClick={() => handleCopy(contacts.cryptoDepositWallets?.usdtTrc20 || 'TY7Q6B92PqmK89vXZ01mNa4kVyTe6pQc99', 'usdt_trc20')} 
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy USDT TRC-20 Address"
                  >
                    {copiedItem === 'usdt_trc20' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">USDT (ERC-20):</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-amber-300 text-[10px] truncate max-w-[170px]">
                    {contacts.cryptoDepositWallets?.usdtErc20 || '0x89aF49321B008A2d319808389201a4e788bc5541'}
                  </span>
                  <button 
                    onClick={() => handleCopy(contacts.cryptoDepositWallets?.usdtErc20 || '0x89aF49321B008A2d319808389201a4e788bc5541', 'usdt_erc20')} 
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy USDT ERC-20 Address"
                  >
                    {copiedItem === 'usdt_erc20' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bitcoin (BTC):</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-amber-300 text-[10px] truncate max-w-[170px]">
                    {contacts.cryptoDepositWallets?.btc || 'bc1q9p8200193892019384910293481290a1841e7'}
                  </span>
                  <button 
                    onClick={() => handleCopy(contacts.cryptoDepositWallets?.btc || 'bc1q9p8200193892019384910293481290a1841e7', 'btc')} 
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy BTC Address"
                  >
                    {copiedItem === 'btc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#07090E] rounded-2xl border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Desk Hours: <b>24/7 Priority Support</b> (Automated trading 24/7/365)</span>
          </div>

        </div>

      </div>
    </div>
  );
};
