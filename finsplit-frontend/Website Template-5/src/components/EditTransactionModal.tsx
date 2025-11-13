import React, { useState } from 'react';
import { X, Save, DollarSign, Calendar, FileText, Building2, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Transaction {
  id: number;
  date: string;
  description: string;
  counterparty: string;
  account: string;
  amount: number;
  category: string;
  status: string;
  reference: string;
  country: string;
  purpose: string;
  bankDetails?: string;
  fee?: number;
  exchangeRate?: number;
  tags?: string[];
  type: string;
}

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

export default function EditTransactionModal({ transaction, onClose, onSave }: EditTransactionModalProps) {
  const [formData, setFormData] = useState<Transaction>(transaction);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Transaction, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSave(formData);
    toast.success('Транзакция успешно обновлена', {
      description: `${formData.description} • ${formData.amount} ${formData.account}`
    });
    
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Редактировать транзакцию
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              ID: {transaction.reference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h3 className="text-lg text-gray-900 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Основная информация
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Дата транзакции
                </label>
                <input
                  type="date"
                  value={formData.date.split('.').reverse().join('-')}
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
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Completed">✓ Завершено</option>
                  <option value="Pending">⏳ В обработке</option>
                </select>
              </div>
            </div>

            {/* Counterparty */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                Контрагент
              </label>
              <input
                type="text"
                value={formData.counterparty}
                onChange={(e) => handleChange('counterparty', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Название компании или ФИО"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Описание
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Краткое описание транзакции"
              />
            </div>
          </div>

          {/* Financial Info Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-2 border-blue-200 space-y-4">
            <h3 className="text-lg text-gray-900 flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Финансовая информация
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Сумма транзакции
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    {formData.account}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  Категория
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Income">💰 Доходы</option>
                  <option value="Salaries">👥 Зарплаты</option>
                  <option value="Rent">🏢 Аренда</option>
                  <option value="IT Services">💻 IT Услуги</option>
                  <option value="Marketing">📢 Маркетинг</option>
                  <option value="Other">📦 Прочее</option>
                </select>
              </div>
            </div>

            {/* Fee & Exchange Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Комиссия
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fee || 0}
                  onChange={(e) => handleChange('fee', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Курс обмена
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.exchangeRate || 1}
                  onChange={(e) => handleChange('exchangeRate', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Purpose Section */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Назначение платежа
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Подробное описание назначения платежа"
            />
          </div>

          {/* Bank Details */}
          {formData.bankDetails && (
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Банковские реквизиты
              </label>
              <textarea
                value={formData.bankDetails}
                onChange={(e) => handleChange('bankDetails', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Отменить
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
