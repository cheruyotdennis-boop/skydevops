import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionHistoryViewProps {
  transactions: Transaction[];
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  transactions
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | TransactionType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = selectedFilter === 'ALL' || tx.type === selectedFilter;
    const matchesSearch = 
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.methodOrAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Currency', 'Status', 'Date', 'Transaction Hash', 'Details'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.type,
      t.amount,
      t.currency,
      t.status,
      `"${t.timestamp}"`,
      `"${t.txHash}"`,
      `"${t.note}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fortune_Investment_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Financial Ledger & Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Auditable, immutable ledger of all deposits, daily ROI settlements, and wallet payouts.
          </p>
        </div>

        <button
          id="export-csv-btn"
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-sky-600" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === 'ALL' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Ledger ({transactions.length})
          </button>
          <button
            onClick={() => setSelectedFilter('ROI_PAYOUT')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === 'ROI_PAYOUT' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ROI Yields
          </button>
          <button
            onClick={() => setSelectedFilter('DEPOSIT')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === 'DEPOSIT' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setSelectedFilter('WITHDRAWAL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === 'WITHDRAWAL' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setSelectedFilter('REFERRAL_BONUS')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === 'REFERRAL_BONUS' ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Affiliate Bonuses
          </button>
          <button
            onClick={() => setSelectedFilter('INVESTMENT')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedFilter === 'INVESTMENT' ? 'bg-slate-800 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Plan Locks
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="tx-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hash, note, address..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
          />
        </div>

      </div>

      {/* Ledger Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="pb-3 font-semibold">Transaction Details</th>
                <th className="pb-3 font-semibold">Amount (USDT)</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Method / Network</th>
                <th className="pb-3 font-semibold">Blockchain TxHash</th>
                <th className="pb-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-sky-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 font-medium text-slate-900 flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'DEPOSIT' ? 'bg-sky-100 text-sky-700' :
                        tx.type === 'ROI_PAYOUT' ? 'bg-emerald-100 text-emerald-700' :
                        tx.type === 'REFERRAL_BONUS' ? 'bg-amber-100 text-amber-700' :
                        tx.type === 'WITHDRAWAL' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.type === 'DEPOSIT' && <ArrowDownLeft className="w-4 h-4" />}
                        {tx.type === 'ROI_PAYOUT' && <TrendingUp className="w-4 h-4" />}
                        {tx.type === 'REFERRAL_BONUS' && <Sparkles className="w-4 h-4" />}
                        {tx.type === 'WITHDRAWAL' && <ArrowUpRight className="w-4 h-4" />}
                        {tx.type === 'INVESTMENT' && <Layers className="w-4 h-4" />}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {tx.type.replace('_', ' ')}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.note}</div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className={`font-mono font-extrabold ${
                        tx.type === 'WITHDRAWAL' || tx.type === 'INVESTMENT' ? 'text-slate-900' : 'text-emerald-600'
                      }`}>
                        {tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{tx.currency}</span>
                    </td>

                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        tx.status === 'PROCESSING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-600 text-[11px]">
                      <div className="font-medium text-slate-800 truncate max-w-[180px]">{tx.methodOrAddress}</div>
                      <div className="text-[10px] text-slate-400">Zero Network Fee</div>
                    </td>

                    <td className="py-3.5 font-mono text-[11px] text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                      </span>
                    </td>

                    <td className="py-3.5 text-right text-slate-500 text-[11px] whitespace-nowrap">
                      {tx.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  ✓
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-heading">Transaction Certificate</h3>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {selectedTx.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3.5 text-xs">
              <div className="p-4 bg-sky-50 rounded-2xl text-center">
                <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">Settled Amount</span>
                <div className="text-3xl font-black text-slate-900 font-mono mt-1">
                  ${selectedTx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedTx.currency}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">
                  Status: {selectedTx.status} (12 Block Confirmations)
                </div>
              </div>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Type:</span>
                  <span className="font-bold text-slate-900">{selectedTx.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Timestamp:</span>
                  <span className="font-bold text-slate-900">{selectedTx.timestamp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Method / Source:</span>
                  <span className="font-bold text-slate-900">{selectedTx.methodOrAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Note:</span>
                  <span className="font-medium text-slate-900">{selectedTx.note}</span>
                </div>
                <div>
                  <span className="block mb-1">Blockchain Transaction Hash:</span>
                  <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl font-mono text-[10px] break-all select-all">
                    <span>{selectedTx.txHash}</span>
                    <button
                      onClick={() => handleCopy(selectedTx.txHash)}
                      className="text-sky-600 hover:text-sky-800 shrink-0 font-bold"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
