import { Check, AlertCircle, FileText, CreditCard, Receipt, Plane, Truck } from 'lucide-react';

interface ChainStep {
  name: string;
  nameEn: string;
  completed: boolean;
}

interface TransactionType {
  type: string;
  typeEn: string;
  icon: any;
  color: string;
  steps: ChainStep[];
}

// Определение типа транзакции на основе её характеристик
export function getTransactionType(transaction: any): TransactionType {
  const { type, amount, description, counterparty, country } = transaction;
  
  // B2C - онлайн оплаты, эквайринг
  if (description?.toLowerCase().includes('эквайринг') || 
      description?.toLowerCase().includes('acquiring') ||
      description?.toLowerCase().includes('оплата картой')) {
    return {
      type: 'B2C',
      typeEn: 'B2C Online',
      icon: CreditCard,
      color: 'purple',
      steps: [
        { name: 'Заказ', nameEn: 'Order', completed: true },
        { name: 'Эквайринг', nameEn: 'Card Payment', completed: true },
        { name: 'Чек ОФД', nameEn: 'Fiscal Receipt', completed: false },
      ],
    };
  }
  
  // Самозанятые/Фриланс
  if (description?.toLowerCase().includes('фриланс') || 
      description?.toLowerCase().includes('самозанятый') ||
      counterparty?.name?.toLowerCase().includes('ип')) {
    return {
      type: 'Фриланс',
      typeEn: 'Freelance',
      icon: Receipt,
      color: 'green',
      steps: [
        { name: 'Договор-оферта', nameEn: 'Agreement', completed: true },
        { name: 'Перевод на счёт', nameEn: 'Transfer', completed: true },
        { name: 'Чек "Мой налог"', nameEn: '"My Tax" Receipt', completed: Math.random() > 0.5 },
      ],
    };
  }
  
  // ВЭД - международные переводы
  if (description?.toLowerCase().includes('swift') || 
      description?.toLowerCase().includes('международ') ||
      description?.toLowerCase().includes('international') ||
      (country && country !== 'Kazakhstan' && country !== 'Russia')) {
    return {
      type: 'ВЭД',
      typeEn: 'Foreign Trade',
      icon: Plane,
      color: 'orange',
      steps: [
        { name: 'Invoice', nameEn: 'Invoice', completed: true },
        { name: 'SWIFT MT103', nameEn: 'SWIFT Transfer', completed: true },
        { name: 'Credit Advice', nameEn: 'Credit Advice', completed: Math.random() > 0.3 },
      ],
    };
  }
  
  // Логистика
  if (description?.toLowerCase().includes('логист') || 
      description?.toLowerCase().includes('доставка') ||
      description?.toLowerCase().includes('транспорт')) {
    return {
      type: 'Логистика',
      typeEn: 'Logistics',
      icon: Truck,
      color: 'indigo',
      steps: [
        { name: 'Договор', nameEn: 'Contract', completed: true },
        { name: 'Перевод', nameEn: 'Transfer', completed: true },
        { name: 'Накладная', nameEn: 'Waybill', completed: true },
      ],
    };
  }
  
  // B2B по умолчанию (внутренние переводы)
  return {
    type: 'B2B',
    typeEn: 'B2B',
    icon: FileText,
    color: 'blue',
    steps: [
      { name: 'Счёт', nameEn: 'Invoice', completed: true },
      { name: 'Платёжка', nameEn: 'Payment', completed: true },
      { name: 'Акт', nameEn: 'Act', completed: Math.random() > 0.4 },
    ],
  };
}

interface TransactionDocumentChainProps {
  transaction: any;
  language: 'en' | 'ru';
  compact?: boolean;
}

export function TransactionDocumentChain({ transaction, language, compact = false }: TransactionDocumentChainProps) {
  const chainType = getTransactionType(transaction);
  const Icon = chainType.icon;
  const completionRate = Math.round(
    (chainType.steps.filter(s => s.completed).length / chainType.steps.length) * 100
  );
  const isComplete = completionRate === 100;

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; badge: string; progress: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', progress: 'bg-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', progress: 'bg-purple-600' },
      green: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700', progress: 'bg-green-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700', progress: 'bg-orange-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', progress: 'bg-indigo-600' },
    };
    return colors[color] || colors.blue;
  };

  const colors = getColorClasses(chainType.color);

  if (compact) {
    // Компактный вид - только бейдж с процентом
    return (
      <div className="flex items-center gap-2">
        <div className={`px-2 py-1 rounded text-xs ${colors.badge}`}>
          {language === 'ru' ? chainType.type : chainType.typeEn}
        </div>
        <div className="flex items-center gap-1">
          {chainType.steps.map((step, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}
              title={language === 'ru' ? step.name : step.nameEn}
            />
          ))}
        </div>
      </div>
    );
  }

  // Полный вид
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${colors.text}`} />
          </div>
          <div>
            <div className="text-sm text-gray-900">
              {language === 'ru' ? chainType.type : chainType.typeEn}
            </div>
            <div className="text-xs text-gray-500">
              {language === 'ru' ? 'Цепочка документов' : 'Document chain'}
            </div>
          </div>
        </div>
        <div className={`text-lg ${isComplete ? 'text-green-600' : 'text-gray-900'}`}>
          {completionRate}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${isComplete ? 'bg-green-600' : colors.progress}`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Chain Steps */}
      <div className="space-y-2">
        {chainType.steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.completed 
                ? 'bg-green-100 border border-green-500' 
                : 'bg-gray-100 border border-gray-300 border-dashed'
            }`}>
              {step.completed ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <AlertCircle className="w-3 h-3 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                {language === 'ru' ? step.name : step.nameEn}
              </span>
              {!step.completed && (
                <span className="ml-2 text-xs text-amber-600">
                  {language === 'ru' ? 'Отсутствует' : 'Missing'}
                </span>
              )}
            </div>
            {index < chainType.steps.length - 1 && (
              <span className="text-gray-300">→</span>
            )}
          </div>
        ))}
      </div>

      {!isComplete && (
        <button className="mt-3 w-full py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
          {language === 'ru' ? 'Загрузить документы' : 'Upload documents'}
        </button>
      )}
    </div>
  );
}