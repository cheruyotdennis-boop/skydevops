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
    navigator.clipboard.writeText(text);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 font-heading">
                Fortune Investment Kenya Support & Contacts
              </h3>
              <p className="text-xs text-slate-500">Official Nairobi HQ Desk & Personal Contact Directory</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl font-bold my-4 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('official_contacts')}
            className={`w-1/2 py-2 rounded-lg transition-all ${
              activeTab === 'official_contacts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Official Contact Directory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('edit_contacts')}
            className={`w-1/2 py-2 rounded-lg transition-all ${
              activeTab === 'edit_contacts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Edit / Update Contacts
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Contact details and M-PESA parameters updated successfully!</span>
          </div>
        )}

        {activeTab === 'official_contacts' ? (
          <div className="space-y-4 text-xs">
            
            {/* M-PESA Payment Desk Box */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Safaricom M-PESA Official Payment Channels</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Live & Automated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">M-PESA Paybill</div>
                    <div className="text-sm font-mono font-black text-slate-900">{contacts.mpesaPaybill}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(contacts.mpesaPaybill, 'paybill')}
                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                  >
                    {copiedItem === 'paybill' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Buy Goods Till</div>
                    <div className="text-sm font-mono font-black text-slate-900">{contacts.mpesaTillNumber}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(contacts.mpesaTillNumber, 'till')}
                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                  >
                    {copiedItem === 'till' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Official Support Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Headquarters & Communication Lines</span>
              </h4>

              <div className="space-y-2.5 text-slate-700">
                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50">
                  <Phone className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-400 font-bold">Kenya Customer Support Line</div>
                    <a href={`tel:${contacts.supportPhone}`} className="font-mono font-bold text-sky-700 hover:underline">
                      {contacts.supportPhone}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(contacts.supportPhone, 'phone')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {copiedItem === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="flex-1 truncate">
                    <div className="text-[10px] text-slate-400 font-bold">Official Support & Inquiries Email</div>
                    <a href={`mailto:${contacts.supportEmail}`} className="font-mono font-semibold text-sky-700 hover:underline">
                      {contacts.supportEmail}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(contacts.supportEmail, 'email')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {copiedItem === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-400 font-bold">Physical Nairobi Office</div>
                    <div className="font-medium text-slate-800">{contacts.officeLocation}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-400 font-bold">WhatsApp Direct Advisory</div>
                    <div className="font-mono font-bold text-slate-800">{contacts.whatsappSupport}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Personal Contact Snapshot */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900">Your Registered User Contacts:</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('edit_contacts')}
                  className="text-[11px] font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit My Details
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Name:</span> <b className="text-slate-900">{user.fullName}</b>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span> <b className="text-slate-900 truncate">{user.email}</b>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span> <b className="text-slate-900">{user.phone}</b>
                </div>
                <div>
                  <span className="text-slate-500">M-PESA:</span> <b className="text-emerald-800 font-mono">{user.mpesaNumber || user.phone}</b>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSaveAll} className="space-y-4 text-xs">
            
            {/* User Profile Contacts Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-sky-600" />
                <span>Your Personal Contact Information</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">M-PESA Phone Number</label>
                  <input
                    type="text"
                    value={userMpesa}
                    onChange={(e) => setUserMpesa(e.target.value)}
                    placeholder="0712345678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-800 font-bold focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    value={userCountry}
                    onChange={(e) => setUserCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Platform Official Contacts Section */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Fortune Investment Platform Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">M-PESA Paybill Business No</label>
                  <input
                    type="text"
                    value={formData.mpesaPaybill}
                    onChange={(e) => setFormData(prev => ({ ...prev, mpesaPaybill: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">M-PESA Till Number</label>
                  <input
                    type="text"
                    value={formData.mpesaTillNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, mpesaTillNumber: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kenya Support Phone</label>
                  <input
                    type="text"
                    value={formData.supportPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, supportPhone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Nairobi Office Location</label>
                  <input
                    type="text"
                    value={formData.officeLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, officeLocation: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">USD/KES Exchange Rate (1 USD = KES)</label>
                  <input
                    type="number"
                    value={formData.kesUsdExchangeRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, kesUsdExchangeRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              id="save-all-contacts-btn"
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Contact Directory</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
