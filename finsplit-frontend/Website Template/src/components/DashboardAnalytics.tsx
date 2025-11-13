import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useLanguage } from '../utils/LanguageContext';
import { CustomSelect } from './CustomSelect';
import { InfoTooltip } from './InfoTooltip';
import { toast } from 'sonner';
import {
  TrendingUp,
  PieChart,
  Globe,
  Building2,
  ChevronRight,
  DollarSign,
  BarChart3,
  RefreshCw,
  Calendar,
} from 'lucide-react';

// Cash flow data for charts
const cashFlowData = [
  { month: 'Jul', income: 8500, expenses: 7200, forecast: false },
  { month: 'Aug', income: 9200, expenses: 7800, forecast: false },
  { month: 'Sep', income: 10100, expenses: 8100, forecast: false },
  { month: 'Oct', income: 10700, expenses: 8450, forecast: false },
  { month: 'Nov', income: 11200, expenses: 8800, forecast: true },
  { month: 'Dec', income: 12500, expenses: 9200, forecast: true },
];

// Balance by currency
const balanceByCurrency = [
  { currency: 'KZT', balance: 2500000, color: '#3b82f6' },
  { currency: 'USD', balance: 12500, color: '#8b5cf6' },
  { currency: 'EUR', balance: 3200, color: '#10b981' },
  { currency: 'RUB', balance: 450000, color: '#f59e0b' },
];

// Top categories data
const topExpenseCategories = [
  { name: 'Salaries', value: 320000, percentage: 42 },
  { name: 'Rent', value: 250000, percentage: 33 },
  { name: 'IT Services', value: 95000, percentage: 12 },
  { name: 'Marketing', value: 75000, percentage: 10 },
  { name: 'Utilities', value: 22000, percentage: 3 },
];

const topIncomeCategories = [
  { name: 'Consulting', value: 6500, percentage: 61 },
  { name: 'Development', value: 2500, percentage: 23 },
  { name: 'Design', value: 1200, percentage: 11 },
  { name: 'Support', value: 500, percentage: 5 },
];

// Bank connections data
const bankConnections = [
  { id: 1, name: 'Halyk Bank (KZ)', status: 'connected', lastSync: '2 min ago', accounts: 2, logo: '🏦' },
  { id: 2, name: 'Sberbank (RU)', status: 'connected', lastSync: '5 min ago', accounts: 1, logo: '🏦' },
  { id: 3, name: 'TBC Bank (GE)', status: 'connected', lastSync: '1 hour ago', accounts: 1, logo: '🏦' },
  { id: 4, name: 'HSBC (EU)', status: 'disconnected', lastSync: '2 days ago', accounts: 1, logo: '🏦' },
];

// Liquidity forecast data
const liquidityForecast = [
  { date: 'Nov 1', balance: 2800000, min: 2600000, max: 3000000 },
  { date: 'Nov 8', balance: 2950000, min: 2750000, max: 3150000 },
  { date: 'Nov 15', balance: 3100000, min: 2900000, max: 3300000 },
  { date: 'Nov 22', balance: 3250000, min: 3050000, max: 3450000 },
  { date: 'Nov 29', balance: 3400000, min: 3200000, max: 3600000 },
];

// Business metrics
const businessMetrics = {
  activeAccounts: 7,
  totalTransactions: 1247,
  avgMonthlyIncome: 10450,
  countries: ['KZ', 'RU', 'GE', 'AM'],
};



interface DashboardAnalyticsProps {
  onNavigate?: (section: string) => void;
  onFilterCategory?: (category: string) => void;
  onFilterCurrency?: (currency: string) => void;
  displayCurrency?: string;
  periodFilter?: string;
}

export function DashboardAnalytics({ 
  onNavigate, 
  onFilterCategory, 
  onFilterCurrency,
  displayCurrency = 'USD',
  periodFilter = 'last30days'
}: DashboardAnalyticsProps) {
  const { language, t } = useLanguage();
  const totalBalanceKZT = 2500000 + 12500 * 480 + 3200 * 520 + 450000;
  const [cashFlowPeriod, setCashFlowPeriod] = useState('month');
  const [showExpenses, setShowExpenses] = useState(true);

  // Exchange rates (все в KZT как база)
  const currencyRates: Record<string, number> = {
    'KZT': 1,
    'USD': 480,
    'EUR': 520,
    'RUB': 5.2,
  };

  // Конвертация из KZT в выбранную валюту отображения
  const convertFromKZT = (amountKZT: number): number => {
    return amountKZT / currencyRates[displayCurrency];
  };

  // Конвертация любой валюты в валюту отображения
  const convertToDisplayCurrency = (amount: number, fromCurrency: string): number => {
    const amountInKZT = amount * currencyRates[fromCurrency];
    return amountInKZT / currencyRates[displayCurrency];
  };

  // Форматирование валюты
  const formatDisplayAmount = (amount: number): string => {
    const converted = amount;
    if (displayCurrency === 'KZT' || displayCurrency === 'RUB') {
      return `${Math.round(converted).toLocaleString()}`;
    }
    return `${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Конвертированные данные для графиков
  const convertedCashFlowData = cashFlowData.map(item => ({
    ...item,
    income: convertToDisplayCurrency(item.income, 'USD'),
    expenses: convertToDisplayCurrency(item.expenses, 'USD'),
  }));

  const convertedBalanceByCurrency = balanceByCurrency.map(item => ({
    ...item,
    balance: convertToDisplayCurrency(item.balance, item.currency),
  }));

  const convertedTopExpenseCategories = topExpenseCategories.map(cat => ({
    ...cat,
    value: convertToDisplayCurrency(cat.value, 'KZT'),
  }));

  const convertedTopIncomeCategories = topIncomeCategories.map(cat => ({
    ...cat,
    value: convertToDisplayCurrency(cat.value, 'KZT'),
  }));

  // Конвертированные данные для Liquidity Forecast
  const convertedLiquidityForecast = liquidityForecast.map(item => ({
    ...item,
    balance: convertToDisplayCurrency(item.balance, 'KZT'),
    min: convertToDisplayCurrency(item.min, 'KZT'),
    max: convertToDisplayCurrency(item.max, 'KZT'),
  }));

  // Конв��ртированный avgMonthlyIncome для Business Metrics
  const convertedAvgMonthlyIncome = convertToDisplayCurrency(businessMetrics.avgMonthlyIncome, 'USD');

  return (
    <>
      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                {t('analytics.cashflow')}
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
                  {displayCurrency}
                </span>
                <InfoTooltip text={t('chart.cashflow.info')} />
              </h3>
              <p className="text-xs text-gray-500 mt-1">{t('analytics.cashflowSubtitle')}</p>
            </div>
            <CustomSelect
              value={cashFlowPeriod}
              onChange={(value) => setCashFlowPeriod(value)}
              options={[
                { value: 'month', label: t('analytics.month') },
                { value: 'quarter', label: t('analytics.quarter') },
                { value: 'year', label: t('analytics.year') },
              ]}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={convertedCashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatDisplayAmount(value)} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => `${displayCurrency} ${formatDisplayAmount(value)}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                fill="#d1fae5" 
                name={t('analytics.income')}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                fill="#fee2e2" 
                name={t('analytics.expenses')}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-700">{t('analytics.income')}</p>
              <p className="text-xl text-green-900">{displayCurrency} {formatDisplayAmount(convertToDisplayCurrency(10700, 'USD'))}</p>
              <p className="text-xs text-green-600">+18.2% {t('analytics.vsLastMonth')}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-red-700">{t('analytics.expenses')}</p>
              <p className="text-xl text-red-900">{displayCurrency} {formatDisplayAmount(convertToDisplayCurrency(8450, 'USD'))}</p>
              <p className="text-xs text-red-600">+5.1% {t('analytics.vsLastMonth')}</p>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              {t('analytics.topCategories')}
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
                {displayCurrency}
              </span>
              <InfoTooltip text={t('chart.categories.info')} />
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowExpenses(true)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showExpenses ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                {t('analytics.topExpenses')}
              </button>
              <button 
                onClick={() => setShowExpenses(false)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  !showExpenses ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                {t('analytics.topIncome')}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {(showExpenses ? convertedTopExpenseCategories : convertedTopIncomeCategories).map((cat, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer"
                onClick={() => {
                  if (onFilterCategory) {
                    onFilterCategory(cat.name);
                    onNavigate?.('transactions');
                  }
                  toast.success(language === 'ru' 
                    ? `Фильтр по категории: ${cat.name}` 
                    : `Filter by category: ${cat.name}`
                  );
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    {cat.name}
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {displayCurrency} {formatDisplayAmount(cat.value)}
                  </span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all group-hover:from-blue-600 group-hover:to-purple-600 group-hover:shadow-lg"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors">{cat.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balance Distribution & Bank Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance by Currency */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-blue-600" />
            {t('analytics.balanceByCurrency')}
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
              {displayCurrency}
            </span>
            <InfoTooltip text={t('chart.balance.info')} />
          </h3>
          <div className="space-y-4">
            {convertedBalanceByCurrency.map((item, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border hover:border-blue-200 transition-all cursor-pointer"
                onClick={() => {
                  if (onFilterCurrency) {
                    onFilterCurrency(item.currency);
                    onNavigate?.('accounts');
                  }
                  toast.info(language === 'ru' 
                    ? `Показ счетов в ${item.currency}` 
                    : `Showing ${item.currency} accounts`
                  );
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: item.color + '20' }}>
                    <DollarSign className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                      {item.currency}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                      {((item.balance / totalBalanceKZT) * 100).toFixed(1)}% {language === 'ru' ? 'от общего' : 'of total'}
                    </p>
                  </div>
                </div>
                <p className="text-lg text-gray-900">
                  {displayCurrency} {formatDisplayAmount(item.balance)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Connections */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              {t('analytics.bankConnections')}
              <InfoTooltip text={t('chart.bankConnections.info')} />
            </h3>
            <button 
              onClick={() => {
                onNavigate?.('accounts');
                toast.info(language === 'ru' ? 'Переход к управлению подключениями' : 'Navigate to connections management');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all hover:gap-2"
            >
              {t('analytics.viewDetails')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {bankConnections.map((bank) => (
              <div 
                key={bank.id} 
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
                onClick={() => {
                  if (bank.status === 'disconnected') {
                    toast.warning(language === 'ru' 
                      ? `${bank.name} отключён. Переподключите для синхронизации.`
                      : `${bank.name} is disconnected. Reconnect to sync.`
                    );
                  } else {
                    toast.success(language === 'ru' 
                      ? `${bank.name} синхронизируется...`
                      : `Syncing ${bank.name}...`
                    );
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl transition-transform group-hover:scale-110">{bank.logo}</div>
                  <div>
                    <p className="text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{bank.name}</p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">{bank.accounts} {language === 'ru' ? 'счетов' : 'accounts'}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      bank.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`} />
                    <span className={`text-xs ${
                      bank.status === 'connected' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {bank.status === 'connected' ? t('analytics.connected') : t('analytics.disconnected')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{bank.lastSync}</p>
                  {bank.status === 'connected' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(language === 'ru' 
                          ? `Синхронизация ${bank.name}...` 
                          : `Syncing ${bank.name}...`
                        );
                      }}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {t('analytics.syncNow')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Metrics & Liquidity Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Metrics Cards */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-white/90 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('analytics.businessMetrics')}
            <InfoTooltip text={t('chart.businessMetrics.info')} variant="light" />
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/70">{t('analytics.activeAccounts')}</p>
              <p className="text-3xl">{businessMetrics.activeAccounts}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">{t('analytics.totalTransactions')}</p>
              <p className="text-3xl">{businessMetrics.totalTransactions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">{t('analytics.avgMonthlyIncome')}</p>
              <p className="text-3xl">{displayCurrency} {formatDisplayAmount(convertedAvgMonthlyIncome)}</p>
            </div>
            <div className="pt-3 border-t border-white/20">
              <p className="text-xs text-white/70">{language === 'ru' ? 'Активные страны' : 'Active Countries'}</p>
              <div className="flex gap-2 mt-2">
                {businessMetrics.countries.map((c) => (
                  <span key={c} className="px-2 py-1 bg-white/20 rounded text-xs">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Liquidity Forecast */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {t('analytics.liquidityForecast')}
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
                {displayCurrency}
              </span>
              <InfoTooltip text={t('chart.liquidity.info')} />
            </h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs">
              {t('analytics.forecast')}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={convertedLiquidityForecast}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatDisplayAmount(value)} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => `${displayCurrency} ${formatDisplayAmount(value)}`}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                fillOpacity={1}
                fill="url(#colorBalance)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="max" 
                stroke="#93c5fd" 
                fill="none" 
                strokeDasharray="5 5"
                strokeWidth={1}
              />
              <Area 
                type="monotone" 
                dataKey="min" 
                stroke="#93c5fd" 
                fill="none" 
                strokeDasharray="5 5"
                strokeWidth={1}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">{language === 'ru' ? 'Текущий' : 'Current'}</p>
              <p className="text-lg text-gray-900">₸2.8M</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">{language === 'ru' ? 'Прогноз' : 'Forecast'}</p>
              <p className="text-lg text-blue-600">₸3.4M</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">{language === 'ru' ? 'Рост' : 'Growth'}</p>
              <p className="text-lg text-green-600">+21%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
