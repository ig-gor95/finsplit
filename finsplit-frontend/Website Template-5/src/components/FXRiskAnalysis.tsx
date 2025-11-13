import { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { toast } from 'sonner@2.0.3';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  DollarSign,
  Activity,
  Target,
  ArrowUpDown,
  Info,
  Zap,
  FileDown,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  PieChart,
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
  Area,
  AreaChart
} from 'recharts';

interface FXRiskAnalysisProps {
  accounts: Array<{
    id: number;
    name: string;
    currency: string;
    balance: number;
    country: string;
  }>;
  exchangeRates: Record<string, number>;
  primaryCurrency?: string;
}

const CURRENCY_COLORS: Record<string, string> = {
  KZT: '#3b82f6',
  USD: '#10b981',
  EUR: '#8b5cf6',
  RUB: '#f59e0b',
  GEL: '#ec4899',
  AMD: '#06b6d4',
};

export function FXRiskAnalysis({ accounts, exchangeRates, primaryCurrency = 'USD' }: FXRiskAnalysisProps) {
  const { language } = useLanguage();
  const [scenarioAdjustments, setScenarioAdjustments] = useState<Record<string, number>>({
    USD: 0,
    EUR: 0,
    KZT: 0,
    RUB: 0,
  });

  // Calculate balance by currency
  const balanceByCurrency = accounts.reduce((acc, account) => {
    const existing = acc.find(item => item.currency === account.currency);
    if (existing) {
      existing.balance += account.balance;
    } else {
      acc.push({
        currency: account.currency,
        balance: account.balance,
        color: CURRENCY_COLORS[account.currency] || '#6b7280',
      });
    }
    return acc;
  }, [] as Array<{ currency: string; balance: number; color: string }>);

  // Exchange rates conversion matrix
  const conversionRates: Record<string, Record<string, number>> = {
    'USD': { 'USD': 1, 'EUR': 0.92, 'KZT': 480, 'RUB': 92 },
    'EUR': { 'USD': 1.09, 'EUR': 1, 'KZT': 522, 'RUB': 100 },
    'KZT': { 'USD': 0.0021, 'EUR': 0.0019, 'KZT': 1, 'RUB': 0.19 },
    'RUB': { 'USD': 0.011, 'EUR': 0.010, 'KZT': 5.2, 'RUB': 1 },
  };

  const convertToPrimaryCurrency = (amount: number, fromCurrency: string): number => {
    const rate = conversionRates[fromCurrency]?.[primaryCurrency] || 1;
    return amount * rate;
  };

  // Calculate balance by country
  const balanceByCountry = accounts.reduce((acc, account) => {
    const balanceInPrimary = convertToPrimaryCurrency(account.balance, account.currency);
    const existing = acc.find(item => item.country === account.country);
    if (existing) {
      existing.balance += balanceInPrimary;
    } else {
      acc.push({
        country: account.country,
        balance: balanceInPrimary,
        flag: account.country === 'KZ' ? '🇰🇿' :
              account.country === 'RU' ? '🇷🇺' :
              account.country === 'GE' ? '🇬🇪' :
              account.country === 'AM' ? '🇦🇲' : '🇪🇺',
      });
    }
    return acc;
  }, [] as Array<{ country: string; balance: number; flag: string }>);

  // Calculate total balance in primary currency
  const totalBalancePrimary = accounts.reduce((sum, acc) => {
    return sum + convertToPrimaryCurrency(acc.balance, acc.currency);
  }, 0);

  // Calculate scenario impact
  const calculateScenarioImpact = () => {
    let newBalance = 0;
    let impactByAccount: Array<{ currency: string; currentBalance: number; newBalance: number; change: number; changePercent: number }> = [];

    accounts.forEach(account => {
      const currentRate = conversionRates[account.currency]?.[primaryCurrency] || 1;
      const adjustment = scenarioAdjustments[account.currency] || 0;
      const newRate = currentRate * (1 + adjustment / 100);
      
      const currentBalancePrimary = account.balance * currentRate;
      const newBalancePrimary = account.balance * newRate;
      const change = newBalancePrimary - currentBalancePrimary;
      
      newBalance += newBalancePrimary;

      const existing = impactByAccount.find(item => item.currency === account.currency);
      if (existing) {
        existing.currentBalance += currentBalancePrimary;
        existing.newBalance += newBalancePrimary;
        existing.change += change;
      } else {
        impactByAccount.push({
          currency: account.currency,
          currentBalance: currentBalancePrimary,
          newBalance: newBalancePrimary,
          change,
          changePercent: adjustment,
        });
      }
    });

    const totalChange = newBalance - totalBalancePrimary;
    const totalChangePercent = totalBalancePrimary !== 0 ? (totalChange / totalBalancePrimary) * 100 : 0;

    return {
      newBalance,
      totalChange,
      totalChangePercent,
      impactByAccount,
    };
  };

  const scenarioResult = calculateScenarioImpact();

  // Historical FX impact data (mock)
  const fxImpactHistory = [
    { month: 'Jun', balance: 2650000, usdRate: 445, eurRate: 485, rubRate: 5.0 },
    { month: 'Jul', balance: 2720000, usdRate: 448, eurRate: 490, rubRate: 5.1 },
    { month: 'Aug', balance: 2580000, usdRate: 455, eurRate: 495, rubRate: 5.3 },
    { month: 'Sep', balance: 2810000, usdRate: 452, eurRate: 488, rubRate: 5.2 },
    { month: 'Oct', balance: 2890000, usdRate: 450, eurRate: 490, rubRate: 5.2 },
    { month: 'Nov', balance: totalBalancePrimary, usdRate: 450, eurRate: 490, rubRate: 5.2 },
  ];

  // Exchange rates history for line chart
  const ratesHistory = [
    { month: 'Jun 2025', USD: 445, EUR: 485, RUB: 5.0 },
    { month: 'Jul 2025', USD: 448, EUR: 490, RUB: 5.1 },
    { month: 'Aug 2025', USD: 455, EUR: 495, RUB: 5.3 },
    { month: 'Sep 2025', USD: 452, EUR: 488, RUB: 5.2 },
    { month: 'Oct 2025', USD: 450, EUR: 490, RUB: 5.2 },
    { month: 'Nov 2025', USD: 450, EUR: 490, RUB: 5.2 },
  ];

  // Monthly revaluation history
  const revaluationHistory = [
    { month: 'Jun 2025', usdGainLoss: 12500, eurGainLoss: 8200, rubGainLoss: -3400, totalGainLoss: 17300 },
    { month: 'Jul 2025', usdGainLoss: 15000, eurGainLoss: 10500, rubGainLoss: -2100, totalGainLoss: 23400 },
    { month: 'Aug 2025', usdGainLoss: -8500, eurGainLoss: 5200, rubGainLoss: -5600, totalGainLoss: -8900 },
    { month: 'Sep 2025', usdGainLoss: 10200, eurGainLoss: -3500, rubGainLoss: 1800, totalGainLoss: 8500 },
    { month: 'Oct 2025', usdGainLoss: 7800, eurGainLoss: 6400, rubGainLoss: -1200, totalGainLoss: 13000 },
    { month: 'Nov 2025', usdGainLoss: 0, eurGainLoss: 0, rubGainLoss: 0, totalGainLoss: 0 },
  ];

  // Calculate total profit (mock)
  const totalProfit = 2250000; // 2.25M KZT
  const totalFxGainLoss = revaluationHistory.reduce((sum, item) => sum + item.totalGainLoss, 0);
  const fxImpactOnProfit = totalProfit !== 0 ? (totalFxGainLoss / totalProfit) * 100 : 0;

  // Risk level calculation
  const calculateRiskLevel = () => {
    const currencyCount = balanceByCurrency.length;
    
    // Защита от деления на ноль и пустого массива
    if (currencyCount === 0 || totalBalancePrimary === 0) {
      return { level: 'low', color: 'green', text: language === 'ru' ? 'Низкий' : 'Low', bgClass: 'bg-green-100', textClass: 'text-green-700' };
    }
    
    const largestCurrencyShare = Math.max(...balanceByCurrency.map(c => {
      const balanceInPrimary = convertToPrimaryCurrency(c.balance, c.currency);
      return (balanceInPrimary / totalBalancePrimary) * 100;
    }));

    if (currencyCount === 1) return { level: 'high', color: 'red', text: language === 'ru' ? 'Высокий' : 'High', bgClass: 'bg-red-100', textClass: 'text-red-700' };
    if (largestCurrencyShare > 70) return { level: 'medium-high', color: 'orange', text: language === 'ru' ? 'Средне-высокий' : 'Medium-High', bgClass: 'bg-orange-100', textClass: 'text-orange-700' };
    if (largestCurrencyShare > 50) return { level: 'medium', color: 'amber', text: language === 'ru' ? 'Средний' : 'Medium', bgClass: 'bg-amber-100', textClass: 'text-amber-700' };
    return { level: 'low', color: 'green', text: language === 'ru' ? 'Низкий' : 'Low', bgClass: 'bg-green-100', textClass: 'text-green-700' };
  };

  const riskLevel = calculateRiskLevel();

  const resetScenario = () => {
    setScenarioAdjustments({
      USD: 0,
      EUR: 0,
      KZT: 0,
      RUB: 0,
    });
    toast.success(language === 'ru' ? 'Сценарий сброшен' : 'Scenario reset');
  };

  const generateRevaluationReport = () => {
    toast.success(
      language === 'ru' 
        ? 'Отчет о переоценке создан. Скачивание начнется автоматически...' 
        : 'Revaluation report generated. Download will start automatically...'
    );
    // Here you would implement actual PDF/Excel generation
    setTimeout(() => {
      toast.success(
        language === 'ru' 
          ? 'Отчет Revaluation_Report_Nov2025.pdf готов' 
          : 'Report Revaluation_Report_Nov2025.pdf is ready'
      );
    }, 1500);
  };

  const formatCurrency = (amount: number, currency: string = primaryCurrency) => {
    if (isNaN(amount) || !isFinite(amount)) {
      return `0 ${currency}`;
    }
    return `${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currency}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0]?.value !== undefined) {
      const value = payload[0].value;
      const formattedValue = isNaN(value) || !isFinite(value) ? '0' : value.toLocaleString('en-US', { maximumFractionDigits: 0 });
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-900 mb-1">{payload[0].payload.currency || payload[0].payload.country}</p>
          <p className="text-sm text-gray-600">
            {formattedValue} {primaryCurrency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Charts Grid - Moved to top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance by Currency - Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            {language === 'ru' ? 'Распределение по валютам' : 'Distribution by Currency'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={balanceByCurrency.map(item => ({
                  ...item,
                  value: convertToPrimaryCurrency(item.balance, item.currency),
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ currency, percent }) => `${currency} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {balanceByCurrency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {balanceByCurrency.map((item) => {
              const balanceInPrimary = convertToPrimaryCurrency(item.balance, item.currency);
              const percent = totalBalancePrimary > 0 ? (balanceInPrimary / totalBalancePrimary) * 100 : 0;
              return (
                <div key={item.currency} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.currency}</span>
                  <span className="text-sm text-gray-500 ml-auto">{isNaN(percent) || !isFinite(percent) ? '0.0' : percent.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Balance by Country - Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {language === 'ru' ? 'Распределение по странам' : 'Distribution by Country'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceByCountry}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="country" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => balanceByCountry.find(c => c.country === value)?.flag + ' ' + value}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="balance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Level Overview & FX Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-gray-900">
                  {language === 'ru' ? 'Валютный риск портфеля' : 'Portfolio Currency Risk'}
                </h3>
                <InfoTooltip text={language === 'ru' ? 'Показывает уровень валютного риска на основе диверсификации: чем больше валют и юрисдикций, тем ниже риск' : 'Shows currency risk level based on diversification: more currencies and jurisdictions mean lower risk'} />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'ru' 
                  ? 'Оценка валютных рисков на основе диверсификации активов'
                  : 'Currency risk assessment based on asset diversification'}
              </p>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 ${riskLevel.bgClass} ${riskLevel.textClass} rounded-lg`}>
                  <p className="text-xs mb-1">{language === 'ru' ? 'Уровень риска' : 'Risk Level'}</p>
                  <p className="text-lg">{riskLevel.text}</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">{language === 'ru' ? 'Валют в портфеле' : 'Currencies'}</p>
                  <p className="text-lg text-gray-900">{balanceByCurrency.length}</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">{language === 'ru' ? 'Юрисдикций' : 'Jurisdictions'}</p>
                  <p className="text-lg text-gray-900">{balanceByCountry.length}</p>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* FX Impact on Profit */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 flex items-center gap-2">
                {language === 'ru' ? 'Влияние FX на прибыль' : 'FX Impact on Profit'}
                <InfoTooltip text={language === 'ru' ? 'Показывает, как колебания валютных курсов влияют на общую прибыль компании за период' : 'Shows how currency rate fluctuations affect total company profit over the period'} />
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                {language === 'ru' ? 'Общая прибыль (до налогов)' : 'Total Profit (before tax)'}
                <InfoTooltip text={language === 'ru' ? 'Прибыль до вычета налогов и курсовых разниц' : 'Profit before tax and FX adjustments'} />
              </div>
              <p className="text-xl text-gray-900">
                {formatCurrency(convertToPrimaryCurrency(totalProfit, 'KZT'))} {primaryCurrency}
              </p>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                {language === 'ru' ? 'FX влияние (прибыль/убыток)' : 'FX Gain/Loss'}
                <InfoTooltip text={language === 'ru' ? 'Сумма прибыли или убытка от переоценки валютных позиций' : 'Total gain or loss from currency position revaluation'} />
              </div>
              <p className={`text-xl ${totalFxGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalFxGainLoss >= 0 ? '+' : ''}{formatCurrency(convertToPrimaryCurrency(totalFxGainLoss, 'KZT'))} {primaryCurrency}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                {language === 'ru' ? 'FX доля в прибыли' : 'FX Impact %'}
                <InfoTooltip text={language === 'ru' ? 'Процент влияния курсовых разниц на общую прибыль. Показывает степень валютного риска.' : 'Percentage of FX impact on total profit. Shows degree of currency risk.'} />
              </div>
              <p className={`text-2xl ${fxImpactOnProfit >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-2`}>
                {fxImpactOnProfit >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {fxImpactOnProfit >= 0 ? '+' : ''}{isNaN(fxImpactOnProfit) || !isFinite(fxImpactOnProfit) ? '0.00' : fxImpactOnProfit.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rates History Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {language === 'ru' ? 'История курсов валют (6 месяцев)' : 'Exchange Rates History (6 months)'}
            <InfoTooltip text={language === 'ru' ? `График изменения курсов основных валют к ${primaryCurrency} за последние 6 есяце` : `Chart showing exchange rate changes against ${primaryCurrency} over the last 6 months`} />
          </h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-600">USD</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-gray-600">EUR</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-gray-600">RUB</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ratesHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                      <p className="text-sm text-gray-900 mb-2">{data.month}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-blue-600">USD: {data.USD}</p>
                        <p className="text-xs text-purple-600">EUR: {data.EUR}</p>
                        <p className="text-xs text-orange-600">RUB: {data.RUB}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="USD" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="EUR" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="RUB" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revaluation History Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {language === 'ru' ? 'История переоценки (Revaluation Gain/Loss)' : 'Revaluation History (Gain/Loss)'}
          </h3>
          <button
            onClick={generateRevaluationReport}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            {language === 'ru' ? 'Сздать отчёт' : 'Generate Report'}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  {language === 'ru' ? 'Период' : 'Period'}
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">USD</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">EUR</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">RUB</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">
                  {language === 'ru' ? 'Всего' : 'Total'}
                </th>
              </tr>
            </thead>
            <tbody>
              {revaluationHistory.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.month}</td>
                  <td className={`px-4 py-3 text-sm text-right ${item.usdGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.usdGainLoss >= 0 ? '+' : ''}{formatCurrency(item.usdGainLoss)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right ${item.eurGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.eurGainLoss >= 0 ? '+' : ''}{formatCurrency(item.eurGainLoss)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right ${item.rubGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.rubGainLoss >= 0 ? '+' : ''}{formatCurrency(item.rubGainLoss)}
                  </td>
                  <td className={`px-4 py-3 text-right ${item.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(item.totalGainLoss)} KZT
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-900">
                  {language === 'ru' ? 'Итого за период' : 'Total'}
                </td>
                <td className={`px-4 py-3 text-right ${
                  revaluationHistory.reduce((sum, item) => sum + item.usdGainLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {revaluationHistory.reduce((sum, item) => sum + item.usdGainLoss, 0) >= 0 ? '+' : ''}
                  {formatCurrency(revaluationHistory.reduce((sum, item) => sum + item.usdGainLoss, 0))}
                </td>
                <td className={`px-4 py-3 text-right ${
                  revaluationHistory.reduce((sum, item) => sum + item.eurGainLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {revaluationHistory.reduce((sum, item) => sum + item.eurGainLoss, 0) >= 0 ? '+' : ''}
                  {formatCurrency(revaluationHistory.reduce((sum, item) => sum + item.eurGainLoss, 0))}
                </td>
                <td className={`px-4 py-3 text-right ${
                  revaluationHistory.reduce((sum, item) => sum + item.rubGainLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {revaluationHistory.reduce((sum, item) => sum + item.rubGainLoss, 0) >= 0 ? '+' : ''}
                  {formatCurrency(revaluationHistory.reduce((sum, item) => sum + item.rubGainLoss, 0))}
                </td>
                <td className={`px-4 py-3 text-right ${totalFxGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalFxGainLoss >= 0 ? '+' : ''}{formatCurrency(totalFxGainLoss)} KZT
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="mb-1">
                {language === 'ru' 
                  ? 'Что такое переоценка валют?' 
                  : 'What is currency revaluation?'}
              </p>
              <p className="text-xs text-blue-700">
                {language === 'ru'
                  ? 'Переоценка отражает изменение стоимости активов в иностранной валюте из-за колебаний курсов. Прибыль или убыток от переоценки включаются в финансовый результат.'
                  : 'Revaluation reflects the change in value of foreign currency assets due to exchange rate fluctuations. Revaluation gains or losses are included in financial results.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FX Impact History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {language === 'ru' ? 'Влияние курсов на баланс (6 месяцев)' : 'FX Impact on Balance (6 months)'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={fxImpactHistory}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                      <p className="text-sm text-gray-900 mb-2">{data.month}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ru' ? 'Баланс:' : 'Balance:'} {formatCurrency(data.balance)} KZT
                      </p>
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        <p>USD: {data.usdRate}</p>
                        <p>EUR: {data.eurRate}</p>
                        <p>RUB: {data.rubRate}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario Analysis Tool */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-gray-900 flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              {language === 'ru' ? 'Инструмент сценарного анализа' : 'Scenario Analysis Tool'}
              <InfoTooltip 
                text={language === 'ru' 
                  ? 'Моделируйте изменения валютных курсов для прогноза влияния на баланс, налоги и денежный поток. Измените курсы на ±10% чтобы увидеть эффект в реальном времени и планировать хеджирование.'
                  : 'Simulate currency rate changes to predict impact on your balance, taxes, and cash flow. Adjust rates by ±10% to see real-time effects and plan hedging strategies.'} 
              />
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'ru' 
                ? 'Измените курсы валют, чтобы увидеть влияние на ваш баланс и налоги'
                : 'Adjust currency rates to see impact on your balance and taxes'}
            </p>
          </div>
          <button
            onClick={resetScenario}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'ru' ? 'Сбросиь' : 'Reset'}
          </button>
        </div>

        {/* Currency Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(scenarioAdjustments).map(([currency, value]) => {
            const currentRate = conversionRates[currency]?.[primaryCurrency] || 1;
            return (
              <div key={currency} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: CURRENCY_COLORS[currency] || '#6b7280' }}
                    />
                    <span className="text-sm text-gray-900">{currency}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {language === 'ru' ? 'Текущий:' : 'Current:'} {isNaN(currentRate) || !isFinite(currentRate) ? '0.00' : currentRate.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-900">
                      {language === 'ru' ? 'Новый:' : 'New:'} {isNaN(currentRate) || !isFinite(currentRate) ? '0.00' : (currentRate * (1 + value / 100)).toFixed(2)}
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={value}
                  onChange={(e) => setScenarioAdjustments({
                    ...scenarioAdjustments,
                    [currency]: parseFloat(e.target.value),
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">-10%</span>
                  <span className={`text-sm ${value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {value > 0 ? '+' : ''}{isNaN(value) || !isFinite(value) ? '0.0' : value.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">+10%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scenario Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{language === 'ru' ? 'Новый баланс' : 'New Balance'}</p>
              <ArrowUpDown className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900 mb-1">
              {formatCurrency(scenarioResult.newBalance)} KZT
            </p>
            <p className={`text-sm flex items-center gap-1 ${
              scenarioResult.totalChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {scenarioResult.totalChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {scenarioResult.totalChange >= 0 ? '+' : ''}{formatCurrency(scenarioResult.totalChange)} KZT
              ({scenarioResult.totalChangePercent >= 0 ? '+' : ''}{isNaN(scenarioResult.totalChangePercent) || !isFinite(scenarioResult.totalChangePercent) ? '0.00' : scenarioResult.totalChangePercent.toFixed(2)}%)
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{language === 'ru' ? 'Влияние на налоги' : 'Tax Impact'}</p>
              <Info className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900 mb-1">
              {formatCurrency(Math.abs(scenarioResult.totalChange) * 0.1)} KZT
            </p>
            <p className="text-sm text-gray-600">
              {language === 'ru' ? '~10% от изменения' : '~10% of change'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{language === 'ru' ? 'Cash Flow' : 'Cash Flow'}</p>
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900 mb-1">
              {scenarioResult.totalChange >= 0 ? '+' : ''}{formatCurrency(scenarioResult.totalChange * 0.85)} KZT
            </p>
            <p className="text-sm text-gray-600">
              {language === 'ru' ? 'После вычета налогов' : 'After tax deduction'}
            </p>
          </div>
        </div>

        {/* Detailed Impact by Currency */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm text-gray-900 mb-3">
            {language === 'ru' ? 'Детальное влияние по валютам:' : 'Detailed Impact by Currency:'}
          </h4>
          <div className="space-y-2">
            {scenarioResult.impactByAccount.map((item) => (
              <div key={item.currency} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: CURRENCY_COLORS[item.currency] || '#6b7280' }}
                  />
                  <span className="text-sm text-gray-700">{item.currency}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">
                    {formatCurrency(item.currentBalance)} → {formatCurrency(item.newBalance)} KZT
                  </p>
                  <p className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)} KZT
                    ({item.changePercent >= 0 ? '+' : ''}{isNaN(item.changePercent) || !isFinite(item.changePercent) ? '0.0' : item.changePercent.toFixed(1)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {Math.abs(scenarioResult.totalChangePercent) > 5 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900 mb-1">
                {language === 'ru' ? 'Значительное изменение баланса' : 'Significant Balance Change'}
              </p>
              <p className="text-xs text-amber-700">
                {language === 'ru'
                  ? 'Изменение курсов на более ем 5% может существенно повлиять на ваш баланс. Рассмотрите стратегии хеджирования.'
                  : 'Exchange rate changes over 5% can significantly impact your balance. Consider hedging strategies.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-gray-900 mb-4">
          {language === 'ru' ? 'Рекомендации по снижению рисков' : 'Risk Mitigation Recommendations'}
        </h3>
        <div className="space-y-3">
          {riskLevel.level === 'high' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-900 mb-1">
                  {language === 'ru' ? 'Диверсифицируйте валютный портфель' : 'Diversify Currency Portfolio'}
                </p>
                <p className="text-xs text-red-700">
                  {language === 'ru'
                    ? 'Все активы в одной валюте создают высокий риск. Рассмотрите открытие счетов в других валютах.'
                    : 'All assets in one currency creates high risk. Consider opening accounts in other currencies.'}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 mb-1">
                {language === 'ru' ? 'Мониторьте курсы регулярно' : 'Monitor Exchange Rates Regularly'}
              </p>
              <p className="text-xs text-blue-700">
                {language === 'ru'
                  ? 'Настройте уведомления при изменении курсов на более чем 2% для своевременного реагирования.'
                  : 'Set up notifications for rate changes over 2% to react in time.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-900 mb-1">
                {language === 'ru' ? 'Используйте естественное хеджирование' : 'Use Natural Hedging'}
              </p>
              <p className="text-xs text-green-700">
                {language === 'ru'
                  ? 'Если у вас есть расходы и доходы в одной валюте, это естественным образом снижает валютные риски.'
                  : 'If you have expenses and income in the same currency, this naturally reduces FX risk.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}