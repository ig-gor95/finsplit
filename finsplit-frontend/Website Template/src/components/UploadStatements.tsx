import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../utils/LanguageContext';
import { useUploadFile } from '../hooks';

interface UploadStatementsProps {
  onClose: () => void;
}

const banks = [
  { id: 'RAIFFEISEN', name: 'Raiffeisen Bank', country: 'RU', logo: '🏦', formats: ['XLSX', 'XLS', 'TXT'] },
  { id: 'ONE_C_FORMAT', name: '1C Format (Generic)', country: 'Multi', logo: '📊', formats: ['TXT'] },
];

const supportedFormats = ['XLSX', 'XLS', 'TXT'];

export function UploadStatements({ onClose }: UploadStatementsProps) {
  const { t, language } = useLanguage();
  const { mutate: uploadFile, isPending, isSuccess, isError } = useUploadFile();
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<any>(null);

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
    
    console.log('File selected:', { name: file.name, size: file.size, ext: fileExt });
    
    if (!supportedFormats.includes(fileExt || '')) {
      toast.error(language === 'ru' ? 'Неподдерживаемый формат файла' : 'Unsupported file format');
      return;
    }

    setUploadedFile(file);
    toast.success(language === 'ru' ? `Файл выбран: ${file.name}` : `File selected: ${file.name}`);
  };

  const handleImport = () => {
    console.log('Import clicked:', { selectedBank, uploadedFile: uploadedFile?.name });
    
    if (!selectedBank || !uploadedFile) {
      toast.error(language === 'ru' ? 'Выберите банк и файл' : 'Select bank and file');
      console.error('Missing data:', { selectedBank, hasFile: !!uploadedFile });
      return;
    }

    console.log('Starting upload:', { bank: selectedBank, file: uploadedFile.name });

    // Загрузка файла через API
    uploadFile(
      { file: uploadedFile, bankType: selectedBank },
      {
        onSuccess: (data) => {
          console.log('Upload success:', data);
          setUploadResponse(data);
          // Закрыть модальное окно через 3 секунды после успеха
          setTimeout(() => {
            onClose();
          }, 3000);
        },
        onError: (error: any) => {
          console.error('Upload error:', error);
        },
      }
    );
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
                  : isSuccess
                  ? 'border-green-600 bg-green-50'
                  : isError
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {isPending ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-700">{language === 'ru' ? 'Обработка файла...' : 'Processing file...'}</p>
                </div>
              ) : uploadedFile && !isPending ? (
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
                      setUploadResponse(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {language === 'ru' ? 'Загрузить другой файл' : 'Upload different file'}
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

          {/* Upload Success Result */}
          {isSuccess && uploadResponse && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                ✅ {language === 'ru' ? 'Файл успешно обработан!' : 'File processed successfully!'}
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Импортировано' : 'Imported'}</p>
                  <p className="text-2xl font-bold text-green-600">{uploadResponse.importedTransactions}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Обновлено' : 'Updated'}</p>
                  <p className="text-2xl font-bold text-blue-600">{uploadResponse.updatedTransactions}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <p className="text-sm text-gray-600 mb-1">{language === 'ru' ? 'Пропущено' : 'Skipped'}</p>
                  <p className="text-2xl font-bold text-orange-600">{uploadResponse.skippedTransactions}</p>
                </div>
              </div>

              {uploadResponse.accountMetadata && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {language === 'ru' ? 'Информация о счёте:' : 'Account Information:'}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    {uploadResponse.accountMetadata.accountNumber && (
                      <p>Счёт: <span className="font-mono">{uploadResponse.accountMetadata.accountNumber}</span></p>
                    )}
                    {uploadResponse.accountMetadata.clientName && (
                      <p>Клиент: {uploadResponse.accountMetadata.clientName}</p>
                    )}
                    {uploadResponse.accountMetadata.closingBalance !== undefined && (
                      <p>Исходящий остаток: <span className="font-semibold">{uploadResponse.accountMetadata.closingBalance} {uploadResponse.accountMetadata.currency || 'RUB'}</span></p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm"
          >
            {language === 'ru' ? 'Закрыть' : 'Close'}
          </button>
          {!isSuccess && (
            <div className="flex items-center gap-4">
              {!selectedBank && uploadedFile && (
                <p className="text-sm text-orange-600">
                  ⚠️ {language === 'ru' ? 'Выберите банк' : 'Select a bank'}
                </p>
              )}
              {!uploadedFile && selectedBank && (
                <p className="text-sm text-orange-600">
                  ⚠️ {language === 'ru' ? 'Загрузите файл' : 'Upload a file'}
                </p>
              )}
              <button
                onClick={handleImport}
                disabled={!selectedBank || !uploadedFile || isPending}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={!selectedBank ? (language === 'ru' ? 'Сначала выберите банк' : 'Select bank first') : !uploadedFile ? (language === 'ru' ? 'Сначала загрузите файл' : 'Upload file first') : ''}
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === 'ru' ? 'Загрузка...' : 'Uploading...'}
                  </>
                ) : (
                  <>{language === 'ru' ? 'Импортировать' : 'Import'}</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
