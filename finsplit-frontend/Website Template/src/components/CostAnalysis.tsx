import { useState } from 'react';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts';
import { useLanguage } from '../utils/LanguageContext';
import { useOrganization } from '../utils/OrganizationContext';
import { CustomSelect } from './CustomSelect';
import { InfoTooltip } from './InfoTooltip';
import { OrganizationSelector } from './OrganizationSelector';
import { toast } from 'sonner';
import {
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  CreditCard,
  FileText,
  Zap,
  TrendingUp,
  ArrowDownRight,
  Target,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Filter,
  Eye,
  BarChart3,
} from 'lucide-react';

// Данные по типам потерь
const costsByType = [
  { type: 'Taxes', typeRu: 'Налоги', amount: 337000, percentage: 48, color: '#ef4444', icon: FileText },
  { type: 'Bank Fees', typeRu: 'Банковские комиссии', amount: 125000, percentage: 18, color: '#f59e0b', icon: Building2 },
  { type: 'FX Loss', typeRu: 'Курсовые потери', amount: 98000, percentage: 14, color: '#8b5cf6', icon: TrendingDown },
  { type: 'Payment Fees', typeRu: 'Платёжные комиссии', amount: 82000, percentage: 12, color: '#3b82f6', icon: CreditCard },
  { type: 'Penalties', typeRu: 'Штрафы и пени', amount: 35000, percentage: 5, color: '#dc2626', icon: AlertTriangle },
  { type: 'Other', typeRu: 'Прочие потери', amount: 23000, percentage: 3, color: '#6b7280', icon: ArrowDownRight },
];

// Детализация по налогам
const taxesBreakdown = [
  { country: 'KZ', flag: '🇰🇿', type: 'CIT', amount: 152000, rate: 20, base: 760000 },
  { country: 'RU', flag: '🇷🇺', type: 'USN', amount: 118000, rate: 6, base: 1966667 },
  { country: 'GE', flag: '🇬🇪', type: 'Income Tax', amount: 42000, rate: 20, base: 210000 },
  { country: 'AM', flag: '🇦🇲', type: 'Turnover Tax', amount: 25000, rate: 5, base: 500000 },
];

// Детализация по комиссиям
const feesBreakdown = [
  { 
    category: 'International transfers', 
    categoryRu: 'Международные переводы',
    count: 24, 
    totalAmount: 85000, 
    avgFee: 3542, 
    feeRate: 1.8,
    provider: 'SWIFT',
  },
  { 
    category: 'Currency conversion', 
    categoryRu: 'Конвертация валюты',
    count: 18, 
    totalAmount: 52000, 
    avgFee: 2889, 
    feeRate: 1.2,
    provider: 'Banks',
  },
  { 
    category: 'Card payments', 
    categoryRu: 'Карточные платежи',
    count: 156, 
    totalAmount: 38000, 
    avgFee: 244, 
    feeRate: 2.5,
    provider: 'Stripe/Payoneer',
  },
  { 
    category: 'Account maintenance', 
    categoryRu: 'Обслуживание счетов',
    count: 7, 
    totalAmount: 32000, 
    avgFee: 4571, 
    feeRate: 0,
    provider: 'Multiple banks',
  },
];

// Динамика потерь по месяцам
const lossesOverTime = [
  { month: 'Jun', taxes: 52000, fees: 28000, fxLoss: 12000, penalties: 0, total: 92000 },
  { month: 'Jul', taxes: 58000, fees: 31000, fxLoss: 15000, penalties: 5000, total: 109000 },
  { month: 'Aug', taxes: 62000, fees: 29000, fxLoss: 18000, penalties: 8000, total: 117000 },
  { month: 'Sep', taxes: 68000, fees: 33000, fxLoss: 22000, penalties: 12000, total: 135000 },
  { month: 'Oct', taxes: 72000, fees: 35000, fxLoss: 25000, penalties: 10000, total: 142000 },
  { month: 'Nov', taxes: 75000, fees: 37000, fxLoss: 28000, penalties: 0, total: 140000 },
];

// Курсовые потери по валютам
const fxLossesByCurrency = [
  { currency: 'USD', flag: '🇺🇸', openingRate: 445, currentRate: 450, exposure: 25000, loss: 28090, lossPercent: 1.1 },
  { currency: 'EUR', flag: '🇪🇺', openingRate: 515, currentRate: 520, exposure: 8200, loss: 7975, lossPercent: 1.0 },
  { currency: 'RUB', flag: '🇷🇺', openingRate: 5.4, currentRate: 5.2, exposure: 850000, loss: -32500, lossPercent: -3.8 },
  { currency: 'GEL', flag: '🇬🇪', openingRate: 165, currentRate: 168, exposure: 15000, loss: 27273, lossPercent: 1.8 },
];

// Штрафы и пени
const penalties = [
  { 
    id: 1,
    date: '2025-09-15',
    type: 'Late payment',
    typeRu: 'Просрочка платежа',
    country: 'KZ',
    flag: '🇰🇿',
    amount: 12000,
    reason: 'Form 240.00 filed 2 days late',
    reasonRu: 'Форма 240.00 подана с опозданием на 2 дня',
    status: 'paid',
  },
  { 
    id: 2,
    date: '2025-08-22',
    type: 'Incorrect declaration',
    typeRu: 'Ошибка в декларации',
    country: 'RU',
    flag: '🇷🇺',
    amount: 8000,
    reason: 'Calculation error in USN Q2',
    reasonRu: 'Ошибка расчёта в УСН за Q2',
    status: 'paid',
  },
  { 
    id: 3,
    date: '2025-07-10',
    type: 'Currency control',
    typeRu: 'Валютный контроль',
    country: 'KZ',
    flag: '🇰🇿',
    amount: 5000,
    reason: 'Missing payment purpose code',
    reasonRu: 'Отсутствие кода назначения платежа',
    status: 'paid',
  },
  { 
    id: 4,
    date: '2025-09-28',
    type: 'Late payment',
    typeRu: 'Просрочка платежа',
    country: 'GE',
    flag: '🇬🇪',
    amount: 10000,
    reason: 'VAT payment 5 days late',
    reasonRu: 'Платёж НДС с опозданием на 5 дней',
    status: 'paid',
  },
];

// Рекомендации по оптимизации
const optimizationTips = [
  {
    id: 1,
    category: 'fees',
    priority: 'high',
    title: 'Switch to direct bank transfers',
    titleRu: 'Переход на прямые банковские переводы',
    description: 'Use local accounts instead of SWIFT for regional transfers to save up to 65% on fees',
    descriptionRu: 'Используйте локальные счета вместо SWIFT для региональных переводов - экономия до 65%',
    savings: '55,250 ₸/month',
    savingsRu: '55 250 ₸/мес',
    icon: Building2,
  },
  {
    id: 2,
    category: 'fx',
    priority: 'medium',
    title: 'Hedge USD exposure',
    titleRu: 'Хеджирование USD позиции',
    description: 'Lock in current exchange rates for predictable expenses to avoid FX volatility',
    descriptionRu: 'Зафиксируйте текущие курсы для прогнозируемых расходов, чтобы избежать волатильности',
    savings: '15,000 ₸/month',
    savingsRu: '15 000 ₸/мес',
    icon: TrendingUp,
  },
  {
    id: 3,
    category: 'taxes',
    priority: 'high',
    title: 'Optimize tax structure',
    titleRu: 'Оптимизация налоговой структуры',
    description: 'Consider consolidating operations in KZ to benefit from lower corporate tax rates',
    descriptionRu: 'Рассмотрите консолидацию операций в КZ для использования более низких ставок',
    savings: '42,000 ₸/month',
    savingsRu: '42 000 ₸/мес',
    icon: FileText,
  },
  {
    id: 4,
    category: 'penalties',
    priority: 'urgent',
    title: 'Automate compliance calendar',
    titleRu: 'Автоматизация календаря отчётности',
    description: 'Set up automatic reminders 7 days before deadlines to avoid late payment penalties',
    descriptionRu: 'Настройте автоматические напоминания за 7 дней до дедлайнов, чтобы избежать штрафов',
    savings: '35,000 ₸/year',
    savingsRu: '35 000 ₸/год',
    icon: Calendar,
  },
];

interface CostAnalysisProps {
  displayCurrency?: string;
  periodFilter?: string;
  onNavigate?: (section: string) => void;
  primaryCurrency?: string;
}

export function CostAnalysis({ 
  displayCurrency = 'USD',
  periodFilter = 'last6months',
  onNavigate,
  primaryCurrency = 'USD',
}: CostAnalysisProps) {
  const { language } = useLanguage();
  const { getEntityMultiplier } = useOrganization();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedCostType, setSelectedCostType] = useState<string | null>(null);
  const [showOptimization, setShowOptimization] = useState(false);

  // Get multiplier for scaling data based on selected organization
  const multiplier = getEntityMultiplier();

  // Exchange rates (base: primary currency)
  const exchangeRates: Record<string, Record<string, number>> = {
    'USD': { 'USD': 1, 'EUR': 0.92, 'KZT': 480, 'RUB': 92 },
    'EUR': { 'USD': 1.09, 'EUR': 1, 'KZT': 522, 'RUB': 100 },
    'KZT': { 'USD': 0.0021, 'EUR': 0.0019, 'KZT': 1, 'RUB': 0.19 },
    'RUB': { 'USD': 0.011, 'EUR': 0.010, 'KZT': 5.2, 'RUB': 1 },
  };

  const convertToPrimaryCurrency = (amount: number, fromCurrency: string): number => {
    const rate = exchangeRates[fromCurrency]?.[primaryCurrency] || 1;
    return amount * rate * multiplier;
  };

  const totalLosses = costsByType.reduce((sum, item) => sum + convertToPrimaryCurrency(item.amount, 'KZT'), 0);
  const monthlyAvgLosses = totalLosses / 6; // За 6 месяцев

  const formatCurrency = (amount: number, currency: string = primaryCurrency) => {
    if (isNaN(amount) || !isFinite(amount)) {
      return `0 ${currency}`;
    }
    return `${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currency}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return { bg: 'bg-red-100', text: 'text-red-600', badge: 'bg-red-100 text-red-700' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' };
      case 'medium': return { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">{language === 'ru' ? 'Оплачено' : 'Paid'}</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs">{language === 'ru' ? 'Ожидает' : 'Pending'}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Selector */}
      <OrganizationSelector compact={true} />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <InfoTooltip text={language === 'ru' ? 'Сумма всех финансовых потерь: налоги, комиссии, курсовые разницы и штрафы за выбранный период' : 'Total of all financial losses: taxes, fees, FX losses and penalties for selected period'} />
          </div>
          <p className="text-xs text-red-700 mb-1">
            {language === 'ru' ? 'Общие потери' : 'Total Losses'}
          </p>
          <p className="text-2xl text-red-900 mb-2">
            {formatCurrency(totalLosses)}
          </p>
          <p className="text-xs text-red-600">
            {formatCurrency(monthlyAvgLosses)} {language === 'ru' ? 'в месяц' : 'per month'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <InfoTooltip text={language === 'ru' ? 'Уплач��нные налоги по всем юрисдикциям: КZ (CIT 20%), RU (УСН 6%), GE (20%), AM (5%)' : 'Taxes paid across all jurisdictions: KZ (CIT 20%), RU (USN 6%), GE (20%), AM (5%)'} />
          </div>
          <p className="text-xs text-orange-700 mb-1">
            {language === 'ru' ? 'Налоги' : 'Taxes'}
          </p>
          <p className="text-2xl text-orange-900 mb-2">
            {formatCurrency(convertToPrimaryCurrency(337000, 'KZT'))}
          </p>
          <p className="text-xs text-orange-600">
            48% {language === 'ru' ? 'от всех потерь' : 'of total losses'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <InfoTooltip text={language === 'ru' ? 'Банковские комиссии (обслуживание счетов) и платёжные комиссии (SWIFT, конвертация, карты)' : 'Bank fees (account maintenance) and payment fees (SWIFT, conversion, cards)'} />
          </div>
          <p className="text-xs text-purple-700 mb-1">
            {language === 'ru' ? 'Комиссии' : 'Fees'}
          </p>
          <p className="text-2xl text-purple-900 mb-2">
            {formatCurrency(convertToPrimaryCurrency(207000, 'KZT'))}
          </p>
          <p className="text-xs text-purple-600">
            30% {language === 'ru' ? 'от всех потерь' : 'of total losses'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <InfoTooltip text={language === 'ru' ? 'Ожидаемая экономия при применении рекомендаций: оптимизация комиссий, налоговой структуры и хеджирование валютных рисков' : 'Expected savings from recommendations: fee optimization, tax structure improvements and FX hedging'} />
          </div>
          <p className="text-xs text-blue-700 mb-1">
            {language === 'ru' ? 'Потенциал экономии' : 'Savings Potential'}
          </p>
          <p className="text-2xl text-blue-900 mb-2">
            {formatCurrency(convertToPrimaryCurrency(112250, 'KZT'))}
          </p>
          <p className="text-xs text-blue-600">
            16% {language === 'ru' ? 'снижение потерь' : 'reduction'}
          </p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Losses Distribution - Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              {language === 'ru' ? 'Структура потерь' : 'Loss Distribution'}
            </h3>
            <button
              onClick={() => setShowOptimization(!showOptimization)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              {language === 'ru' ? 'Оптимизация' : 'Optimize'}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={costsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {costsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${formatCurrency(value)} ₸`} />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {costsByType.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.type} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedCostType(item.type)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{language === 'ru' ? item.typeRu : item.type}</span>
                  </div>
                  <span className="text-sm text-gray-900">{item.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Losses Over Time */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              {language === 'ru' ? 'Динамика потерь' : 'Losses Over Time'}
            </h3>
            <button
              onClick={() => toast.success(language === 'ru' ? 'Экспорт в Excel...' : 'Exporting to Excel...')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              {language === 'ru' ? 'Экспорт' : 'Export'}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lossesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => `${formatCurrency(value)} ₸`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="taxes" 
                stackId="1"
                stroke="#ef4444" 
                fill="#fee2e2"
                name={language === 'ru' ? 'Налоги' : 'Taxes'}
              />
              <Area 
                type="monotone" 
                dataKey="fees" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#fef3c7"
                name={language === 'ru' ? 'Комиссии' : 'Fees'}
              />
              <Area 
                type="monotone" 
                dataKey="fxLoss" 
                stackId="1"
                stroke="#8b5cf6" 
                fill="#ede9fe"
                name={language === 'ru' ? 'Курс. разницы' : 'FX Loss'}
              />
              <Area 
                type="monotone" 
                dataKey="penalties" 
                stackId="1"
                stroke="#dc2626" 
                fill="#fecaca"
                name={language === 'ru' ? 'Штрафы' : 'Penalties'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taxes Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              {language === 'ru' ? 'Детализация налогов' : 'Tax Breakdown'}
              <InfoTooltip text={language === 'ru' ? 'Разбивка уплаченных налогов по странам и типам. Показывает налоговую базу, ставку и итоговую сумму.' : 'Breakdown of taxes paid by country and type. Shows tax base, rate and total amount.'} />
            </h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm">
              {formatCurrency(convertToPrimaryCurrency(337000, 'KZT'))}
            </span>
          </div>
          <div className="space-y-3">
            {taxesBreakdown.map((tax) => (
              <div key={`${tax.country}-${tax.type}`} className="p-4 bg-gradient-to-r from-red-50 to-transparent rounded-xl border border-red-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">
                      {tax.flag} {tax.country} — {tax.type}
                    </p>
                    <p className="text-xs text-gray-600">
                      {language === 'ru' ? 'База:' : 'Base:'} {formatCurrency(convertToPrimaryCurrency(tax.base, 'KZT'))} × {tax.rate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-red-900">{formatCurrency(convertToPrimaryCurrency(tax.amount, 'KZT'))}</p>
                    <p className="text-xs text-red-600">{((tax.amount / 337000) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                    style={{ width: `${(tax.amount / 337000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fees Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              {language === 'ru' ? 'Детализация комиссий' : 'Fees Breakdown'}
              <InfoTooltip text={language === 'ru' ? 'Разбивка комиссий по типам операций: международные переводы (SWIFT), конвертация валюты, карточные платежи и обслуживание счетов' : 'Breakdown of fees by operation type: international transfers (SWIFT), currency conversion, card payments and account maintenance'} />
            </h3>
            <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm">
              {formatCurrency(convertToPrimaryCurrency(207000, 'KZT'))}
            </span>
          </div>
          <div className="space-y-3">
            {feesBreakdown.map((fee) => (
              <div key={fee.category} className="p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border border-orange-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">
                      {language === 'ru' ? fee.categoryRu : fee.category}
                    </p>
                    <p className="text-xs text-gray-600">
                      {fee.count} {language === 'ru' ? 'операций' : 'operations'} • {language === 'ru' ? 'Ср:' : 'Avg:'} {formatCurrency(convertToPrimaryCurrency(fee.avgFee, 'KZT'))}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {fee.provider} {fee.feeRate > 0 && `• ${fee.feeRate}%`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-orange-900">{formatCurrency(convertToPrimaryCurrency(fee.totalAmount, 'KZT'))}</p>
                    <p className="text-xs text-orange-600">{((fee.totalAmount / 207000) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                    style={{ width: `${(fee.totalAmount / 207000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FX Losses by Currency */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-purple-600" />
            {language === 'ru' ? 'Курсовые потери по валютам' : 'FX Losses by Currency'}
            <InfoTooltip text={language === 'ru' ? 'Потери/прибыль от изменения курсов валют. Показывает разницу между курсом открытия позиции и текущим курсом для каждой валю��ы.' : 'Losses/gains from currency rate changes. Shows the difference between opening rate and current rate for each currency.'} />
          </h3>
          <button
            onClick={() => onNavigate?.('currency')}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {language === 'ru' ? 'FX контроль' : 'FX Control'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fxLossesByCurrency.map((fx) => (
            <div 
              key={fx.currency}
              className={`p-4 rounded-xl border-2 ${
                fx.loss > 0 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{fx.flag}</span>
                <span className={`px-2 py-1 rounded-md text-xs ${
                  fx.loss > 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {fx.lossPercent > 0 ? '+' : ''}{fx.lossPercent}%
                </span>
              </div>
              <p className="text-sm text-gray-900 mb-1">{fx.currency}</p>
              <p className="text-xs text-gray-600 mb-2">
                {language === 'ru' ? 'Позиция:' : 'Exposure:'} {fx.exposure.toLocaleString()}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{fx.openingRate} → {fx.currentRate}</span>
              </div>
              <p className={`text-lg ${fx.loss > 0 ? 'text-red-900' : 'text-green-900'}`}>
                {fx.loss > 0 ? '-' : '+'}{formatCurrency(convertToPrimaryCurrency(Math.abs(fx.loss), 'KZT'))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Penalties & Fines */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            {language === 'ru' ? 'Штрафы и пени' : 'Penalties & Fines'}
            <InfoTooltip text={language === 'ru' ? 'Штрафы за просрочку налоговых платежей, ошибки в декларациях и нарушения валютного контроля' : 'Penalties for late tax payments, declaration errors and currency control violations'} />
          </h3>
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm">
            {formatCurrency(convertToPrimaryCurrency(35000, 'KZT'))}
          </span>
        </div>
        <div className="space-y-3">
          {penalties.map((penalty) => (
            <div 
              key={penalty.id}
              className="p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{penalty.flag}</span>
                    <p className="text-sm text-gray-900">
                      {language === 'ru' ? penalty.typeRu : penalty.type}
                    </p>
                    {getStatusBadge(penalty.status)}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {language === 'ru' ? penalty.reasonRu : penalty.reason}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(penalty.date).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl text-red-900">{formatCurrency(convertToPrimaryCurrency(penalty.amount, 'KZT'))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Recommendations */}
      {showOptimization && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">
                {language === 'ru' ? 'Рекомендации по оптимизации' : 'Optimization Recommendations'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'ru' 
                  ? `Потенциальная экономия: ${formatCurrency(convertToPrimaryCurrency(112250, 'KZT'))}/месяц (16% снижение потерь)` 
                  : `Potential savings: ${formatCurrency(convertToPrimaryCurrency(112250, 'KZT'))}/month (16% reduction)`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizationTips.map((tip) => {
              const Icon = tip.icon;
              const priorityColors = getPriorityColor(tip.priority);
              return (
                <div 
                  key={tip.id}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 ${priorityColors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${priorityColors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">
                          {language === 'ru' ? tip.titleRu : tip.title}
                        </p>
                        <span className={`px-2 py-0.5 ${priorityColors.badge} text-xs rounded-md whitespace-nowrap ml-2`}>
                          {tip.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        {language === 'ru' ? tip.descriptionRu : tip.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-600">
                          {language === 'ru' ? tip.savingsRu : tip.savings}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
