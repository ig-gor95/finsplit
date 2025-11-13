import { useState } from 'react';
import { X, Building2, Upload, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { toast } from 'sonner';

interface AddAccountModalProps {
  onClose: () => void;
  onAccountAdded: (account: any) => void;
}

const SUPPORTED_BANKS = [
  { id: 'wise', name: 'Wise', logo: '💳', countries: ['Global'], apiSupport: true },
  { id: 'revolut', name: 'Revolut', logo: '🏦', countries: ['EU', 'UK'], apiSupport: true },
  { id: 'kaspi', name: 'Kaspi Bank', logo: '🇰🇿', countries: ['KZ'], apiSupport: true },
  { id: 'halyk', name: 'Halyk Bank', logo: '🏛️', countries: ['KZ'], apiSupport: false },
  { id: 'raiffeisen', name: 'Raiffeisen', logo: '🏦', countries: ['KZ', 'RU'], apiSupport: true },
  { id: 'sber', name: 'Sberbank', logo: '🇷🇺', countries: ['RU'], apiSupport: false },
  { id: 'tbc', name: 'TBC Bank', logo: '🇬🇪', countries: ['GE'], apiSupport: true },
  { id: 'bog', name: 'Bank of Georgia', logo: '🏦', countries: ['GE'], apiSupport: false },
];

const FILE_FORMATS = [
  { ext: 'CSV', description: 'Comma-separated values', icon: '📄' },
  { ext: 'XLSX', description: 'Excel spreadsheet', icon: '📊' },
  { ext: 'MT940', description: 'SWIFT format', icon: '📋' },
  { ext: '1C', description: '1C accounting format', icon: '💼' },
  { ext: 'PDF', description: 'Bank statement PDF', icon: '📑' },
];

export function AddAccountModal({ onClose, onAccountAdded }: AddAccountModalProps) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'api' | 'manual'>('api');
  const [selectedBank, setSelectedBank] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [accountName, setAccountName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [initialBalance, setInitialBalance] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleApiConnect = () => {
    if (!selectedBank || !apiToken || !accountName) {
      toast.error(language === 'ru' ? 'Заполните все поля' : 'Fill in all fields');
      return;
    }

    setUploading(true);
    
    // Simulate API connection
    setTimeout(() => {
      const newAccount = {
        id: Date.now(),
        name: accountName,
        balance: parseFloat(initialBalance) || 0,
        currency: currency,
        country: SUPPORTED_BANKS.find(b => b.id === selectedBank)?.countries[0] || 'KZ',
        type: 'Business',
        bank: SUPPORTED_BANKS.find(b => b.id === selectedBank)?.name,
        category: 'Revenue',
        lastUpdated: 'Just now',
        isPrimary: false,
      };

      onAccountAdded(newAccount);
      setUploadSuccess(true);
      setUploading(false);
      
      toast.success(language === 'ru' ? '✅ Аккаунт успешно добавлен' : '✅ Account added successfully');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Simulate file processing
    setTimeout(() => {
      const newAccount = {
        id: Date.now(),
        name: accountName || file.name.split('.')[0],
        balance: parseFloat(initialBalance) || Math.random() * 1000000,
        currency: currency,
        country: 'KZ',
        type: 'Business',
        bank: 'Imported',
        category: 'Revenue',
        lastUpdated: 'Just now',
        isPrimary: false,
      };

      onAccountAdded(newAccount);
      setUploadSuccess(true);
      setUploading(false);
      
      toast.success(language === 'ru' ? '✅ Выписка успешно импортирована' : '✅ Statement imported successfully');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">
              {language === 'ru' ? 'Добавить счёт' : 'Add Account'}
            </h2>
            <p className="text-sm text-gray-600">
              {language === 'ru' 
                ? 'Подключите банк через API или загрузите выписку'
                : 'Connect bank via API or upload statement'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {uploadSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-2">
                {language === 'ru' ? 'Успешно!' : 'Success!'}
              </h3>
              <p className="text-gray-600">
                {language === 'ru' 
                  ? 'Аккаунт добавлен в систему'
                  : 'Account added to the system'}
              </p>
            </div>
          ) : (
            <>
              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setMode('api')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    mode === 'api'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Link2 className={`w-8 h-8 mb-3 ${mode === 'api' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="text-gray-900 mb-1">
                    {language === 'ru' ? 'Подключить через API' : 'Connect via API'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Open Banking / API токен' : 'Open Banking / API token'}
                  </p>
                </button>

                <button
                  onClick={() => setMode('manual')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    mode === 'manual'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Upload className={`w-8 h-8 mb-3 ${mode === 'manual' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="text-gray-900 mb-1">
                    {language === 'ru' ? 'Загрузить выписку' : 'Upload Statement'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'CSV, Excel, PDF и др.' : 'CSV, Excel, PDF, etc.'}
                  </p>
                </button>
              </div>

              {/* API Connection Mode */}
              {mode === 'api' && (
                <div className="space-y-6">
                  {/* Bank Selection */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-3">
                      {language === 'ru' ? 'Выберите банк' : 'Select Bank'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {SUPPORTED_BANKS.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedBank === bank.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{bank.logo}</span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{bank.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-500">{bank.countries.join(', ')}</p>
                                {bank.apiSupport && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                    API
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedBank && !SUPPORTED_BANKS.find(b => b.id === selectedBank)?.apiSupport && (
                      <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-amber-900">
                            {language === 'ru' 
                              ? 'API недоступен для этого банка'
                              : 'API not available for this bank'}
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            {language === 'ru'
                              ? 'Используйте режим "Загрузить выписку"'
                              : 'Please use "Upload Statement" mode'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Details */}
                  {selectedBank && SUPPORTED_BANKS.find(b => b.id === selectedBank)?.apiSupport && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          {language === 'ru' ? 'Название счёта' : 'Account Name'}
                        </label>
                        <input
                          type="text"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          placeholder={language === 'ru' ? 'Например: Основной счёт' : 'e.g., Main Account'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            {language === 'ru' ? 'Валюта' : 'Currency'}
                          </label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="KZT">KZT - Tenge</option>
                            <option value="RUB">RUB - Ruble</option>
                            <option value="GEL">GEL - Lari</option>
                            <option value="AMD">AMD - Dram</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            {language === 'ru' ? 'Начальный баланс' : 'Initial Balance'}
                          </label>
                          <input
                            type="number"
                            value={initialBalance}
                            onChange={(e) => setInitialBalance(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          {language === 'ru' ? 'API токен / Логин' : 'API Token / Login'}
                        </label>
                        <input
                          type="password"
                          value={apiToken}
                          onChange={(e) => setApiToken(e.target.value)}
                          placeholder={language === 'ru' ? 'Введите токен или данные для входа' : 'Enter token or login credentials'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {language === 'ru'
                            ? '🔒 Данные хранятся в зашифрованном виде (для MVP - mock)'
                            : '🔒 Data stored encrypted (for MVP - mock)'}
                        </p>
                      </div>

                      <button
                        onClick={handleApiConnect}
                        disabled={uploading || !selectedBank || !apiToken || !accountName}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {language === 'ru' ? 'Подключение...' : 'Connecting...'}
                          </>
                        ) : (
                          <>
                            <Link2 className="w-5 h-5" />
                            {language === 'ru' ? 'Подключить счёт' : 'Connect Account'}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Upload Mode */}
              {mode === 'manual' && (
                <div className="space-y-6">
                  {/* Supported Formats */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-3">
                      {language === 'ru' ? 'Поддерживаемые форматы' : 'Supported Formats'}
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {FILE_FORMATS.map((format) => (
                        <div
                          key={format.ext}
                          className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200"
                        >
                          <span className="text-2xl block mb-1">{format.icon}</span>
                          <p className="text-xs text-gray-900">{format.ext}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        {language === 'ru' ? 'Название счёта' : 'Account Name'}
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder={language === 'ru' ? 'Например: Kaspi Business' : 'e.g., Kaspi Business'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          {language === 'ru' ? 'Валюта' : 'Currency'}
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="KZT">KZT</option>
                          <option value="RUB">RUB</option>
                          <option value="GEL">GEL</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          {language === 'ru' ? 'Начальный баланс' : 'Initial Balance'}
                        </label>
                        <input
                          type="number"
                          value={initialBalance}
                          onChange={(e) => setInitialBalance(e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {language === 'ru' ? 'Загрузить выписку' : 'Upload Statement'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 mb-2">
                        {language === 'ru' 
                          ? 'Перетащите файл или нажмите для выбора'
                          : 'Drag and drop file or click to select'}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        CSV, XLSX, MT940, 1C, PDF (до 10MB)
                      </p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.pdf,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="file-upload"
                        className={`inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer ${
                          uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {language === 'ru' ? 'Загрузка...' : 'Uploading...'}
                          </span>
                        ) : (
                          language === 'ru' ? 'Выбрать файл' : 'Choose File'
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      {language === 'ru'
                        ? '💡 Система автоматически распознает валюту и структуру данных'
                        : '💡 System automatically recognizes currency and data structure'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
