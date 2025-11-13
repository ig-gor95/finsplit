import { useState } from 'react';
import { X, Filter, Download, ArrowUpRight, ArrowDownLeft, FileText, Receipt, Search } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'incoming' | 'outgoing' | 'fee';
  category: string;
  balance: number;
}

interface AccountStatementModalProps {
  account: {
    id: number;
    name: string;
    currency: string;
    balance: number;
    country: string;
    bank?: string;
  };
  onClose: () => void;
  onCreateReport: () => void;
  onCreateDocument: () => void;
  primaryCurrency?: string;
  exchangeRate?: number;
}

export function AccountStatementModal({ 
  account, 
  onClose, 
  onCreateReport, 
  onCreateDocument,
  primaryCurrency,
  exchangeRate = 1
}: AccountStatementModalProps) {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing' | 'fee'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);

  // Mock transactions data
  const allTransactions: Transaction[] = [
    { id: 1, date: '2025-11-03', description: 'Invoice Payment #INV-2845', amount: 150000, type: 'incoming', category: 'Revenue', balance: account.balance },
    { id: 2, date: '2025-11-02', description: 'Office Rent', amount: -45000, type: 'outgoing', category: 'Rent', balance: account.balance - 45000 },
    { id: 3, date: '2025-11-02', description: 'Bank Transfer Fee', amount: -250, type: 'fee', category: 'Fees', balance: account.balance - 45250 },
    { id: 4, date: '2025-11-01', description: 'Client Payment - Project ABC', amount: 280000, type: 'incoming', category: 'Revenue', balance: account.balance - 45250 + 280000 },
    { id: 5, date: '2025-11-01', description: 'Software Subscription', amount: -12000, type: 'outgoing', category: 'IT Services', balance: account.balance - 57250 + 280000 },
    { id: 6, date: '2025-10-31', description: 'Consulting Fee', amount: 95000, type: 'incoming', category: 'Consulting', balance: account.balance - 69250 + 280000 },
    { id: 7, date: '2025-10-30', description: 'Marketing Campaign', amount: -35000, type: 'outgoing', category: 'Marketing', balance: account.balance - 104250 + 280000 },
    { id: 8, date: '2025-10-30', description: 'Currency Exchange Fee', amount: -450, type: 'fee', category: 'Fees', balance: account.balance - 104700 + 280000 },
    { id: 9, date: '2025-10-29', description: 'Service Payment', amount: 125000, type: 'incoming', category: 'Revenue', balance: account.balance - 104700 + 405000 },
    { id: 10, date: '2025-10-28', description: 'Utilities', amount: -8500, type: 'outgoing', category: 'Utilities', balance: account.balance - 113200 + 405000 },
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleTransaction = (id: number) => {
    setSelectedTransactions(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    const absAmount = Math.abs(amount);
    if (currency === 'KZT' || currency === 'RUB') {
      return `${absAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currency}`;
    }
    return `${absAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  const convertToPrimary = (amount: number) => {
    if (!primaryCurrency || account.currency === primaryCurrency) return null;
    const converted = amount * exchangeRate;
    return formatCurrency(converted, primaryCurrency);
  };

  const totalIncoming = filteredTransactions.filter(t => t.type === 'incoming').reduce((sum, t) => sum + t.amount, 0);
  const totalOutgoing = filteredTransactions.filter(t => t.type === 'outgoing' || t.type === 'fee').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netFlow = totalIncoming - totalOutgoing;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1">{language === 'ru' ? 'Выписка по счёту' : 'Account Statement'}</h2>
            <p className="text-sm text-blue-100">
              {account.name} • {account.bank || account.country} • {account.currency}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Входящие' : 'Incoming'}</p>
            <p className="text-xl text-green-600">+{formatCurrency(totalIncoming, account.currency)}</p>
            {primaryCurrency && account.currency !== primaryCurrency && (
              <p className="text-xs text-gray-500 mt-1">≈ {convertToPrimary(totalIncoming)}</p>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Исходящие' : 'Outgoing'}</p>
            <p className="text-xl text-red-600">-{formatCurrency(totalOutgoing, account.currency)}</p>
            {primaryCurrency && account.currency !== primaryCurrency && (
              <p className="text-xs text-gray-500 mt-1">≈ {convertToPrimary(totalOutgoing)}</p>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Чистый поток' : 'Net Flow'}</p>
            <p className={`text-xl ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow, account.currency)}
            </p>
            {primaryCurrency && account.currency !== primaryCurrency && (
              <p className="text-xs text-gray-500 mt-1">≈ {convertToPrimary(netFlow)}</p>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Операций' : 'Transactions'}</p>
            <p className="text-xl text-gray-900">{filteredTransactions.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTransactions.length} {language === 'ru' ? 'выбрано' : 'selected'}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск по описанию...' : 'Search description...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'ru' ? 'Все' : 'All'}
              </button>
              <button
                onClick={() => setFilterType('incoming')}
                className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${
                  filterType === 'incoming'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                {language === 'ru' ? 'Входящие' : 'Incoming'}
              </button>
              <button
                onClick={() => setFilterType('outgoing')}
                className={`px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${
                  filterType === 'outgoing'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                {language === 'ru' ? 'Исходящие' : 'Outgoing'}
              </button>
              <button
                onClick={() => setFilterType('fee')}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  filterType === 'fee'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'ru' ? 'Комиссии' : 'Fees'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (selectedTransactions.length === 0) {
                  toast.error(language === 'ru' ? 'Выберите транзакции' : 'Select transactions');
                  return;
                }
                onClose();
                onCreateReport();
              }}
              disabled={selectedTransactions.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              {language === 'ru' ? 'Создать отчёт' : 'Create Report'}
            </button>
            <button
              onClick={() => {
                if (selectedTransactions.length === 0) {
                  toast.error(language === 'ru' ? 'Выберите транзакции' : 'Select transactions');
                  return;
                }
                onClose();
                onCreateDocument();
              }}
              disabled={selectedTransactions.length === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Receipt className="w-4 h-4" />
              {language === 'ru' ? 'Создать документ' : 'Create Document'}
            </button>
            <button
              onClick={() => {
                toast.success(language === 'ru' ? 'Выписка загружена' : 'Statement downloaded');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 ml-auto"
            >
              <Download className="w-4 h-4" />
              {language === 'ru' ? 'Скачать PDF' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => toggleTransaction(transaction.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedTransactions.includes(transaction.id)
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction.id)}
                    onChange={() => toggleTransaction(transaction.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'incoming' ? 'bg-green-100' :
                    transaction.type === 'outgoing' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    {transaction.type === 'incoming' ? (
                      <ArrowDownLeft className={`w-5 h-5 ${
                        transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : (
                      <ArrowUpRight className={`w-5 h-5 ${
                        transaction.type === 'fee' ? 'text-amber-600' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg ${
                      transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'incoming' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount), account.currency)}
                    </p>
                    {primaryCurrency && account.currency !== primaryCurrency && (
                      <p className="text-xs text-gray-500 mt-1">
                        ≈ {convertToPrimary(Math.abs(transaction.amount))}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {language === 'ru' ? 'Остаток:' : 'Balance:'} {formatCurrency(transaction.balance, account.currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
