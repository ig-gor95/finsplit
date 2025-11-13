import { useState } from 'react';
import { FileText, Upload, Plus, Eye, Download, Mail } from 'lucide-react';
import { DocumentsSection } from './DocumentsSection';

interface Document {
  id: number;
  type: string;
  number: string;
  client: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

interface DocumentsHubProps {
  language: 'en' | 'ru';
  documents: Document[];
  transactionDocuments: Record<number, any[]>;
  transactions: any[];
  formatCurrency: (amount: number, currency: string) => string;
  onCreateDocument: () => void;
  onUploadFiles: () => void;
  getStatusColor: (status: string) => string;
}

type TabType = 'generate' | 'uploaded';

export function DocumentsHub({
  language,
  documents,
  transactionDocuments,
  transactions,
  formatCurrency,
  onCreateDocument,
  onUploadFiles,
  getStatusColor
}: DocumentsHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('generate');

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'tabs.generate': { en: 'Generate Documents', ru: 'Генерация документов' },
      'tabs.uploaded': { en: 'Uploaded Files', ru: 'Загруженные файлы' },
      'generate.title': { en: 'Document Generation', ru: 'Генерация документов' },
      'generate.subtitle': { en: 'Create invoices, acts and contracts', ru: 'Создание счетов, актов и договоров' },
      'documents.title': { en: 'Documents', ru: 'Документы' },
      'documents.createDocument': { en: 'Create Document', ru: 'Создать документ' },
      'documents.type': { en: 'Type', ru: 'Тип' },
      'documents.number': { en: 'Number', ru: 'Номер' },
      'documents.client': { en: 'Client', ru: 'Клиент' },
      'documents.amount': { en: 'Amount', ru: 'Сумма' },
      'documents.date': { en: 'Date', ru: 'Дата' },
      'documents.status': { en: 'Status', ru: 'Статус' },
      'accounts.actions': { en: 'Actions', ru: 'Действия' },
    };
    return translations[key]?.[language] || key;
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-gray-900">
              📄 {t('documents.title')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'ru' 
                ? 'Генерация документов и управление загруженными файлами'
                : 'Document generation and uploaded files management'
              }
            </p>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">{t('tabs.generate')}</div>
              <div className={`text-xs ${activeTab === 'generate' ? 'text-white/80' : 'text-gray-500'}`}>
                {documents.length} {language === 'ru' ? 'документов' : 'documents'}
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('uploaded')}
            className={`flex-1 px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
              activeTab === 'uploaded'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            <Upload className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">{t('tabs.uploaded')}</div>
              <div className={`text-xs ${activeTab === 'uploaded' ? 'text-white/80' : 'text-gray-500'}`}>
                {Object.values(transactionDocuments).flat().length} {language === 'ru' ? 'файлов' : 'files'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Generate Documents Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg text-gray-900">{t('generate.title')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('generate.subtitle')}</p>
            </div>
            <button
              onClick={onCreateDocument}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('documents.createDocument')}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm text-gray-600">{t('documents.type')}</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">{t('documents.number')}</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">{t('documents.client')}</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">{t('documents.amount')}</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">{t('documents.date')}</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">{t('documents.status')}</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">{t('accounts.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-900">{doc.type}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">{doc.number}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">{doc.client}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatCurrency(doc.amount, doc.currency)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{doc.date}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files Tab */}
      {activeTab === 'uploaded' && (
        <DocumentsSection
          language={language}
          transactionDocuments={transactionDocuments}
          transactions={transactions}
          onUploadClick={onUploadFiles}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}
