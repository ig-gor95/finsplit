import { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import { toast } from 'sonner';
import {
  X,
  ChevronRight,
  ChevronLeft,
  FileText,
  CheckCircle2,
  Loader2,
  Edit3,
  RefreshCw,
  Download,
  Send,
  Save,
  AlertCircle
} from 'lucide-react';

interface TaxReportWizardProps {
  onClose: () => void;
}

interface ReportData {
  category: string;
  income: number;
  expenses: number;
  fees: number;
  taxes: number;
}

const countryForms: Record<string, string[]> = {
  KZ: ['910.00', '240.00'],
  RU: ['УСН', '3-НДФЛ'],
  GE: ['Form A', 'Form B'],
  AM: ['Tax Form 1', 'Tax Form 2'],
};

const mockReportData: ReportData[] = [
  { category: 'Income', income: 10700, expenses: 0, fees: 0, taxes: 0 },
  { category: 'Salaries', income: 0, expenses: 3200, fees: 0, taxes: 0 },
  { category: 'Rent', income: 0, expenses: 2500, fees: 0, taxes: 0 },
  { category: 'IT Services', income: 0, expenses: 950, fees: 45, taxes: 0 },
  { category: 'Marketing', income: 0, expenses: 850, fees: 25, taxes: 0 },
  { category: 'Utilities', income: 0, expenses: 120, fees: 5, taxes: 0 },
  { category: 'Total', income: 10700, expenses: 7620, fees: 75, taxes: 305 },
];

export function TaxReportWizard({ onClose }: TaxReportWizardProps) {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  
  // Form data
  const [selectedCountry, setSelectedCountry] = useState('KZ');
  const [selectedForm, setSelectedForm] = useState('910.00');
  const [periodType, setPeriodType] = useState('quarter');
  const [selectedPeriod, setSelectedPeriod] = useState('q3-2025');
  const [reportData, setReportData] = useState<ReportData[]>(mockReportData);

  const totalSteps = 3;
  const progressPercent = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep === 1) {
      // Simulate AI analysis
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(language === 'ru' ? 'Данные обновлены' : 'Data refreshed');
    setIsLoading(false);
  };

  const handleFinish = () => {
    toast.success(t('taxWizard.success'));
    onClose();
  };

  const handleSaveDraft = () => {
    toast.success(language === 'ru' ? 'Отчёт сохранён как черновик' : 'Report saved as draft');
    onClose();
  };

  const handleDownloadPDF = () => {
    toast.success(language === 'ru' ? 'PDF скачивается...' : 'Downloading PDF...');
  };

  const handleSubmitToTax = () => {
    toast.info(language === 'ru' ? 'Отправка в налоговую скоро будет доступна' : 'Tax submission coming soon');
  };

  const updateReportData = (index: number, field: keyof ReportData, value: number) => {
    const newData = [...reportData];
    newData[index] = { ...newData[index], [field]: value };
    
    // Recalculate totals
    const totals = newData.slice(0, -1).reduce((acc, row) => ({
      category: 'Total',
      income: acc.income + row.income,
      expenses: acc.expenses + row.expenses,
      fees: acc.fees + row.fees,
      taxes: acc.taxes + row.taxes,
    }), { category: 'Total', income: 0, expenses: 0, fees: 0, taxes: 0 });
    
    newData[newData.length - 1] = totals;
    setReportData(newData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative border-b border-gray-200 p-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="pr-12">
            <h2 className="text-gray-900 mb-2">{t('taxWizard.title')}</h2>
            <p className="text-sm text-gray-600">{t('taxWizard.subtitle')}</p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    currentStep >= step
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {currentStep > step ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm">{step}</span>
                    )}
                  </div>
                  <div className="flex-1 mx-2">
                    <p className={`text-xs ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                      {t(`taxWizard.step${step}` as any)}
                    </p>
                  </div>
                  {step < 3 && (
                    <div className={`h-0.5 w-12 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Country & Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {t('taxWizard.country')} *
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedForm(countryForms[e.target.value][0]);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option value="KZ">🇰🇿 Kazakhstan</option>
                    <option value="RU">🇷🇺 Russia</option>
                    <option value="GE">🇬🇪 Georgia</option>
                    <option value="AM">🇦🇲 Armenia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {t('taxWizard.formType')} *
                  </label>
                  <select
                    value={selectedForm}
                    onChange={(e) => setSelectedForm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    {countryForms[selectedCountry].map((form) => (
                      <option key={form} value={form}>{form}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t('taxWizard.periodType')} *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['quarter', 'month', 'year'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPeriodType(type)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        periodType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm capitalize">
                        {t(`taxWizard.${type}` as any)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t('taxes.period')} *
                </label>
                {periodType === 'quarter' && (
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option value="q4-2025">{t('taxWizard.q4')} 2025</option>
                    <option value="q3-2025">{t('taxWizard.q3')} 2025</option>
                    <option value="q2-2025">{t('taxWizard.q2')} 2025</option>
                    <option value="q1-2025">{t('taxWizard.q1')} 2025</option>
                  </select>
                )}
                {periodType === 'month' && (
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option value="nov-2025">{language === 'ru' ? 'Ноябрь' : 'November'} 2025</option>
                    <option value="oct-2025">{language === 'ru' ? 'Октябрь' : 'October'} 2025</option>
                    <option value="sep-2025">{language === 'ru' ? 'Сентябрь' : 'September'} 2025</option>
                  </select>
                )}
                {periodType === 'year' && (
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">
                    {language === 'ru' ? 'Выбрано:' : 'Selected:'} {selectedCountry} - {selectedForm}
                  </p>
                  <p className="text-xs text-blue-700">
                    {language === 'ru' ? 'На следующем шаге данные будут автоматически заполнены' : 'Data will be auto-filled in the next step'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && currentStep === 2 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-900 mb-2">{t('taxWizard.analyzing')}</p>
              <p className="text-sm text-gray-600">{t('taxWizard.calculating')}</p>
            </div>
          )}

          {/* Step 2: Data Review */}
          {currentStep === 2 && !isLoading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">{t('taxWizard.dataTable')}</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditable(!isEditable)}
                    className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm ${
                      isEditable
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    {t('taxWizard.editManually')}
                  </button>
                  <button
                    onClick={handleRefreshData}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t('taxWizard.refreshData')}
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-4 px-6 text-sm text-gray-700">{t('taxWizard.category')}</th>
                        <th className="text-right py-4 px-6 text-sm text-gray-700">{t('taxWizard.income')}</th>
                        <th className="text-right py-4 px-6 text-sm text-gray-700">{t('taxWizard.expenses')}</th>
                        <th className="text-right py-4 px-6 text-sm text-gray-700">{t('taxWizard.fees')}</th>
                        <th className="text-right py-4 px-6 text-sm text-gray-700">{t('taxWizard.taxes')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((row, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 ${
                            row.category === 'Total'
                              ? 'bg-blue-50 font-semibold'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="py-4 px-6 text-sm text-gray-900">{row.category}</td>
                          <td className="py-4 px-6 text-sm text-right">
                            {isEditable && row.category !== 'Total' ? (
                              <input
                                type="number"
                                value={row.income}
                                onChange={(e) => updateReportData(index, 'income', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            ) : (
                              <span className={row.income > 0 ? 'text-green-600' : 'text-gray-900'}>
                                ${row.income.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-right">
                            {isEditable && row.category !== 'Total' ? (
                              <input
                                type="number"
                                value={row.expenses}
                                onChange={(e) => updateReportData(index, 'expenses', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            ) : (
                              <span className={row.expenses > 0 ? 'text-red-600' : 'text-gray-900'}>
                                ${row.expenses.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-right">
                            {isEditable && row.category !== 'Total' ? (
                              <input
                                type="number"
                                value={row.fees}
                                onChange={(e) => updateReportData(index, 'fees', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            ) : (
                              <span className="text-gray-900">${row.fees.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-right">
                            {isEditable && row.category !== 'Total' ? (
                              <input
                                type="number"
                                value={row.taxes}
                                onChange={(e) => updateReportData(index, 'taxes', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            ) : (
                              <span className="text-gray-900">${row.taxes.toLocaleString()}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900 mb-1">
                    {language === 'ru' ? 'AI-категоризация завершена' : 'AI categorization complete'}
                  </p>
                  <p className="text-xs text-green-700">
                    {language === 'ru' 
                      ? 'Проверьте данные и при необходимости отредактируйте их вручную' 
                      : 'Review the data and edit manually if needed'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Generate */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-gray-900 mb-4">{t('taxWizard.previewPDF')}</h3>
              
              {/* PDF Preview Mock */}
              <div className="border-2 border-gray-300 rounded-xl bg-white p-8 min-h-[500px] shadow-inner">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="text-center border-b-2 border-gray-800 pb-6">
                    <h1 className="text-2xl text-gray-900 mb-2">
                      {selectedCountry === 'KZ' && 'Налоговая форма 910.00'}
                      {selectedCountry === 'RU' && 'Налоговая декларация УСН'}
                      {selectedCountry === 'GE' && 'Tax Form A'}
                      {selectedCountry === 'AM' && 'Tax Form 1'}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {language === 'ru' ? 'Период:' : 'Period:'} {selectedPeriod.toUpperCase()}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 mb-1">{language === 'ru' ? 'Общий доход' : 'Total Income'}</p>
                      <p className="text-2xl text-green-900">
                        ${reportData[reportData.length - 1].income.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-xs text-red-700 mb-1">{language === 'ru' ? 'Общие расходы' : 'Total Expenses'}</p>
                      <p className="text-2xl text-red-900">
                        ${reportData[reportData.length - 1].expenses.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Detailed breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-sm text-gray-900 border-b pb-2">
                      {language === 'ru' ? 'Детализация' : 'Breakdown'}
                    </h3>
                    {reportData.slice(0, -1).map((row, index) => (
                      row.income > 0 || row.expenses > 0 ? (
                        <div key={index} className="flex justify-between text-sm py-2 border-b border-gray-100">
                          <span className="text-gray-700">{row.category}</span>
                          <span className={row.income > 0 ? 'text-green-600' : 'text-red-600'}>
                            ${(row.income || row.expenses).toLocaleString()}
                          </span>
                        </div>
                      ) : null
                    ))}
                  </div>

                  {/* Tax calculation */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-blue-900">{language === 'ru' ? 'Налог к уплате' : 'Tax Payable'}:</span>
                      <span className="text-lg text-blue-900">
                        ${reportData[reportData.length - 1].taxes.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      {language === 'ru' ? 'Рассчитано автоматически' : 'Calculated automatically'}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-xs text-gray-500 pt-6 border-t">
                    <p>{language === 'ru' ? 'Сгенерировано ФинСплит' : 'Generated by FinSplit'}</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Warning if no data */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-900 mb-1">
                    {language === 'ru' ? 'Проверьте отчёт перед отправкой' : 'Review report before submission'}
                  </p>
                  <p className="text-xs text-amber-700">
                    {language === 'ru' 
                      ? 'Убедитесь, что все данные корректны. Вы можете вернуться назад для редактирования.' 
                      : 'Make sure all data is correct. You can go back to edit.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('taxWizard.back')}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep === 3 && (
                <>
                  <button
                    onClick={handleSaveDraft}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('taxWizard.saveAsDraft')}
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {t('taxes.downloadPDF')}
                  </button>
                  <button
                    onClick={handleSubmitToTax}
                    className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {t('taxWizard.sendToTax')}
                  </button>
                </>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('taxWizard.next')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t('taxWizard.finish')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
