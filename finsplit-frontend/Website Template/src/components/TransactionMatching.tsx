import { useState } from 'react';
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Link2,
  Unlink,
  Eye,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Clock,
  Globe,
  ArrowRight,
  Check,
  X,
  Zap,
  Calendar,
  DollarSign,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { Fragment } from 'react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  currency: string;
  account: string;
  accountId: number;
  country: string;
  bank: string;
  type: 'incoming' | 'outgoing';
  counterparty?: string;
  reference?: string;
  status: string;
  matchScore?: number;
  matchedWith?: number;
  isMatched?: boolean;
}

interface TransactionMatchingProps {
  accounts: any[];
}

export const TransactionMatching = ({ accounts }: TransactionMatchingProps) => {
  const [selectedAccount, setSelectedAccount] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'unmatched' | 'matched' | 'suggested'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [showMatchDetails, setShowMatchDetails] = useState<number | null>(null);
  const [autoMatchInProgress, setAutoMatchInProgress] = useState(false);

  // Mock transaction data with cross-border transfers
  const [mockTransactions, setMockTransactions] = useState<Transaction[]>([
    {
      id: 1,
      date: '2025-11-08',
      description: 'International Transfer to Sberbank',
      amount: -15000,
      currency: 'USD',
      account: 'USD Account',
      accountId: 3,
      country: 'KZ',
      bank: 'Kaspi Bank',
      type: 'outgoing',
      counterparty: 'Ivanov Ivan',
      reference: 'TRF-2025-11-08-001',
      status: 'Completed',
      matchScore: 95,
      isMatched: true,
      matchedWith: 2,
    },
    {
      id: 2,
      date: '2025-11-08',
      description: 'International Transfer from USD',
      amount: 1275000,
      currency: 'RUB',
      account: 'Business RU (Sber)',
      accountId: 2,
      country: 'RU',
      bank: 'Sberbank',
      type: 'incoming',
      counterparty: 'Foreign Transfer',
      reference: 'TRF-2025-11-08-002',
      status: 'Completed',
      matchScore: 95,
      isMatched: true,
      matchedWith: 1,
    },
    {
      id: 3,
      date: '2025-11-07',
      description: 'Transfer to TBC Bank',
      amount: -5000,
      currency: 'EUR',
      account: 'EUR Account',
      accountId: 4,
      country: 'GE',
      bank: 'TBC Bank',
      type: 'outgoing',
      counterparty: 'Business Account',
      reference: 'SEPA-2025-11-07-003',
      status: 'Completed',
      matchScore: 88,
    },
    {
      id: 4,
      date: '2025-11-07',
      description: 'SEPA Transfer Receipt',
      amount: 2400000,
      currency: 'KZT',
      account: 'Business KZ (Halyk)',
      accountId: 1,
      country: 'KZ',
      bank: 'Halyk Bank',
      type: 'incoming',
      counterparty: 'EUR Transfer',
      reference: 'SEPA-2025-11-07-004',
      status: 'Completed',
      matchScore: 88,
    },
    {
      id: 5,
      date: '2025-11-06',
      description: 'Payment to Supplier',
      amount: -8500,
      currency: 'USD',
      account: 'USD Account',
      accountId: 3,
      country: 'KZ',
      bank: 'Kaspi Bank',
      type: 'outgoing',
      counterparty: 'Tech Solutions Ltd',
      reference: 'PAY-2025-11-06-005',
      status: 'Completed',
    },
    {
      id: 6,
      date: '2025-11-05',
      description: 'Client Payment Received',
      amount: 725000,
      currency: 'RUB',
      account: 'Business RU (Sber)',
      accountId: 2,
      country: 'RU',
      bank: 'Sberbank',
      type: 'incoming',
      counterparty: 'Client Corp',
      reference: 'INV-2025-11-05-006',
      status: 'Completed',
    },
    {
      id: 7,
      date: '2025-11-04',
      description: 'Cross-border Transfer',
      amount: -3200,
      currency: 'EUR',
      account: 'EUR Account',
      accountId: 4,
      country: 'GE',
      bank: 'TBC Bank',
      type: 'outgoing',
      counterparty: 'Partner LLC',
      reference: 'SWIFT-2025-11-04-007',
      status: 'Completed',
      matchScore: 92,
    },
    {
      id: 8,
      date: '2025-11-04',
      description: 'International Payment',
      amount: 1568000,
      currency: 'KZT',
      account: 'Business KZ (Halyk)',
      accountId: 1,
      country: 'KZ',
      bank: 'Halyk Bank',
      type: 'incoming',
      counterparty: 'International Transfer',
      reference: 'SWIFT-2025-11-04-008',
      status: 'Completed',
      matchScore: 92,
    },
  ]);

  // AI-suggested matches
  const suggestedMatches = [
    { outgoing: 3, incoming: 4, confidence: 88, reason: 'Timing and converted amount align within 2% margin' },
    { outgoing: 7, incoming: 8, confidence: 92, reason: 'SWIFT reference correlation, amount match after conversion' },
  ];

  const handleAutoMatch = () => {
    setAutoMatchInProgress(true);
    setTimeout(() => {
      const updatedTransactions = mockTransactions.map(tx => {
        const match = suggestedMatches.find(m => m.outgoing === tx.id || m.incoming === tx.id);
        if (match) {
          return {
            ...tx,
            isMatched: true,
            matchedWith: match.outgoing === tx.id ? match.incoming : match.outgoing,
          };
        }
        return tx;
      });
      setMockTransactions(updatedTransactions);
      setAutoMatchInProgress(false);
      toast.success(`Successfully matched ${suggestedMatches.length} transaction pairs using AI`);
    }, 2000);
  };

  const handleManualMatch = () => {
    if (selectedTransactions.length !== 2) {
      toast.error('Please select exactly 2 transactions to match');
      return;
    }

    const [tx1, tx2] = selectedTransactions;
    const updatedTransactions = mockTransactions.map(tx => {
      if (tx.id === tx1) {
        return { ...tx, isMatched: true, matchedWith: tx2 };
      }
      if (tx.id === tx2) {
        return { ...tx, isMatched: true, matchedWith: tx1 };
      }
      return tx;
    });

    setMockTransactions(updatedTransactions);
    setSelectedTransactions([]);
    toast.success('Transactions matched successfully');
  };

  const handleUnmatch = (txId: number) => {
    const tx = mockTransactions.find(t => t.id === txId);
    if (!tx || !tx.matchedWith) return;

    const updatedTransactions = mockTransactions.map(t => {
      if (t.id === txId || t.id === tx.matchedWith) {
        const { matchedWith, isMatched, ...rest } = t;
        return rest;
      }
      return t;
    });

    setMockTransactions(updatedTransactions as Transaction[]);
    toast.success('Transaction unmatched');
  };

  const toggleTransactionSelection = (txId: number) => {
    setSelectedTransactions(prev =>
      prev.includes(txId) ? prev.filter(id => id !== txId) : [...prev, txId]
    );
  };

  const filteredTransactions = mockTransactions.filter(tx => {
    const accountMatch = selectedAccount === 'all' || tx.accountId === selectedAccount;
    const typeMatch =
      filterType === 'all' ||
      (filterType === 'unmatched' && !tx.isMatched) ||
      (filterType === 'matched' && tx.isMatched) ||
      (filterType === 'suggested' && suggestedMatches.some(m => m.outgoing === tx.id || m.incoming === tx.id));
    const searchMatch =
      searchQuery === '' ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.counterparty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference?.toLowerCase().includes(searchQuery.toLowerCase());

    return accountMatch && typeMatch && searchMatch;
  });

  const stats = {
    total: mockTransactions.length,
    matched: mockTransactions.filter(tx => tx.isMatched).length / 2,
    unmatched: mockTransactions.filter(tx => !tx.isMatched).length,
    suggested: suggestedMatches.filter(m => {
      const outTx = mockTransactions.find(tx => tx.id === m.outgoing);
      const inTx = mockTransactions.find(tx => tx.id === m.incoming);
      return !outTx?.isMatched && !inTx?.isMatched;
    }).length,
  };

  const getMatchedTransaction = (txId: number) => {
    return mockTransactions.find(tx => tx.id === txId);
  };

  const getSuggestedMatch = (txId: number) => {
    return suggestedMatches.find(m => m.outgoing === txId || m.incoming === txId);
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    const rates: Record<string, number> = { KZT: 1, RUB: 5.2, USD: 450, EUR: 490 };
    const inKZT = Math.abs(amount) * rates[fromCurrency];
    return inKZT / rates[toCurrency];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl">
              <ArrowRightLeft className="w-6 h-6 text-purple-600" />
            </div>
            Transaction Matching
          </h2>
          <p className="text-gray-600 mt-2">
            Automatically match transfers between your accounts in different countries
          </p>
        </div>
        
        <button
          onClick={handleAutoMatch}
          disabled={autoMatchInProgress || stats.suggested === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {autoMatchInProgress ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Matching...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              AI Auto-Match ({stats.suggested})
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transfers</p>
              <p className="mt-1">{stats.total}</p>
            </div>
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Matched Pairs</p>
              <p className="mt-1 text-green-600">{stats.matched}</p>
            </div>
            <div className="p-2.5 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unmatched</p>
              <p className="mt-1 text-orange-600">{stats.unmatched}</p>
            </div>
            <div className="p-2.5 bg-orange-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Suggestions</p>
              <p className="mt-1 text-purple-600">{stats.suggested}</p>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Account Filter */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Status</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Transactions</option>
              <option value="unmatched">Unmatched Only</option>
              <option value="matched">Matched Only</option>
              <option value="suggested">AI Suggested</option>
            </select>
          </div>
        </div>

        {/* Manual Match Button */}
        {selectedTransactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedTransactions.length} transaction{selectedTransactions.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTransactions([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleManualMatch}
                  disabled={selectedTransactions.length !== 2}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  Match Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((tx) => {
                const matchedTx = tx.matchedWith ? getMatchedTransaction(tx.matchedWith) : null;
                const suggestedMatch = !tx.isMatched ? getSuggestedMatch(tx.id) : null;
                const isSelected = selectedTransactions.includes(tx.id);

                return (
                  <Fragment key={tx.id}>
                    <tr
                      className={`hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-purple-50' : ''
                      } ${tx.isMatched ? 'bg-green-50/30' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTransactionSelection(tx.id)}
                          disabled={tx.isMatched}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{tx.date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{tx.description}</p>
                          {tx.counterparty && (
                            <p className="text-xs text-gray-500 mt-0.5">{tx.counterparty}</p>
                          )}
                          {tx.reference && (
                            <p className="text-xs text-gray-400 mt-0.5">{tx.reference}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{tx.account}</p>
                          <p className="text-xs text-gray-500">{tx.bank}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Globe className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{tx.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className={`w-4 h-4 ${tx.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`} />
                          <span className={`${tx.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.type === 'incoming' ? '+' : ''}
                            {tx.amount.toLocaleString()} {tx.currency}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {tx.isMatched && matchedTx && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              Matched
                            </span>
                          )}
                          {!tx.isMatched && suggestedMatch && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              <Sparkles className="w-3 h-3" />
                              {suggestedMatch.confidence}% match
                            </span>
                          )}
                          {!tx.isMatched && !suggestedMatch && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                              <AlertCircle className="w-3 h-3" />
                              Unmatched
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {tx.isMatched && matchedTx ? (
                            <>
                              <button
                                onClick={() => setShowMatchDetails(showMatchDetails === tx.id ? null : tx.id)}
                                className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                                title="View match details"
                              >
                                <Eye className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleUnmatch(tx.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                title="Unmatch"
                              >
                                <Unlink className="w-4 h-4 text-red-600" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {/* Match Details Expanded Row */}
                    {showMatchDetails === tx.id && tx.isMatched && matchedTx && (
                      <tr key={`${tx.id}-details`}>
                        <td colSpan={7} className="px-4 py-6 bg-gradient-to-br from-green-50 to-emerald-50 border-t-2 border-green-200">
                          <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="flex items-center gap-2 text-green-900">
                                <Link2 className="w-5 h-5" />
                                Matched Transaction Pair
                              </h4>
                              <button
                                onClick={() => setShowMatchDetails(null)}
                                className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5 text-green-700" />
                              </button>
                            </div>

                            {(() => {
                              const outgoingTx = tx.type === 'outgoing' ? tx : matchedTx;
                              const incomingTx = tx.type === 'incoming' ? tx : matchedTx;

                              const convertedAmount = convertAmount(
                                Math.abs(outgoingTx.amount),
                                outgoingTx.currency,
                                incomingTx.currency
                              );
                              const variance = ((Math.abs(incomingTx.amount) - convertedAmount) / convertedAmount * 100).toFixed(2);

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Outgoing Transaction */}
                                  <div className="bg-white rounded-lg p-5 border border-red-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="p-2 bg-red-50 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-red-600 rotate-45" />
                                      </div>
                                      <span className="text-gray-900">Outgoing Transfer</span>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-gray-500">Account</p>
                                        <p className="text-sm text-gray-900">{outgoingTx.account}</p>
                                        <p className="text-xs text-gray-500">{outgoingTx.bank} • {outgoingTx.country}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Amount</p>
                                        <p className="text-red-600">
                                          {outgoingTx.amount.toLocaleString()} {outgoingTx.currency}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Date</p>
                                        <p className="text-sm text-gray-900">{outgoingTx.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Reference</p>
                                        <p className="text-sm text-gray-900">{outgoingTx.reference}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Incoming Transaction */}
                                  <div className="bg-white rounded-lg p-5 border border-green-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="p-2 bg-green-50 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-green-600 -rotate-45" />
                                      </div>
                                      <span className="text-gray-900">Incoming Transfer</span>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-gray-500">Account</p>
                                        <p className="text-sm text-gray-900">{incomingTx.account}</p>
                                        <p className="text-xs text-gray-500">{incomingTx.bank} • {incomingTx.country}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Amount</p>
                                        <p className="text-green-600">
                                          +{incomingTx.amount.toLocaleString()} {incomingTx.currency}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Date</p>
                                        <p className="text-sm text-gray-900">{incomingTx.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Reference</p>
                                        <p className="text-sm text-gray-900">{incomingTx.reference}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Match Info */}
                                  <div className="md:col-span-2 bg-white rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Match Confidence: {tx.matchScore || 95}%</span>
                                      </div>
                                      <span className="text-gray-600">
                                        Exchange Variance: {variance}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No transactions found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions Panel */}
      {stats.suggested > 0 && filterType !== 'matched' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-purple-900">AI-Powered Match Suggestions</h3>
              <p className="text-sm text-purple-700 mt-1">
                Our AI found {stats.suggested} potential transaction {stats.suggested === 1 ? 'pair' : 'pairs'} based on amount, timing, and reference analysis
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {suggestedMatches
              .filter(match => {
                const outTx = mockTransactions.find(tx => tx.id === match.outgoing);
                const inTx = mockTransactions.find(tx => tx.id === match.incoming);
                return !outTx?.isMatched && !inTx?.isMatched;
              })
              .map((match, idx) => {
                const outTx = mockTransactions.find(tx => tx.id === match.outgoing);
                const inTx = mockTransactions.find(tx => tx.id === match.incoming);

                if (!outTx || !inTx) return null;

                return (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-900">
                          Match Confidence: {match.confidence}%
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTransactions([outTx.id, inTx.id]);
                          handleManualMatch();
                        }}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Accept Match
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Outgoing</p>
                        <p className="text-gray-900">{outTx.account}</p>
                        <p className="text-red-600 text-sm mt-1">
                          {outTx.amount.toLocaleString()} {outTx.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Incoming</p>
                        <p className="text-gray-900">{inTx.account}</p>
                        <p className="text-green-600 text-sm mt-1">
                          +{inTx.amount.toLocaleString()} {inTx.currency}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {match.reason}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};