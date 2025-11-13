import { useState, useRef } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import { toast } from 'sonner';
import {
  Upload,
  X,
  FileText,
  Image,
  File,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Eye,
  Download,
  Link2,
  XCircle,
  Search,
  Filter,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  counterparty?: {
    name: string;
  };
}

interface DocumentUploadManagerProps {
  onClose: () => void;
  transactions: Transaction[];
  onDocumentsMatched: (matches: any[]) => void;
}

interface UploadedDocument {
  id: string;
  file: File;
  preview?: string;
  extractedData?: {
    amount?: number;
    date?: string;
    vendor?: string;
    invoiceNumber?: string;
    confidence: number;
  };
  matchStatus: 'pending' | 'matched' | 'review' | 'unmatched';
  suggestedTransactionId?: number;
  matchConfidence?: number;
}

export function DocumentUploadManager({ onClose, transactions, onDocumentsMatched }: DocumentUploadManagerProps) {
  const { language } = useLanguage();
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate OCR and data extraction from document
  const extractDataFromDocument = async (file: File): Promise<UploadedDocument['extractedData']> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock extracted data (in real app, this would be OCR + AI)
    const mockData = [
      { amount: 45000, date: '2025-11-02', vendor: 'Amazon Web Services', invoiceNumber: 'AWS-INV-NOV-2025', confidence: 95 },
      { amount: 250000, date: '2025-11-01', vendor: 'Almaty Business Center', invoiceNumber: 'RENT-NOV-2025', confidence: 98 },
      { amount: 2500, date: '2025-11-02', vendor: 'Tech Solutions Ltd', invoiceNumber: 'INV-2845', confidence: 92 },
      { amount: 12000, date: '2025-10-29', vendor: 'Beeline Kazakhstan', invoiceNumber: 'TEL-OCT-2025', confidence: 88 },
    ];

    return mockData[Math.floor(Math.random() * mockData.length)];
  };

  // AI-based transaction matching
  const findMatchingTransaction = (docData: UploadedDocument['extractedData']): { transactionId?: number; confidence: number } => {
    if (!docData) return { confidence: 0 };

    let bestMatch: { transactionId?: number; confidence: number } = { confidence: 0 };

    transactions.forEach(transaction => {
      let matchScore = 0;
      
      // Match by amount (most important)
      if (docData.amount && Math.abs(Math.abs(transaction.amount) - docData.amount) < 100) {
        matchScore += 60;
      }
      
      // Match by date
      if (docData.date && transaction.date === docData.date) {
        matchScore += 30;
      }
      
      // Match by vendor name
      if (docData.vendor && transaction.counterparty?.name.toLowerCase().includes(docData.vendor.toLowerCase())) {
        matchScore += 10;
      }

      if (matchScore > bestMatch.confidence) {
        bestMatch = { transactionId: transaction.id, confidence: matchScore };
      }
    });

    return bestMatch;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newDocs: UploadedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const docId = `doc-${Date.now()}-${i}`;
      
      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      // Extract data from document
      const extractedData = await extractDataFromDocument(file);
      
      // Find matching transaction
      const match = findMatchingTransaction(extractedData);
      
      let matchStatus: UploadedDocument['matchStatus'] = 'unmatched';
      if (match.confidence >= 80) {
        matchStatus = 'matched';
      } else if (match.confidence >= 50) {
        matchStatus = 'review';
      }

      newDocs.push({
        id: docId,
        file,
        preview,
        extractedData,
        matchStatus,
        suggestedTransactionId: match.transactionId,
        matchConfidence: match.confidence,
      });
    }

    setUploadedDocs(prev => [...prev, ...newDocs]);
    setIsProcessing(false);

    toast.success(
      language === 'ru' 
        ? `Загружено ${newDocs.length} документов. AI анализ завершён.` 
        : `${newDocs.length} documents uploaded. AI analysis complete.`
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeDocument = (docId: string) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== docId));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
    }
  };

  const updateDocumentMatch = (docId: string, transactionId: number) => {
    setUploadedDocs(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, suggestedTransactionId: transactionId, matchStatus: 'matched', matchConfidence: 100 }
        : doc
    ));
    toast.success(language === 'ru' ? 'Документ сопоставлен' : 'Document matched');
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusColor = (status: UploadedDocument['matchStatus']) => {
    switch (status) {
      case 'matched': return 'bg-green-100 text-green-700 border-green-200';
      case 'review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'unmatched': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status: UploadedDocument['matchStatus']) => {
    switch (status) {
      case 'matched': return <CheckCircle2 className="w-4 h-4" />;
      case 'review': return <AlertCircle className="w-4 h-4" />;
      case 'unmatched': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredDocs = uploadedDocs.filter(doc => 
    filterStatus === 'all' || doc.matchStatus === filterStatus
  );

  const stats = {
    total: uploadedDocs.length,
    matched: uploadedDocs.filter(d => d.matchStatus === 'matched').length,
    review: uploadedDocs.filter(d => d.matchStatus === 'review').length,
    unmatched: uploadedDocs.filter(d => d.matchStatus === 'unmatched').length,
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                {language === 'ru' ? 'Загрузка документов' : 'Document Upload'}
              </h2>
              <p className="text-blue-100 text-sm">
                {language === 'ru' 
                  ? 'Загрузите чеки, PDF счета, акты и другие документы. AI автоматически сопоставит их с транзакциями.' 
                  : 'Upload receipts, PDF invoices, acts and other documents. AI will automatically match them with transactions.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-blue-100 mb-1">{language === 'ru' ? 'Всего' : 'Total'}</p>
              <p className="text-2xl">{stats.total}</p>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30">
              <p className="text-xs text-green-100 mb-1">{language === 'ru' ? 'Сопоставлено' : 'Matched'}</p>
              <p className="text-2xl">{stats.matched}</p>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-sm rounded-lg p-3 border border-amber-400/30">
              <p className="text-xs text-amber-100 mb-1">{language === 'ru' ? 'На проверке' : 'Review'}</p>
              <p className="text-2xl">{stats.review}</p>
            </div>
            <div className="bg-gray-500/20 backdrop-blur-sm rounded-lg p-3 border border-gray-400/30">
              <p className="text-xs text-gray-100 mb-1">{language === 'ru' ? 'Не сопоставлено' : 'Unmatched'}</p>
              <p className="text-2xl">{stats.unmatched}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Upload className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <p className="text-lg text-gray-900 mb-1">
                  {language === 'ru' ? 'Перетащите файлы сюда' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'ru' ? 'или' : 'or'}
                </p>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {language === 'ru' ? 'Выбрать файлы' : 'Choose Files'}
              </button>
              
              <p className="text-xs text-gray-500">
                {language === 'ru' 
                  ? 'Поддерживаются: JPG, PNG, PDF, DOC, DOCX (макс. 10MB каждый)' 
                  : 'Supported: JPG, PNG, PDF, DOC, DOCX (max 10MB each)'}
              </p>
            </div>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-3 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              <p className="text-blue-900">
                {language === 'ru' ? 'AI обрабатывает документы...' : 'AI processing documents...'}
              </p>
            </div>
          )}

          {/* Filter */}
          {uploadedDocs.length > 0 && (
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <div className="flex gap-2">
                {['all', 'matched', 'review', 'unmatched'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' && (language === 'ru' ? 'Все' : 'All')}
                    {status === 'matched' && (language === 'ru' ? 'Сопоставлено' : 'Matched')}
                    {status === 'review' && (language === 'ru' ? 'На проверке' : 'Review')}
                    {status === 'unmatched' && (language === 'ru' ? 'Не сопоставлено' : 'Unmatched')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents Grid */}
          {filteredDocs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map(doc => {
                const matchedTransaction = transactions.find(t => t.id === doc.suggestedTransactionId);
                
                return (
                  <div
                    key={doc.id}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                  >
                    {/* Preview */}
                    <div className="h-40 bg-gray-100 relative">
                      {doc.preview ? (
                        <img src={doc.preview} alt={doc.file.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(doc.file)}
                          <span className="ml-2 text-sm text-gray-600">{doc.file.name.split('.').pop()?.toUpperCase()}</span>
                        </div>
                      )}
                      
                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          title={language === 'ru' ? 'Просмотр' : 'View'}
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-2 bg-white rounded-lg hover:bg-red-100 transition-colors"
                          title={language === 'ru' ? 'Удалить' : 'Remove'}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-900 truncate flex-1" title={doc.file.name}>
                          {doc.file.name}
                        </p>
                        <div className={`px-2 py-1 rounded-md text-xs border flex items-center gap-1 ${getStatusColor(doc.matchStatus)}`}>
                          {getStatusIcon(doc.matchStatus)}
                          {doc.matchConfidence}%
                        </div>
                      </div>

                      {/* Extracted Data */}
                      {doc.extractedData && (
                        <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 text-xs text-blue-900">
                            <Sparkles className="w-3 h-3" />
                            <span>{language === 'ru' ? 'AI извлёк данные' : 'AI extracted data'}</span>
                          </div>
                          {doc.extractedData.amount && (
                            <div className="flex items-center gap-2 text-xs">
                              <DollarSign className="w-3 h-3 text-blue-600" />
                              <span className="text-gray-700">{doc.extractedData.amount.toLocaleString()} KZT</span>
                            </div>
                          )}
                          {doc.extractedData.date && (
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="w-3 h-3 text-blue-600" />
                              <span className="text-gray-700">{doc.extractedData.date}</span>
                            </div>
                          )}
                          {doc.extractedData.vendor && (
                            <div className="text-xs text-gray-700 truncate">
                              {doc.extractedData.vendor}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Matched Transaction */}
                      {matchedTransaction && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-start gap-2">
                            <Link2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-green-900 mb-1">
                                {language === 'ru' ? 'Сопоставлено с транзакцией' : 'Matched with transaction'}
                              </p>
                              <p className="text-sm text-gray-900 truncate">
                                {matchedTransaction.description}
                              </p>
                              <p className="text-xs text-gray-600">
                                {matchedTransaction.date} • {Math.abs(matchedTransaction.amount).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Manual Match Button */}
                      {doc.matchStatus !== 'matched' && (
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Search className="w-4 h-4" />
                          {language === 'ru' ? 'Сопоставить вручную' : 'Match Manually'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {uploadedDocs.length === 0 && !isProcessing && (
            <div className="text-center py-12 text-gray-500">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{language === 'ru' ? 'Нет загруженных документов' : 'No uploaded documents'}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {language === 'ru' 
              ? `Загружено ${uploadedDocs.length} документов, сопоставлено ${stats.matched}` 
              : `${uploadedDocs.length} documents uploaded, ${stats.matched} matched`}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {language === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
            <button
              onClick={() => {
                onDocumentsMatched(uploadedDocs);
                toast.success(
                  language === 'ru' 
                    ? `Сохранено ${stats.matched} сопоставленных документов` 
                    : `Saved ${stats.matched} matched documents`
                );
                onClose();
              }}
              disabled={stats.matched === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'ru' ? 'Сохранить сопоставления' : 'Save Matches'}
            </button>
          </div>
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <DocumentDetailModal
          document={selectedDoc}
          transactions={transactions}
          onClose={() => setSelectedDoc(null)}
          onMatch={(transactionId) => {
            updateDocumentMatch(selectedDoc.id, transactionId);
            setSelectedDoc(null);
          }}
        />
      )}
    </div>
  );
}

// Document Detail Modal for manual matching
function DocumentDetailModal({ 
  document, 
  transactions, 
  onClose, 
  onMatch 
}: { 
  document: UploadedDocument; 
  transactions: Transaction[]; 
  onClose: () => void;
  onMatch: (transactionId: number) => void;
}) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.counterparty?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.date.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
        {/* Document Preview */}
        <div className="w-1/2 bg-gray-900 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">{language === 'ru' ? 'Предпросмотр' : 'Preview'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {document.preview ? (
              <img src={document.preview} alt={document.file.name} className="max-w-full max-h-full object-contain rounded-lg" />
            ) : (
              <div className="text-center text-white">
                <FileText className="w-24 h-24 mx-auto mb-4 text-white/50" />
                <p className="text-white/70">{document.file.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Selection */}
        <div className="w-1/2 p-6 flex flex-col">
          <h3 className="text-xl text-gray-900 mb-4">
            {language === 'ru' ? 'Сопоставить с транзакцией' : 'Match with Transaction'}
          </h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ru' ? 'Поиск транзакции...' : 'Search transaction...'}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Transaction List */}
          <div className="flex-1 overflow-auto space-y-2">
            {filteredTransactions.map(transaction => (
              <button
                key={transaction.id}
                onClick={() => onMatch(transaction.id)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-900 group-hover:text-blue-900">
                    {transaction.description}
                  </p>
                  <span className={`text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{transaction.date}</span>
                  {transaction.counterparty && (
                    <span className="truncate">{transaction.counterparty.name}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
