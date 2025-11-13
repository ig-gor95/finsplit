import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../utils/LanguageContext';
import { Check, X } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
  currentPlan?: string;
}

const getPlans = (language: 'en' | 'ru') => [
  {
    id: 'starter',
    name: language === 'ru' ? 'Starter' : 'Starter',
    price: 0,
    priceRub: 0,
    period: language === 'ru' ? 'навсегда' : 'forever',
    features: [
      { text: language === 'ru' ? '1 организация/компания' : '1 organization/company', included: true },
      { text: language === 'ru' ? '2 банковских счета' : '2 bank accounts', included: true },
      { text: language === 'ru' ? '100 транзакций/месяц' : '100 transactions/month', included: true },
      { text: language === 'ru' ? 'Ручная категоризация' : 'Manual categorization', included: true },
      { text: language === 'ru' ? 'Базовые отчёты' : 'Basic reports', included: true },
      { text: language === 'ru' ? 'Email поддержка' : 'Email support', included: true },
      { text: language === 'ru' ? 'AI-анализ транзакций' : 'AI transaction analysis', included: false },
      { text: language === 'ru' ? 'Налоговые отчёты' : 'Tax reports', included: false },
      { text: language === 'ru' ? 'Мультивалюта и FX' : 'Multi-currency & FX', included: false },
    ],
    recommended: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29,
    priceRub: 2900,
    period: language === 'ru' ? 'месяц' : 'month',
    features: [
      { text: language === 'ru' ? '3 организации/компании' : '3 organizations/companies', included: true },
      { text: language === 'ru' ? 'Неограниченно банковских счетов' : 'Unlimited bank accounts', included: true },
      { text: language === 'ru' ? 'Неограниченно транзакций' : 'Unlimited transactions', included: true },
      { text: language === 'ru' ? 'AI-категоризация и анализ' : 'AI categorization & analysis', included: true },
      { text: language === 'ru' ? 'Налоговые отчёты (KZ, RU, GE, AM)' : 'Tax reports (KZ, RU, GE, AM)', included: true },
      { text: language === 'ru' ? 'Мультивалютность и FX-риски' : 'Multi-currency & FX risks', included: true },
      { text: language === 'ru' ? 'Генерация документов (счета, акты)' : 'Document generation (invoices, acts)', included: true },
      { text: language === 'ru' ? 'Сопоставление транзакций' : 'Transaction matching', included: true },
      { text: language === 'ru' ? 'Приоритетная поддержка' : 'Priority support', included: true },
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 120,
    priceRub: 12000,
    period: language === 'ru' ? 'месяц' : 'month',
    features: [
      { text: language === 'ru' ? 'Неограниченно организаций' : 'Unlimited organizations', included: true },
      { text: language === 'ru' ? 'Неограниченно счетов и транзакций' : 'Unlimited accounts & transactions', included: true },
      { text: language === 'ru' ? 'Холдинговая структура и консолидация' : 'Holding structure & consolidation', included: true },
      { text: language === 'ru' ? 'Расширенная AI-аналитика и прогнозы' : 'Advanced AI analytics & forecasts', included: true },
      { text: language === 'ru' ? 'Налоговые отчёты (все страны + EU)' : 'Tax reports (all countries + EU)', included: true },
      { text: language === 'ru' ? 'API доступ и вебхуки' : 'API access & webhooks', included: true },
      { text: language === 'ru' ? 'Кастомные интеграции (1С, SAP)' : 'Custom integrations (1C, SAP)', included: true },
      { text: language === 'ru' ? 'White-label опции' : 'White-label options', included: true },
      { text: language === 'ru' ? 'Выделенный менеджер и SLA' : 'Dedicated manager & SLA', included: true },
    ],
    recommended: false,
  },
];

export function PricingModal({ onClose, currentPlan = 'starter' }: PricingModalProps) {
  const { language } = useLanguage();
  const plans = getPlans(language);
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    if (planId !== 'starter') {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful! Your plan has been upgraded.');
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  if (showPayment) {
    const plan = plans.find(p => p.id === selectedPlan);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-black">Payment Details</h2>
              <p className="text-sm text-gray-600 mt-1">Complete your subscription</p>
            </div>
            <button
              onClick={() => setShowPayment(false)}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Plan</span>
                <span className="text-sm text-gray-900">{plan?.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Billing</span>
                <span className="text-sm text-gray-900">Monthly</span>
              </div>
              <div className="border-t border-blue-200 mt-3 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Total</span>
                  <span className="text-2xl text-black">${plan?.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Form (Demo) */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={isProcessing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                This is a demo. No real payment will be processed.
              </p>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
            <button
              onClick={() => setShowPayment(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm"
              disabled={isProcessing}
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                `Pay $${plan?.price}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-black">{language === 'ru' ? 'Выберите тариф' : 'Choose Your Plan'}</h2>
            <p className="text-sm text-gray-600 mt-1">{language === 'ru' ? 'Выберите план, который подходит вашему бизнесу' : 'Select the plan that fits your business needs'}</p>
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 transition-all ${
                  plan.recommended
                    ? 'border-blue-600 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-600' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      {language === 'ru' ? 'Рекомендуем' : 'Recommended'}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl text-black mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1">
                    {plan.price !== null ? (
                      <>
                        <span className="text-4xl text-black">
                          {language === 'ru' ? `${plan.priceRub} ₽` : `$${plan.price}`}
                        </span>
                        <span className="text-gray-600 mb-1">/{plan.period}</span>
                      </>
                    ) : (
                      <span className="text-3xl text-black">{plan.priceLabel}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={currentPlan === plan.id}
                  className={`w-full py-3 rounded-xl transition-all text-sm font-medium ${
                    currentPlan === plan.id
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                      : plan.recommended
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] border-2 border-transparent'
                      : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {currentPlan === plan.id 
                    ? (language === 'ru' ? 'Текущий план' : 'Current Plan') 
                    : plan.id === 'starter' 
                      ? (language === 'ru' ? 'Понизить' : 'Downgrade') 
                      : (language === 'ru' ? 'Повысить' : 'Upgrade')}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="text-black mb-3">{language === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'}</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-900">{language === 'ru' ? 'Могу ли я изменить тариф позже?' : 'Can I change my plan later?'}</p>
                <p className="text-gray-600">{language === 'ru' ? 'Да, вы можете повысить или понизить тариф в любое время.' : 'Yes, you can upgrade or downgrade at any time.'}</p>
              </div>
              <div>
                <p className="text-gray-900">{language === 'ru' ? 'Есть ли бесплатный пробный период?' : 'Is there a free trial?'}</p>
                <p className="text-gray-600">{language === 'ru' ? 'Бесплатный план Starter доступен навсегда без указания банковской карты.' : 'The Free plan is available forever with no credit card required.'}</p>
              </div>
              <div>
                <p className="text-gray-900">{language === 'ru' ? 'Какие способы оплаты вы принимаете?' : 'What payment methods do you accept?'}</p>
                <p className="text-gray-600">{language === 'ru' ? 'Мы принимаем все основные банковские карты и банковские переводы.' : 'We accept all major credit cards and bank transfers.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}