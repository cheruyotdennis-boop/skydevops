import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  Edit3, 
  Check, 
  Save, 
  Copy, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { PlatformContacts, UserProfile } from '../types';
import { safeCopyText } from '../utils/storage';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: PlatformContacts;
  user: UserProfile;
  onUpdateContacts: (updated: PlatformContacts) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
  contacts,
  user,
  onUpdateContacts,
  onUpdateUser
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'official_contacts' | 'edit_contacts'>('official_contacts');
  
  // Edit Form State
  const [formData, setFormData] = useState<PlatformContacts>({ ...contacts });
  const [userPhone, setUserPhone] = useState(user.phone || '+254 712 345 678');
  const [userMpesa, setUserMpesa] = useState(user.mpesaNumber || '0712345678');
  const [userEmail, setUserEmail] = useState(user.email || 'cheruyot.dennis@student.moringaschool.com');
  const [userCountry, setUserCountry] = useState(user.country || 'Kenya');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    safeCopyText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContacts(formData);
    onUpdateUser({
      phone: userPhone,
      mpesaNumber: userMpesa,
      email: userEmail,
      country: userCountry
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
              <h3 className="font-black text-lg text-white font-heading">Support & Liaison Contacts</h3>
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

        {/* Tab switcher */}
        <div className="flex bg-[#07090E] p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('official_contacts')}
            className={`w-1/2 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'official_contacts' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Official Quantiq Contacts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('edit_contacts')}
            className={`w-1/2 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'edit_contacts' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Edit Platform Numbers
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Updated contact details saved!</span>
          </div>
        )}

        {/* Tab 1: Official Contacts Display */}
        {activeTab === 'official_contacts' ? (
          <div className="mt-5 space-y-4 text-xs">
            
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
                  <button onClick={() => handleCopy(contacts.mpesaPaybill, 'paybill')} className="text-slate-400 hover:text-white cursor-pointer">
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
                  <span className="font-mono font-bold text-emerald-400">{contacts.mpesaTillNumber}</span>
                  <button onClick={() => handleCopy(contacts.mpesaTillNumber, 'till')} className="text-slate-400 hover:text-white cursor-pointer">
                    {copiedItem === 'till' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Nairobi Support Line:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{contacts.supportPhone}</span>
                  <button onClick={() => handleCopy(contacts.supportPhone, 'phone')} className="text-slate-400 hover:text-white cursor-pointer">
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
                  <button onClick={() => handleCopy(contacts.supportEmail, 'email')} className="text-slate-400 hover:text-white cursor-pointer">
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
        ) : (
          /* Tab 2: Edit Form */
          <form onSubmit={handleSaveAll} className="mt-5 space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">M-PESA Paybill Business No</label>
                <input
                  type="text"
                  value={formData.mpesaPaybill}
                  onChange={(e) => setFormData({ ...formData, mpesaPaybill: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">M-PESA Till Number</label>
                <input
                  type="text"
                  value={formData.mpesaTillNumber}
                  onChange={(e) => setFormData({ ...formData, mpesaTillNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Support Phone Hotline</label>
                <input
                  type="text"
                  value={formData.supportPhone}
                  onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">WhatsApp Direct Support</label>
                <input
                  type="text"
                  value={formData.whatsappSupport}
                  onChange={(e) => setFormData({ ...formData, whatsappSupport: e.target.value })}
                  className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">HQ Physical Office Address</label>
              <input
                type="text"
                value={formData.officeLocation}
                onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                className="w-full px-3 py-2 bg-[#07090E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Platform Crypto Deposit Receiving Wallets (Owner Personal Address) */}
            <div className="p-3.5 bg-[#07090E] border border-amber-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">Receiving Crypto Deposit Wallets (Owner Vault)</span>
                <span className="text-[10px] text-slate-400">Client deposits route here</span>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">USDT (TRC-20) Receiving Wallet</label>
                <input
                  type="text"
                  value={formData.cryptoDepositWallets?.usdtTrc20 || ''}
                  placeholder="e.g. TY7Q6B92PqmK89vXZ01mNa4kVyTe6pQc99"
                  onChange={(e) => setFormData({
                    ...formData,
                    cryptoDepositWallets: {
                      ...(formData.cryptoDepositWallets || { usdtTrc20: '', usdtErc20: '', btc: '', eth: '' }),
                      usdtTrc20: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-xl text-amber-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">USDT (ERC-20) Receiving Wallet</label>
                <input
                  type="text"
                  value={formData.cryptoDepositWallets?.usdtErc20 || ''}
                  placeholder="e.g. 0x89aF49321B008A2d319808389201a4e788bc5541"
                  onChange={(e) => setFormData({
                    ...formData,
                    cryptoDepositWallets: {
                      ...(formData.cryptoDepositWallets || { usdtTrc20: '', usdtErc20: '', btc: '', eth: '' }),
                      usdtErc20: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-xl text-amber-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Bitcoin (BTC) Receiving Wallet</label>
                  <input
                    type="text"
                    value={formData.cryptoDepositWallets?.btc || ''}
                    placeholder="e.g. bc1q9p8200..."
                    onChange={(e) => setFormData({
                      ...formData,
                      cryptoDepositWallets: {
                        ...(formData.cryptoDepositWallets || { usdtTrc20: '', usdtErc20: '', btc: '', eth: '' }),
                        btc: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-xl text-amber-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">USD / KES Exchange Rate</label>
                  <input
                    type="number"
                    value={formData.kesUsdExchangeRate || 130}
                    onChange={(e) => setFormData({
                      ...formData,
                      kesUsdExchangeRate: Number(e.target.value) || 130
                    })}
                    className="w-full px-3 py-2 bg-[#0E131F] border border-slate-700 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Official Contact Details</span>
            </button>
          </form>
        )}

        </div>

      </div>
    </div>
  );
};
