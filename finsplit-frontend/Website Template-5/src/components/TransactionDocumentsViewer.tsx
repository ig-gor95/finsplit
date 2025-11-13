import { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import { FileText, Image as ImageIcon, File, Download, Eye, X, Calendar, DollarSign, Sparkles } from 'lucide-react';

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
    confidence: number;
  };
}

interface TransactionDocumentsViewerProps {
  documents: Document[];
  transactionId: number;
}

export function TransactionDocumentsViewer({ documents, transactionId }: TransactionDocumentsViewerProps) {
  const { language } = useLanguage();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  if (!documents || documents.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">
          {language === 'ru' ? 'Нет прикреплённых документов' : 'No attached documents'}
        </p>
      </div>
    );
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-600" />;
    if (fileType === 'application/pdf') return <FileText className="w-5 h-5 text-red-600" />;
    return <File className="w-5 h-5 text-gray-600" />;
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm text-gray-900">
            {language === 'ru' ? 'Прикреплённые документы' : 'Attached Documents'}
          </h4>
          <span className="text-xs text-gray-500">
            {documents.length} {language === 'ru' ? 'файл(ов)' : 'file(s)'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate mb-1">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {language === 'ru' ? 'Загружено:' : 'Uploaded:'} {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                  
                  {doc.extractedData && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-blue-900">
                          {language === 'ru' ? 'AI данные' : 'AI extracted'} ({doc.extractedData.confidence}%)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {doc.extractedData.amount && (
                          <div className="flex items-center gap-1 text-gray-700">
                            <DollarSign className="w-3 h-3 text-gray-500" />
                            {doc.extractedData.amount.toLocaleString()}
                          </div>
                        )}
                        {doc.extractedData.date && (
                          <div className="flex items-center gap-1 text-gray-700">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            {doc.extractedData.date}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title={language === 'ru' ? 'Просмотр' : 'View'}
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title={language === 'ru' ? 'Скачать' : 'Download'}
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-lg text-gray-900">{selectedDoc.fileName}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ru' ? 'Загружено:' : 'Uploaded:'} {new Date(selectedDoc.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 bg-gray-900 flex items-center justify-center min-h-[400px]">
              <div className="text-center text-white">
                {getFileIcon(selectedDoc.fileType)}
                <p className="mt-4 text-white/70">{language === 'ru' ? 'Предпросмотр' : 'Preview'}</p>
                <p className="text-sm text-white/50 mt-2">{selectedDoc.fileName}</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {language === 'ru' ? 'Закрыть' : 'Close'}
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                {language === 'ru' ? 'Скачать' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
