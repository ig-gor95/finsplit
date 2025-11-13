import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../utils/LanguageContext';

interface UploadStatementsProps {
  onClose: () => void;
}

const banks = [
  { id: 'halyk', name: 'Halyk Bank', country: 'KZ', logo: '🏦' },
  { id: 'sber', name: 'Sberbank', country: 'RU', logo: '🏦' },
  { id: 'tbc', name: 'TBC Bank', country: 'GE', logo: '🏦' },
  { id: 'ardshin', name: 'Ardshinbank', country: 'AM', logo: '🏦' },
  { id: 'kaspi', name: 'Kaspi Bank', country: 'KZ', logo: '🏦' },
];

const supportedFormats = ['CSV', 'XLSX', 'PDF', 'MT940', '1C', 'XML'];

export function UploadStatements({ onClose }: UploadStatementsProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [previewData, setPreviewData] = useState<string[][]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const fileExt = file.name.split('.').pop()?.toUpperCase();
    
    if (!supportedFormats.includes(fileExt || '')) {
      toast.error(t('upload.unsupportedFormat'));
      setUploadStatus('error');
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');

    // Simulate file processing
    setTimeout(() => {
      setUploadStatus('success');
      // Mock preview data
      setPreviewData([
        ['Date', 'Description', 'Amount', 'Balance'],
        ['2025-11-02', 'Payment from Client', '+5000.00', '125000.00'],
        ['2025-11-01', 'Office Rent', '-2500.00', '120000.00'],
        ['2025-10-31', 'AWS Services', '-450.00', '122500.00'],
        ['2025-10-30', 'Salary Payment', '-8000.00', '122950.00'],
      ]);
      toast.success(t('upload.uploadSuccess'));
    }, 2000);
  };

  const handleImport = () => {
    if (!selectedBank || !uploadedFile) {
      toast.error(t('upload.selectBankAndFile'));
      return;
    }

    toast.success(t('upload.importSuccess'));
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-black">{t('upload.title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('upload.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bank Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">{t('upload.selectBank')}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedBank === bank.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{bank.logo}</span>
                    <div>
                      <p className="text-sm text-gray-900">{bank.name}</p>
                      <p className="text-xs text-gray-500">{bank.country}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">Upload Statement</label>
            
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? 'border-blue-600 bg-blue-50'
                  : uploadStatus === 'success'
                  ? 'border-green-600 bg-green-50'
                  : uploadStatus === 'error'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {uploadStatus === 'uploading' ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-700">Processing file...</p>
                </div>
              ) : uploadStatus === 'success' && uploadedFile ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-600">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadStatus('idle');
                      setPreviewData([]);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Upload different file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Drag & drop your file here or</p>
                    <label className="inline-block mt-2">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        accept=".csv,.xlsx,.pdf,.mt940,.xml"
                        className="hidden"
                      />
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block text-sm">
                        Choose File
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: {supportedFormats.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          {previewData.length > 0 && (
            <div>
              <label className="block text-sm text-gray-700 mb-3">Preview (first 5 rows)</label>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewData[0].map((header, i) => (
                        <th key={i} className="px-4 py-2 text-left text-xs text-gray-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previewData.slice(1).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-gray-900">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedBank || !uploadedFile || uploadStatus !== 'success'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {previewData.length > 1 ? `${previewData.length - 1} transactions` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
