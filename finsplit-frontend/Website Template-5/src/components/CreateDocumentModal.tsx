import { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import { toast } from 'sonner@2.0.3';
import {
  X,
  FileText,
  Download,
  Send,
  Save,
  CheckCircle2,
  Receipt,
  FileCheck,
  Loader2,
  Calendar,
  User,
  DollarSign,
  Globe
} from 'lucide-react';

interface CreateDocumentModalProps {
  onClose: () => void;
  onDocumentCreated?: (doc: any) => void;
}

const documentTypes = [
  { value: 'Invoice', labelEn: 'Invoice', labelRu: 'Счёт на оплату', icon: Receipt },
  { value: 'Act', labelEn: 'Act of Services', labelRu: 'Акт выполненных работ', icon: FileCheck },
  { value: 'Contract', labelEn: 'Contract', labelRu: 'Договор', icon: FileText },
  { value: 'Payment Order', labelEn: 'Payment Order', labelRu: 'Платёжное поручение', icon: DollarSign },
  { value: 'Declaration', labelEn: 'Declaration', labelRu: 'Декларация', icon: FileText },
];

const mockClients = [
  'Tech Solutions Ltd',
  'Digital Corp',
  'StartUp Inc',
  'Enterprise LLC',
  'Global Services',
  'Innovation Hub',
];

const countries = [
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺' },
];

const currencies = ['USD', 'EUR', 'KZT', 'RUB', 'GEL', 'AMD'];

export function CreateDocumentModal({ onClose, onDocumentCreated }: CreateDocumentModalProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [docType, setDocType] = useState('Invoice');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [country, setCountry] = useState('KZ');
  const [description, setDescription] = useState('');
  const [generatedNumber, setGeneratedNumber] = useState('');

  const handleGenerate = async () => {
    // Validation
    if (!client || !amount || !date || !dueDate) {
      toast.error(language === 'ru' ? 'Заполните все обязательные поля' : 'Please fill all required fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate document generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate document number
    const prefix = docType === 'Invoice' ? 'INV' :
                   docType === 'Act' ? 'ACT' :
                   docType === 'Contract' ? 'CNT' :
                   docType === 'Payment Order' ? 'PAY' :
                   'DEC';
    const number = `${prefix}-${Math.floor(2800 + Math.random() * 100)}`;
    setGeneratedNumber(number);
    
    setIsGenerating(false);
    setStep('preview');
    
    toast.success(language === 'ru' ? '✅ Документ создан' : '✅ Document created');
  };

  const handleDownload = () => {
    toast.success(language === 'ru' ? 'PDF документ скачивается...' : 'Downloading PDF document...');
  };

  const handleSendToClient = () => {
    toast.success(language === 'ru' ? `Документ отправлен клиенту: ${client}` : `Document sent to client: ${client}`);
  };

  const handleSaveAsDraft = () => {
    const newDoc = {
      id: Date.now(),
      type: docType,
      number: generatedNumber,
      date,
      client,
      amount: parseFloat(amount),
      currency,
      status: 'Draft',
    };
    
    if (onDocumentCreated) {
      onDocumentCreated(newDoc);
    }
    
    toast.success(language === 'ru' ? 'Документ сохранён как черновик' : 'Document saved as draft');
    onClose();
  };

  const selectedDocType = documentTypes.find(d => d.value === docType);
  const selectedCountry = countries.find(c => c.code === country);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative border-b border-gray-200 p-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="pr-12">
            <h2 className="text-gray-900 mb-2">
              {language === 'ru' ? 'Создание документа' : 'Create Document'}
            </h2>
            <p className="text-sm text-gray-600">
              {step === 'form' 
                ? (language === 'ru' ? 'Заполните данные для создания документа' : 'Fill in the details to create a document')
                : (language === 'ru' ? 'Предпросмотр и экспорт документа' : 'Preview and export document')
              }
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'form' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Document Type Selection */}
              <div>
                <label className="block text-sm text-gray-700 mb-3">
                  {language === 'ru' ? 'Тип документа' : 'Document Type'} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {documentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setDocType(type.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          docType === type.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${docType === type.value ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-xs text-center">
                          {language === 'ru' ? type.labelRu : type.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {language === 'ru' ? 'Клиент' : 'Client'} *
                  </label>
                  <select
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option value="">{language === 'ru' ? 'Выберите клиента' : 'Select client'}</option>
                    {mockClients.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Country Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language === 'ru' ? 'Страна (шаблон)' : 'Country (Template)'} *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {language === 'ru' ? 'Сумма' : 'Amount'} *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {language === 'ru' ? 'Валюта' : 'Currency'} *
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {language === 'ru' ? 'Дата документа' : 'Document Date'} *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {language === 'ru' ? 'Срок оплаты' : 'Payment Due Date'} *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {language === 'ru' ? 'Описание (необязательно)' : 'Description (Optional)'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder={language === 'ru' ? 'Дополнительные детали...' : 'Additional details...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">
                    {language === 'ru' ? 'Автоматическое заполнение' : 'Automatic Generation'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {language === 'ru' 
                      ? 'FinSplit автоматически заполнит реквизиты компании и клиента на основе выбранной страны'
                      : 'FinSplit will automatically fill in company and client details based on selected country'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">
                  {language === 'ru' ? 'Документ создан успешно!' : 'Document Created Successfully!'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ru' ? 'Номер документа:' : 'Document number:'} <span className="text-blue-600">{generatedNumber}</span>
                </p>
              </div>

              {/* Preview Box */}
              <div className="border-2 border-gray-300 rounded-xl bg-white p-8 min-h-[400px] shadow-inner">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="text-center border-b-2 border-gray-800 pb-4">
                    <h1 className="text-2xl text-gray-900 mb-2">
                      {selectedDocType && (language === 'ru' ? selectedDocType.labelRu : selectedDocType.labelEn)}
                    </h1>
                    <p className="text-sm text-gray-600">{generatedNumber}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedCountry?.flag} {selectedCountry?.name}
                    </p>
                  </div>

                  {/* Document Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ru' ? 'От:' : 'From:'}</p>
                      <p className="text-sm text-gray-900">My Business LLC</p>
                      <p className="text-xs text-gray-600">{language === 'ru' ? 'Реквизиты компании' : 'Company details'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ru' ? 'Клиенту:' : 'To:'}</p>
                      <p className="text-sm text-gray-900">{client}</p>
                      <p className="text-xs text-gray-600">{language === 'ru' ? 'Реквизиты клиента' : 'Client details'}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-6 py-4 border-t border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ru' ? 'Дата документа:' : 'Document Date:'}</p>
                      <p className="text-sm text-gray-900">{date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ru' ? 'Срок оплаты:' : 'Due Date:'}</p>
                      <p className="text-sm text-gray-900">{dueDate}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                    <p className="text-xs text-blue-700 mb-2">{language === 'ru' ? 'Сумма к оплате' : 'Amount Due'}</p>
                    <p className="text-3xl text-blue-900">
                      {parseFloat(amount).toLocaleString()} {currency}
                    </p>
                  </div>

                  {/* Description */}
                  {description && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">{language === 'ru' ? 'Описание:' : 'Description:'}</p>
                      <p className="text-sm text-gray-700">{description}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center text-xs text-gray-500 pt-6 border-t">
                    <p>{language === 'ru' ? 'Сгенерировано ФинСплит' : 'Generated by FinSplit'}</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {language === 'ru' ? 'Скачать PDF' : 'Download PDF'}
                </button>
                <button
                  onClick={handleSendToClient}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {language === 'ru' ? 'Отправить клиенту' : 'Send to Client'}
                </button>
                <button
                  onClick={handleSaveAsDraft}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {language === 'ru' ? 'Сохранить как черновик' : 'Save as Draft'}
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-900">{language === 'ru' ? 'Создание документа...' : 'Creating document...'}</p>
                <p className="text-sm text-gray-600">{language === 'ru' ? 'Формирование PDF' : 'Generating PDF'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'form' && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {language === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                {language === 'ru' ? 'Создать документ' : 'Generate Document'}
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('form')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {language === 'ru' ? 'Назад' : 'Back'}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {language === 'ru' ? 'Готово' : 'Done'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
