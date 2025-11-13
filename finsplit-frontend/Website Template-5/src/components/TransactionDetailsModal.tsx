import { useState } from 'react';
import { 
  X, Receipt, CheckCircle2, Clock, FileText, Building2, Zap, Download, Edit, 
  TrendingUp, TrendingDown, Save, Calendar, DollarSign, Target, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { TransactionDocumentsViewer } from './TransactionDocumentsViewer';
import { TransactionDocumentChain } from './TransactionDocumentChain';

interface Transaction {
  id: number;
  date: string;
  description: string;
  account: string;
  amount: number;
  category: string;
  status: string;
  reference: string;
  country: string;
  purpose: string;
  fee?: number;
  exchangeRate?: number;
  aiConfidence: number;
  tags?: string[];
  type: 'incoming' | 'outgoing';
  counterparty?: {
    name: string;
    bank: string;
    account: string;
    country: string;
    taxId: string;
  };
}

interface TransactionDetailsModalProps {
  transaction: Transaction;
  language: 'en' | 'ru';
  accounts: any[];
  formatCurrency: (amount: number, currency: string) => string;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  attachedDocuments?: any[];
}

export function TransactionDetailsModal({
  transaction,
  language,
  accounts,
  formatCurrency,
  onClose,
  onSave,
  attachedDocuments
}: TransactionDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Transaction>(transaction);
  const [isSaving, setIsSaving] = useState(false);

  console.log('TransactionDetailsModal attachedDocuments:', attachedDocuments);

  const handleEdit = () => {
    setEditData(transaction);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(transaction);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(editData);
    toast.success(
      language === 'ru' ? 'Транзакция успешно обновлена' : 'Transaction updated successfully',
      {
        description: `${editData.description} • ${formatCurrency(editData.amount, accounts.find(a => a.name === editData.account)?.currency || 'USD')}`
      }
    );
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Transaction, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const displayTransaction = isEditing ? editData : transaction;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-900 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-blue-600" />
              {isEditing 
                ? (language === 'ru' ? 'Редактирование транзакции' : 'Edit Transaction')
                : (language === 'ru' ? 'Детали транзакции' : 'Transaction Details')
              }
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing
                ? (language === 'ru' ? 'Изменение данных транзакции' : 'Modify transaction data')
                : (language === 'ru' ? 'Полная информация из выписки' : 'Complete information from statement')
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!isEditing ? (
            <>
              {/* View Mode - Status Banner */}
              <div className={`p-4 rounded-xl border-2 ${
                displayTransaction.status === 'Completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3">
                  {displayTransaction.status === 'Completed' ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <Clock className="w-8 h-8 text-yellow-600" />
                  )}
                  <div>
                    <p className={`text-lg ${
                      displayTransaction.status === 'Completed' ? 'text-green-900' : 'text-yellow-900'
                    }`}>
                      {displayTransaction.status === 'Completed'
                        ? (language === 'ru' ? 'Транзакция завершена' : 'Transaction Completed')
                        : (language === 'ru' ? 'Транзакция в обработке' : 'Transaction Pending')
                      }
                    </p>
                    <p className={`text-sm ${
                      displayTransaction.status === 'Completed' ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {displayTransaction.date} • {displayTransaction.reference}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border-2 ${
                  displayTransaction.amount > 0
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Сумма транзакции' : 'Transaction Amount'}
                  </p>
                  <p className={`text-2xl ${
                    displayTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {displayTransaction.amount > 0 ? '+' : ''}{formatCurrency(
                      displayTransaction.amount,
                      accounts.find(a => a.name === displayTransaction.account)?.currency || 'USD'
                    )}
                  </p>
                </div>
                
                <div className="p-4 rounded-xl border-2 bg-orange-50 border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Комиссия' : 'Fee'}
                  </p>
                  <p className="text-2xl text-orange-600">
                    {formatCurrency(
                      displayTransaction.fee || 0,
                      accounts.find(a => a.name === displayTransaction.account)?.currency || 'USD'
                    )}
                  </p>
                </div>
                
                <div className="p-4 rounded-xl border-2 bg-blue-50 border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Курс обмена' : 'Exchange Rate'}
                  </p>
                  <p className="text-2xl text-blue-600">
                    {displayTransaction.exchangeRate?.toFixed(2) || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Main Details */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg text-gray-900 flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {language === 'ru' ? 'Основная информация' : 'Main Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ru' ? 'Описание' : 'Description'}
                    </p>
                    <p className="text-sm text-gray-900">{displayTransaction.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ru' ? 'Счет' : 'Account'}
                    </p>
                    <p className="text-sm text-gray-900">{displayTransaction.account}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ru' ? 'Категория' : 'Category'}
                    </p>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                      displayTransaction.category === 'Income' ? 'bg-green-100 text-green-700' :
                      displayTransaction.category === 'Salaries' ? 'bg-blue-100 text-blue-700' :
                      displayTransaction.category === 'Rent' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {displayTransaction.category}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ru' ? 'Тип операции' : 'Transaction Type'}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${
                      displayTransaction.type === 'incoming'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {displayTransaction.type === 'incoming' ? (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          {language === 'ru' ? 'Поступление' : 'Incoming'}
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4" />
                          {language === 'ru' ? 'Списание' : 'Outgoing'}
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ru' ? 'Референс номер' : 'Reference Number'}
                    </p>
                    <p className="text-sm text-gray-900 font-mono">{displayTransaction.reference}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ru' ? 'Страна' : 'Country'}
                    </p>
                    <p className="text-sm text-gray-900">{displayTransaction.country}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ru' ? 'Назначение платежа' : 'Payment Purpose'}
                  </p>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                    {displayTransaction.purpose}
                  </p>
                </div>
              </div>

              {/* Counterparty Details */}
              {displayTransaction.counterparty && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg text-gray-900 flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    {language === 'ru' ? 'Информация о контрагенте' : 'Counterparty Information'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'ru' ? 'Название' : 'Name'}
                      </p>
                      <p className="text-sm text-gray-900">{displayTransaction.counterparty.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'ru' ? 'Банк' : 'Bank'}
                      </p>
                      <p className="text-sm text-gray-900">{displayTransaction.counterparty.bank}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'ru' ? 'Номер счета' : 'Account Number'}
                      </p>
                      <p className="text-sm text-gray-900 font-mono bg-white p-3 rounded-lg border border-gray-200">
                        {displayTransaction.counterparty.account}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'ru' ? 'Страна' : 'Country'}
                      </p>
                      <p className="text-sm text-gray-900">{displayTransaction.counterparty.country}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {language === 'ru' ? 'ИНН/БИН/Tax ID' : 'Tax ID'}
                      </p>
                      <p className="text-sm text-gray-900 font-mono">{displayTransaction.counterparty.taxId}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Attached Documents */}
              {attachedDocuments && attachedDocuments.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <TransactionDocumentsViewer
                    documents={attachedDocuments}
                    transactionId={transaction.id}
                  />
                </div>
              )}

              {/* Document Chain - FinOrbit */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {language === 'ru' ? 'FinOrbit - Цепочка документов' : 'FinOrbit - Document Chain'}
                </h3>
                <TransactionDocumentChain 
                  transaction={displayTransaction}
                  language={language}
                  compact={false}
                />
              </div>

              {/* AI Analysis */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                  {language === 'ru' ? 'AI Анализ' : 'AI Analysis'}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {language === 'ru' ? 'Уверенность категоризации' : 'Categorization Confidence'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${displayTransaction.aiConfidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{displayTransaction.aiConfidence}%</span>
                    </div>
                  </div>

                  {displayTransaction.tags && displayTransaction.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {displayTransaction.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white border border-purple-200 text-purple-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - View Mode */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    toast.success(language === 'ru' ? 'Экспорт в PDF начат' : 'PDF export started');
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {language === 'ru' ? 'Скачать PDF' : 'Download PDF'}
                </button>
                <button
                  onClick={handleEdit}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  {language === 'ru' ? 'Редактировать' : 'Edit'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="text-lg text-gray-900 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  {language === 'ru' ? 'Основная информация' : 'Main Information'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {language === 'ru' ? 'Дата транзакции' : 'Transaction Date'}
                    </label>
                    <input
                      type="date"
                      value={editData.date.split('.').reverse().join('-')}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        const formatted = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                        handleChange('date', formatted);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-500" />
                      {language === 'ru' ? 'Статус' : 'Status'}
                    </label>
                    <select
                      value={editData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Completed">{language === 'ru' ? '✓ Завершено' : '✓ Completed'}</option>
                      <option value="Pending">{language === 'ru' ? '⏳ В обработке' : '⏳ Pending'}</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    {language === 'ru' ? 'Описание' : 'Description'}
                  </label>
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'ru' ? 'Краткое описание транзакции' : 'Brief transaction description'}
                  />
                </div>
              </div>

              {/* Financial Info Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-2 border-blue-200 space-y-4">
                <h3 className="text-lg text-gray-900 flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  {language === 'ru' ? 'Финансовая информация' : 'Financial Information'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {language === 'ru' ? 'Сумма транзакции' : 'Transaction Amount'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={editData.amount}
                        onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        {editData.account}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      {language === 'ru' ? 'Категория' : 'Category'}
                    </label>
                    <select
                      value={editData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="Income">{language === 'ru' ? '💰 Доходы' : '💰 Income'}</option>
                      <option value="Salaries">{language === 'ru' ? '👥 Зарплаты' : '👥 Salaries'}</option>
                      <option value="Rent">{language === 'ru' ? '🏢 Аренда' : '🏢 Rent'}</option>
                      <option value="IT Services">{language === 'ru' ? '💻 IT Услуги' : '💻 IT Services'}</option>
                      <option value="Marketing">{language === 'ru' ? '📢 Маркетинг' : '📢 Marketing'}</option>
                      <option value="Other">{language === 'ru' ? '📦 Прочее' : '📦 Other'}</option>
                    </select>
                  </div>
                </div>

                {/* Fee & Exchange Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {language === 'ru' ? 'Комиссия' : 'Fee'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editData.fee || 0}
                      onChange={(e) => handleChange('fee', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {language === 'ru' ? 'Курс обмена' : 'Exchange Rate'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editData.exchangeRate || 1}
                      onChange={(e) => handleChange('exchangeRate', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Purpose Section */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {language === 'ru' ? 'Назначение платежа' : 'Payment Purpose'}
                </label>
                <textarea
                  value={editData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder={language === 'ru' ? 'Подробне описание назначения платежа' : 'Detailed description of payment purpose'}
                />
              </div>

              {/* Action Buttons - Edit Mode */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  {language === 'ru' ? 'Отменить' : 'Cancel'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {language === 'ru' ? 'Сохранение...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {language === 'ru' ? 'Сохранить изменения' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}