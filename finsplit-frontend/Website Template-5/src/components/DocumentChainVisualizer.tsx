import { Check, AlertCircle, FileText, CreditCard, Receipt, Plane, Truck } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface ChainStep {
  name: string;
  nameEn: string;
  completed: boolean;
  type: 'document' | 'payment' | 'confirmation';
}

interface DocumentChain {
  id: string;
  type: string;
  typeEn: string;
  icon: any;
  steps: ChainStep[];
  requiresReceipt: boolean;
  color: string;
}

const mockChains: DocumentChain[] = [
  {
    id: 'b2b',
    type: 'B2B (внутренние переводы)',
    typeEn: 'B2B (Domestic)',
    icon: FileText,
    color: 'blue',
    requiresReceipt: false,
    steps: [
      { name: 'Счёт на оплату', nameEn: 'Invoice', completed: true, type: 'document' },
      { name: 'Платёжное поручение', nameEn: 'Payment Order', completed: true, type: 'payment' },
      { name: 'Акт выполненных работ', nameEn: 'Act of Completion', completed: false, type: 'confirmation' },
    ],
  },
  {
    id: 'b2c',
    type: 'B2C (онлайн-оплаты)',
    typeEn: 'B2C (Online Payments)',
    icon: CreditCard,
    color: 'purple',
    requiresReceipt: true,
    steps: [
      { name: 'Заказ', nameEn: 'Order', completed: true, type: 'document' },
      { name: 'Эквайринг', nameEn: 'Card Payment', completed: true, type: 'payment' },
      { name: 'Чек ОФД', nameEn: 'Fiscal Receipt', completed: true, type: 'confirmation' },
    ],
  },
  {
    id: 'freelance',
    type: 'Самозанятые / Фриланс',
    typeEn: 'Self-employed / Freelance',
    icon: Receipt,
    color: 'green',
    requiresReceipt: true,
    steps: [
      { name: 'Договор-оферта', nameEn: 'Agreement', completed: true, type: 'document' },
      { name: 'Перевод на счёт', nameEn: 'Bank Transfer', completed: true, type: 'payment' },
      { name: 'Чек "Мой налог"', nameEn: '"My Tax" Receipt', completed: false, type: 'confirmation' },
    ],
  },
  {
    id: 'ved',
    type: 'ВЭД (международные)',
    typeEn: 'Foreign Trade',
    icon: Plane,
    color: 'orange',
    requiresReceipt: false,
    steps: [
      { name: 'Invoice', nameEn: 'Invoice', completed: true, type: 'document' },
      { name: 'SWIFT MT103', nameEn: 'SWIFT Transfer', completed: true, type: 'payment' },
      { name: 'Credit Advice', nameEn: 'Credit Advice', completed: false, type: 'confirmation' },
    ],
  },
  {
    id: 'logistics',
    type: 'Агентские / Логистика',
    typeEn: 'Agency / Logistics',
    icon: Truck,
    color: 'indigo',
    requiresReceipt: false,
    steps: [
      { name: 'Договор', nameEn: 'Contract', completed: true, type: 'document' },
      { name: 'Безналичный перевод', nameEn: 'Wire Transfer', completed: true, type: 'payment' },
      { name: 'Транспортная накладная', nameEn: 'Waybill', completed: true, type: 'confirmation' },
    ],
  },
];

export function DocumentChainVisualizer() {
  const { language } = useLanguage();

  const getColorClasses = (color: string, variant: 'bg' | 'border' | 'text') => {
    const colors: Record<string, Record<typeof variant, string>> = {
      blue: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' },
      purple: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700' },
      green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
      orange: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700' },
      indigo: { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-700' },
    };
    return colors[color][variant];
  };

  const getCompletionRate = (steps: ChainStep[]) => {
    const completed = steps.filter(s => s.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-black mb-2">
              {language === 'ru' ? 'FinOrbit - Цепочки документов' : 'FinOrbit - Document Chains'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'ru' 
                ? 'Автоматическое отслеживание полноты документооборота по типам сделок. Система показывает какие шаги выполнены, а какие документы отсутствуют.'
                : 'Automatic tracking of document completeness by transaction type. The system shows which steps are completed and which documents are missing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Chains Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockChains.map((chain) => {
          const Icon = chain.icon;
          const completionRate = getCompletionRate(chain.steps);
          const isComplete = completionRate === 100;
          const missingSteps = chain.steps.filter(s => !s.completed).length;

          return (
            <div
              key={chain.id}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all p-5"
            >
              {/* Chain Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${getColorClasses(chain.color, 'bg')} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${getColorClasses(chain.color, 'text')}`} />
                  </div>
                  <div>
                    <h4 className="text-sm text-black">
                      {language === 'ru' ? chain.type : chain.typeEn}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {chain.requiresReceipt && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                          {language === 'ru' ? 'Нужен чек' : 'Receipt required'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg ${isComplete ? 'text-green-600' : 'text-gray-900'}`}>
                    {completionRate}%
                  </div>
                  {!isComplete && (
                    <div className="text-xs text-gray-500">
                      {missingSteps} {language === 'ru' ? 'шаг' : 'step'}{missingSteps > 1 ? (language === 'ru' ? 'а' : 's') : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${isComplete ? 'bg-green-600' : 'bg-blue-600'}`}
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Chain Steps */}
              <div className="space-y-2">
                {chain.steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-3">
                      {/* Step Indicator */}
                      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                        step.completed 
                          ? 'bg-green-100 border-2 border-green-600' 
                          : 'bg-gray-100 border-2 border-gray-300 border-dashed'
                      }`}>
                        {step.completed ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {language === 'ru' ? step.name : step.nameEn}
                          </span>
                          {!step.completed && (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                              {language === 'ru' ? 'Отсутствует' : 'Missing'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {step.type === 'document' && (language === 'ru' ? 'Документ-основание' : 'Source document')}
                          {step.type === 'payment' && (language === 'ru' ? 'Факт перевода' : 'Payment proof')}
                          {step.type === 'confirmation' && (language === 'ru' ? 'Подтверждение' : 'Confirmation')}
                        </div>
                      </div>

                      {/* Arrow (not for last step) */}
                      {index < chain.steps.length - 1 && (
                        <div className="text-gray-300">→</div>
                      )}
                    </div>

                    {/* Connecting Line */}
                    {index < chain.steps.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" style={{ height: '8px' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Action */}
              {!isComplete && (
                <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  {language === 'ru' ? 'Загрузить недостающие документы' : 'Upload missing documents'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-gray-700">
              {language === 'ru' ? 'Документ загружен' : 'Document uploaded'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 border-dashed flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-gray-700">
              {language === 'ru' ? 'Документ отсутствует' : 'Document missing'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded flex-shrink-0">
              {language === 'ru' ? 'Нужен чек' : 'Receipt required'}
            </span>
            <span className="text-gray-700 text-xs">
              {language === 'ru' ? 'Требуется фискальный чек' : 'Fiscal receipt required'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
