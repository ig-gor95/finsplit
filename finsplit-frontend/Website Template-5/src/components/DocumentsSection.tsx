import { useState } from 'react';
import { 
  FileText, Upload, Download, Trash2, Search, Filter, 
  CheckCircle2, AlertCircle, File, Image, FileSpreadsheet,
  Calendar, DollarSign, Building2, Eye, ExternalLink,
  SortAsc, SortDesc, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  extractedData?: {
    amount?: number;
    date?: string;
    vendor?: string;
    invoiceNumber?: string;
    confidence?: number;
  };
  linkedTransactionId?: number;
}

interface DocumentsSectionProps {
  language: 'en' | 'ru';
  transactionDocuments: Record<number, any[]>;
  transactions: any[];
  onUploadClick: () => void;
  formatCurrency: (amount: number, currency: string) => string;
}

type FilterType = 'all' | 'linked' | 'unlinked';
type SortField = 'date' | 'name' | 'size';
type SortOrder = 'asc' | 'desc';

export function DocumentsSection({ 
  language, 
  transactionDocuments, 
  transactions,
  onUploadClick,
  formatCurrency 
}: DocumentsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Собираем все документы из transactionDocuments
  const allDocuments: Document[] = [];
  Object.entries(transactionDocuments).forEach(([transactionId, docs]) => {
    docs.forEach(doc => {
      allDocuments.push({
        ...doc,
        linkedTransactionId: parseInt(transactionId)
      });
    });
  });

  // Статистика
  const stats = {
    total: allDocuments.length,
    linked: allDocuments.filter(d => d.linkedTransactionId).length,
    unlinked: allDocuments.filter(d => !d.linkedTransactionId).length,
    pdfs: allDocuments.filter(d => d.fileType.includes('pdf')).length,
    images: allDocuments.filter(d => d.fileType.includes('image')).length,
    others: allDocuments.filter(d => !d.fileType.includes('pdf') && !d.fileType.includes('image')).length
  };

  // Фильтрация
  const filteredDocuments = allDocuments.filter(doc => {
    // Поиск по названию
    if (searchQuery && !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Фильтр по статусу привязки
    if (filterType === 'linked' && !doc.linkedTransactionId) return false;
    if (filterType === 'unlinked' && doc.linkedTransactionId) return false;

    // Фильтр по типу файла
    if (selectedFileType !== 'all') {
      if (selectedFileType === 'pdf' && !doc.fileType.includes('pdf')) return false;
      if (selectedFileType === 'image' && !doc.fileType.includes('image')) return false;
      if (selectedFileType === 'other' && (doc.fileType.includes('pdf') || doc.fileType.includes('image'))) return false;
    }

    return true;
  });

  // Сортировка
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'date') {
      comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
    } else if (sortField === 'name') {
      comparison = a.fileName.localeCompare(b.fileName);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getLinkedTransaction = (transactionId?: number) => {
    if (!transactionId) return null;
    return transactions.find(t => t.id === transactionId);
  };

  const handleDownload = (doc: Document) => {
    toast.success(
      language === 'ru' ? `Скачивание ${doc.fileName}` : `Downloading ${doc.fileName}`,
      { description: language === 'ru' ? 'Файл загружается...' : 'File is downloading...' }
    );
  };

  const handleDelete = (doc: Document) => {
    toast.success(
      language === 'ru' ? 'Документ удалён' : 'Document deleted',
      { description: doc.fileName }
    );
  };

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Upload Button Row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">
            {language === 'ru' 
              ? 'Все загруженные документы и счета с AI-распознаванием' 
              : 'All uploaded documents and invoices with AI recognition'}
          </p>
        </div>
        <button
          onClick={onUploadClick}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {language === 'ru' ? 'Загрузить документы' : 'Upload Documents'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">{language === 'ru' ? 'Всего' : 'Total'}</p>
              <p className="text-2xl text-blue-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">{language === 'ru' ? 'Привязано' : 'Linked'}</p>
              <p className="text-2xl text-green-900">{stats.linked}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">{language === 'ru' ? 'Не привязано' : 'Unlinked'}</p>
              <p className="text-2xl text-orange-900">{stats.unlinked}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">PDF</p>
              <p className="text-2xl text-red-900">{stats.pdfs}</p>
            </div>
            <FileText className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">{language === 'ru' ? 'Изображения' : 'Images'}</p>
              <p className="text-2xl text-purple-900">{stats.images}</p>
            </div>
            <Image className="w-8 h-8 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">{language === 'ru' ? 'Прочее' : 'Other'}</p>
              <p className="text-2xl text-gray-900">{stats.others}</p>
            </div>
            <File className="w-8 h-8 text-gray-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск по названию...' : 'Search by name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by status */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{language === 'ru' ? 'Все документы' : 'All documents'}</option>
            <option value="linked">{language === 'ru' ? 'Привязаны к транзакциям' : 'Linked to transactions'}</option>
            <option value="unlinked">{language === 'ru' ? 'Не привязаны' : 'Unlinked'}</option>
          </select>

          {/* Filter by file type */}
          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{language === 'ru' ? 'Все типы' : 'All types'}</option>
            <option value="pdf">PDF</option>
            <option value="image">{language === 'ru' ? 'Изображения' : 'Images'}</option>
            <option value="other">{language === 'ru' ? 'Прочее' : 'Other'}</option>
          </select>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">{language === 'ru' ? 'По дате' : 'By date'}</option>
              <option value="name">{language === 'ru' ? 'По названию' : 'By name'}</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Active filters count */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          {language === 'ru' ? 'Показано' : 'Showing'} {sortedDocuments.length} {language === 'ru' ? 'из' : 'of'} {allDocuments.length} {language === 'ru' ? 'документов' : 'documents'}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-700">
                  {language === 'ru' ? 'Документ' : 'Document'}
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-700">
                  {language === 'ru' ? 'AI Данные' : 'AI Data'}
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-700">
                  {language === 'ru' ? 'Привязка' : 'Link'}
                </th>
                <th className="px-6 py-4 text-left text-sm text-gray-700">
                  {language === 'ru' ? 'Загружено' : 'Uploaded'}
                </th>
                <th className="px-6 py-4 text-right text-sm text-gray-700">
                  {language === 'ru' ? 'Действия' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedDocuments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {language === 'ru' ? 'Нет документов' : 'No documents found'}
                    </p>
                  </td>
                </tr>
              ) : (
                sortedDocuments.map((doc) => {
                  const linkedTransaction = getLinkedTransaction(doc.linkedTransactionId);
                  
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      {/* Document Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.fileType)}
                          <div>
                            <p className="text-sm text-gray-900">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">{doc.fileType}</p>
                          </div>
                        </div>
                      </td>

                      {/* AI Extracted Data */}
                      <td className="px-6 py-4">
                        {doc.extractedData ? (
                          <div className="space-y-1">
                            {doc.extractedData.amount && (
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-gray-900">
                                  {formatCurrency(doc.extractedData.amount, 'KZT')}
                                </span>
                              </div>
                            )}
                            {doc.extractedData.date && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600">{doc.extractedData.date}</span>
                              </div>
                            )}
                            {doc.extractedData.vendor && (
                              <div className="flex items-center gap-2 text-sm">
                                <Building2 className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-600">{doc.extractedData.vendor}</span>
                              </div>
                            )}
                            {doc.extractedData.confidence && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                AI: {doc.extractedData.confidence}%
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            {language === 'ru' ? 'Нет данных' : 'No data'}
                          </span>
                        )}
                      </td>

                      {/* Linked Transaction */}
                      <td className="px-6 py-4">
                        {linkedTransaction ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-900">{linkedTransaction.description}</p>
                              <p className="text-xs text-gray-500">
                                {formatCurrency(linkedTransaction.amount, linkedTransaction.account.split(' ')[0])}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-orange-600">
                              {language === 'ru' ? 'Не привязан' : 'Unlinked'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Upload Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {new Date(doc.uploadDate).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.uploadDate).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={language === 'ru' ? 'Просмотр' : 'Preview'}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={language === 'ru' ? 'Скачать' : 'Download'}
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={language === 'ru' ? 'Удалить' : 'Delete'}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedDocument.fileType)}
                <div>
                  <h3 className="text-lg text-gray-900">{selectedDocument.fileName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedDocument.uploadDate).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ExternalLink className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* AI Extracted Data */}
              {selectedDocument.extractedData && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                  <h4 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    {language === 'ru' ? 'AI Распознанные данные' : 'AI Extracted Data'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDocument.extractedData.amount && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Сумма' : 'Amount'}</p>
                        <p className="text-lg text-gray-900">
                          {formatCurrency(selectedDocument.extractedData.amount, 'KZT')}
                        </p>
                      </div>
                    )}
                    {selectedDocument.extractedData.date && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Дата' : 'Date'}</p>
                        <p className="text-lg text-gray-900">{selectedDocument.extractedData.date}</p>
                      </div>
                    )}
                    {selectedDocument.extractedData.vendor && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Поставщик' : 'Vendor'}</p>
                        <p className="text-lg text-gray-900">{selectedDocument.extractedData.vendor}</p>
                      </div>
                    )}
                    {selectedDocument.extractedData.invoiceNumber && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Номер счёта' : 'Invoice Number'}</p>
                        <p className="text-lg text-gray-900 font-mono">{selectedDocument.extractedData.invoiceNumber}</p>
                      </div>
                    )}
                    {selectedDocument.extractedData.confidence && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Уверенность AI' : 'AI Confidence'}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${selectedDocument.extractedData.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{selectedDocument.extractedData.confidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Linked Transaction Info */}
              {selectedDocument.linkedTransactionId && (
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                  <h4 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {language === 'ru' ? 'Привязана к транзакции' : 'Linked to Transaction'}
                  </h4>
                  {(() => {
                    const transaction = getLinkedTransaction(selectedDocument.linkedTransactionId);
                    return transaction ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(transaction.amount, transaction.account.split(' ')[0])} • {transaction.date}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* File Preview Placeholder */}
              <div className="bg-gray-100 rounded-xl p-12 text-center border-2 border-gray-200">
                {selectedDocument.fileType.includes('image') ? (
                  <div>
                    <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === 'ru' ? 'Предпросмотр изображения' : 'Image preview'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {language === 'ru' ? 'В продакшен версии здесь будет изображение' : 'In production version, image will be displayed here'}
                    </p>
                  </div>
                ) : selectedDocument.fileType.includes('pdf') ? (
                  <div>
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === 'ru' ? 'Предпросмотр PDF' : 'PDF preview'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {language === 'ru' ? 'В продакшен версии здесь будет PDF-viewer' : 'In production version, PDF viewer will be displayed here'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === 'ru' ? 'Предпросмотр файла' : 'File preview'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {language === 'ru' ? 'Скачать' : 'Download'}
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'ru' ? 'Закрыть' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}