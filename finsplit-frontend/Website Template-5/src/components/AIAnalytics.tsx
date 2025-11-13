import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DollarSign,
  Globe,
  BarChart3,
  Zap,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Calendar,
  Percent,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
  PieChart,
  Settings,
  Building2,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useLanguage } from '../utils/LanguageContext';
import { useOrganization } from '../utils/OrganizationContext';
import { OrganizationSelector } from './OrganizationSelector';
import { OrganizationStats } from './OrganizationStats';
import { toast } from 'sonner@2.0.3';
import { Slider } from './ui/slider';

interface AIAnalyticsProps {
  currency?: string;
}

export function AIAnalytics({ currency = 'USD' }: AIAnalyticsProps) {
  const { language } = useLanguage();
  const { getEntityMultiplier, getCurrentSelectionName } = useOrganization();
  
  const [forecastPeriod, setForecastPeriod] = useState<30 | 90>(30);
  const [currencyRate, setCurrencyRate] = useState(450);
  const [expensesGrowth, setExpensesGrowth] = useState(0);
  const [taxRate, setTaxRate] = useState(20);
  const [scenarioApplied, setScenarioApplied] = useState(false);

  const multiplier = getEntityMultiplier();

  // Mock forecast data
  const forecastData = Array.from({ length: forecastPeriod / 10 }, (_, i) => {
    const day = (i + 1) * 10;
    const baseRevenue = 50000 * multiplier + Math.random() * 20000 * multiplier;
    const baseExpenses = 30000 * multiplier + Math.random() * 10000 * multiplier;
    const seasonalFactor = 1 + Math.sin(i / 2) * 0.15;
    
    return {
      day: `Day ${day}`,
      revenue: Math.round(baseRevenue * seasonalFactor * (scenarioApplied ? 1 - expensesGrowth / 200 : 1)),
      expenses: Math.round(baseExpenses * (1 + expensesGrowth / 100) * seasonalFactor),
      profit: Math.round((baseRevenue - baseExpenses) * seasonalFactor * (scenarioApplied ? 1 - expensesGrowth / 100 : 1)),
      trend: i % 2 === 0 ? 'up' : 'stable'
    };
  });

  // Cash flow projection data
  const cashFlowData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { month: 'short' });
    const income = 100000 + Math.random() * 50000 - (i > 6 ? 10000 : 0);
    const outcome = 60000 + Math.random() * 30000 + (expensesGrowth * 1000);
    
    return {
      month,
      income: Math.round(income),
      outcome: Math.round(outcome),
      net: Math.round(income - outcome),
      risk: i === 8 || i === 11
    };
  });

  // AI Recommendations
  const recommendations = [
    {
      id: 1,
      category: 'financial',
      title: language === 'ru' ? 'Оптимизация расходов' : 'Expense Optimization',
      description: language === 'ru' 
        ? 'Снизьте операционные расходы на 8% путем пересмотра SaaS подписок' 
        : 'Reduce operational expenses by 8% by reviewing SaaS subscriptions',
      impact: '+$4,200/месяц',
      priority: 'high',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      status: 'pending'
    },
    {
      id: 2,
      category: 'tax',
      title: language === 'ru' ? 'Налоговая оптимизация' : 'Tax Optimization',
      description: language === 'ru'
        ? 'Перенос части платежей в Q1 снизит текущую налоговую базу на 12%'
        : 'Deferring payments to Q1 will reduce current tax base by 12%',
      impact: '-$2,800 налогов',
      priority: 'high',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      status: 'pending'
    },
    {
      id: 3,
      category: 'currency',
      title: language === 'ru' ? 'Валютная стратегия' : 'Currency Strategy',
      description: language === 'ru'
        ? 'EUR укрепляется относительно USD — конвертируйте 30% активов'
        : 'EUR strengthening vs USD — convert 30% of assets',
      impact: '+2.4% доход',
      priority: 'medium',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      status: 'pending'
    },
    {
      id: 4,
      category: 'financial',
      title: language === 'ru' ? 'Резервный фонд' : 'Emergency Fund',
      description: language === 'ru'
        ? 'Создайте резерв на 3 месяца для покрытия кассовых разрывов'
        : 'Build a 3-month reserve to cover cash flow gaps',
      impact: 'Защита от рисков',
      priority: 'medium',
      icon: Shield,
      color: 'from-indigo-500 to-blue-500',
      status: 'pending'
    }
  ];

  const [recStatus, setRecStatus] = useState<Record<number, string>>(
    recommendations.reduce((acc, rec) => ({ ...acc, [rec.id]: 'pending' }), {})
  );

  // Risk & Opportunity Radar data
  const riskData = [
    {
      category: language === 'ru' ? 'Валюта' : 'Currency',
      risk: scenarioApplied ? 85 : 65,
      opportunity: scenarioApplied ? 45 : 60
    },
    {
      category: language === 'ru' ? 'Кассовые разрывы' : 'Cash Gaps',
      risk: 40 + expensesGrowth,
      opportunity: 70
    },
    {
      category: language === 'ru' ? 'Налоги' : 'Taxes',
      risk: 55,
      opportunity: 80
    },
    {
      category: language === 'ru' ? 'Операции' : 'Operations',
      risk: 30,
      opportunity: 85
    },
    {
      category: language === 'ru' ? 'Рост' : 'Growth',
      risk: 25,
      opportunity: 90
    }
  ];

  // Smart Insights
  const insights = [
    {
      id: 1,
      text: language === 'ru'
        ? `Вероятен рост расходов на ${Math.round(12 + expensesGrowth)}% в декабре из-за праздничного периода.`
        : `Expenses likely to grow by ${Math.round(12 + expensesGrowth)}% in December due to holiday period.`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      confidence: 87
    },
    {
      id: 2,
      text: language === 'ru'
        ? 'Доходы из KZ сегмента снижаются 3-й месяц подряд — пересмотрите стратегию.'
        : 'KZ segment revenue declining for 3 months — review strategy.',
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
      confidence: 92
    },
    {
      id: 3,
      text: language === 'ru'
        ? `Курс EUR укрепляется (текущий: ${(currencyRate / 490).toFixed(2)}) — оптимально конвертировать часть USD.`
        : `EUR strengthening (current: ${(currencyRate / 490).toFixed(2)}) — optimal to convert some USD.`,
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      confidence: 78
    },
    {
      id: 4,
      text: language === 'ru'
        ? 'AI обнаружил аномалию: транзакции в категории "Marketing" выросли на 340% за неделю.'
        : 'AI detected anomaly: "Marketing" transactions increased 340% this week.',
      icon: AlertTriangle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      confidence: 95
    },
    {
      id: 5,
      text: language === 'ru'
        ? 'Прогноз: Q1 2026 показывает рост выручки на 18% при текущих трендах.'
        : 'Forecast: Q1 2026 shows 18% revenue growth at current trends.',
      icon: Sparkles,
      color: 'text-green-600',
      bg: 'bg-green-50',
      confidence: 84
    }
  ];

  const handleApplyScenario = () => {
    setScenarioApplied(true);
    toast.success(
      language === 'ru' 
        ? 'Сценарий применён! Прогноз пересчитан.' 
        : 'Scenario applied! Forecast recalculated.'
    );
  };

  const handleResetScenario = () => {
    setCurrencyRate(450);
    setExpensesGrowth(0);
    setTaxRate(20);
    setScenarioApplied(false);
    toast.info(language === 'ru' ? 'Сценарий сброшен' : 'Scenario reset');
  };

  const handleApplyRecommendation = (id: number) => {
    setRecStatus({ ...recStatus, [id]: 'applied' });
    toast.success(
      language === 'ru' 
        ? 'Рекомендация применена и добавлена в задачи' 
        : 'Recommendation applied and added to tasks'
    );
  };

  const handleDismissRecommendation = (id: number) => {
    setRecStatus({ ...recStatus, [id]: 'dismissed' });
    toast.info(language === 'ru' ? 'Рекомендация отклонена' : 'Recommendation dismissed');
  };

  // Calculate scenario impact
  const baseProfit = 150000;
  const scenarioProfit = baseProfit * (1 - expensesGrowth / 100) * (currencyRate / 450);
  const scenarioTaxes = scenarioProfit * (taxRate / 100);
  const profitChange = ((scenarioProfit - baseProfit) / baseProfit * 100).toFixed(1);
  const taxChange = ((scenarioTaxes - (baseProfit * 0.2)) / (baseProfit * 0.2) * 100).toFixed(1);



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl mb-1">
                {language === 'ru' ? 'AI Аналитика и Прогнозирование' : 'AI Analytics & Forecasting'}
              </h2>
              <p className="text-blue-100 text-sm">
                {language === 'ru' 
                  ? 'Интеллектуальный анализ и моделирование будущего бизнеса' 
                  : 'Intelligent analysis and business future modeling'}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <Activity className="w-4 h-4" />
            <span className="text-sm">{language === 'ru' ? 'Точность AI: 92%' : 'AI Accuracy: 92%'}</span>
          </div>
        </div>
      </div>

      {/* Organization Selector */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              {language === 'ru' ? 'Организация:' : 'Organization:'}
            </span>
          </div>
          <div className="flex-1">
            <OrganizationSelector compact={true} />
          </div>
        </div>
        
        {/* Organization Stats */}
        <OrganizationStats />
      </div>

      {/* AI Forecast Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {language === 'ru' ? 'AI Прогноз финансов' : 'AI Financial Forecast'}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setForecastPeriod(30)}
              className={`px-4 py-2 rounded-lg transition-all ${
                forecastPeriod === 30
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 {language === 'ru' ? 'дней' : 'days'}
            </button>
            <button
              onClick={() => setForecastPeriod(90)}
              className={`px-4 py-2 rounded-lg transition-all ${
                forecastPeriod === 90
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              90 {language === 'ru' ? 'дней' : 'days'}
            </button>
          </div>
        </div>

        {/* Forecast Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700">{language === 'ru' ? 'Прогноз доходов' : 'Revenue Forecast'}</span>
              <ArrowUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl text-green-900 mb-1">
              $
              {Math.round(
                forecastData.reduce((sum, d) => sum + d.revenue, 0) / 1000
              )}
              k
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+14.2%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-700">{language === 'ru' ? 'Прогноз расходов' : 'Expenses Forecast'}</span>
              <ArrowDown className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl text-orange-900 mb-1">
              $
              {Math.round(
                forecastData.reduce((sum, d) => sum + d.expenses, 0) / 1000
              )}
              k
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <TrendingUp className="w-3 h-3" />
              <span>+{Math.round(8 + expensesGrowth)}%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">{language === 'ru' ? 'Чистая прибыль' : 'Net Profit'}</span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl text-blue-900 mb-1">
              $
              {Math.round(
                forecastData.reduce((sum, d) => sum + d.profit, 0) / 1000
              )}
              k
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="w-3 h-3" />
              <span>+{scenarioApplied ? profitChange : '22.8'}%</span>
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <RechartsTooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              name={language === 'ru' ? 'Доходы' : 'Revenue'}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#colorExpenses)"
              name={language === 'ru' ? 'Расходы' : 'Expenses'}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorProfit)"
              name={language === 'ru' ? 'Прибыль' : 'Profit'}
            />
          </AreaChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-500 mt-4 text-center">
          {language === 'ru' 
            ? '📊 Рассчитано на основе истории транзакций за последние 6 месяцев и сезонности' 
            : '📊 Calculated based on 6-month transaction history and seasonality'}
        </p>
      </div>

      {/* Scenario Simulator + What-If Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Simulator */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            {language === 'ru' ? 'Симулятор сценариев' : 'Scenario Simulator'}
          </h3>

          <div className="space-y-6">
            {/* Currency Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  {language === 'ru' ? 'Курс USD/KZT' : 'USD/KZT Rate'}
                </label>
                <span className="text-sm text-gray-900">₸{currencyRate}</span>
              </div>
              <Slider
                value={[currencyRate]}
                onValueChange={(value) => setCurrencyRate(value[0])}
                min={400}
                max={500}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₸400</span>
                <span>₸500</span>
              </div>
            </div>

            {/* Expenses Growth Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  {language === 'ru' ? 'Рост расходов' : 'Expenses Growth'}
                </label>
                <span className="text-sm text-gray-900">{expensesGrowth > 0 ? '+' : ''}{expensesGrowth}%</span>
              </div>
              <Slider
                value={[expensesGrowth]}
                onValueChange={(value) => setExpensesGrowth(value[0])}
                min={-20}
                max={50}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>-20%</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Tax Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-purple-600" />
                  {language === 'ru' ? 'Налоговая ставка' : 'Tax Rate'}
                </label>
                <span className="text-sm text-gray-900">{taxRate}%</span>
              </div>
              <Slider
                value={[taxRate]}
                onValueChange={(value) => setTaxRate(value[0])}
                min={10}
                max={35}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10%</span>
                <span>35%</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleApplyScenario}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {language === 'ru' ? 'Применить сценарий' : 'Apply Scenario'}
              </button>
              <button
                onClick={handleResetScenario}
                className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* What-If AI Block */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-6">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            {language === 'ru' ? 'What-If: Прогноз влияния' : 'What-If: Impact Forecast'}
          </h3>

          {scenarioApplied ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{language === 'ru' ? 'Чистая прибыль' : 'Net Profit'}</span>
                  <div className={`flex items-center gap-1 text-sm ${
                    parseFloat(profitChange) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(profitChange) >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{profitChange}%</span>
                  </div>
                </div>
                <div className="text-lg text-gray-900">
                  ${scenarioProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{language === 'ru' ? 'Налоги' : 'Taxes'}</span>
                  <div className={`flex items-center gap-1 text-sm ${
                    parseFloat(taxChange) >= 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {parseFloat(taxChange) >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{taxChange}%</span>
                  </div>
                </div>
                <div className="text-lg text-gray-900">
                  ${scenarioTaxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="bg-indigo-100 rounded-xl p-4 border border-indigo-300">
                <p className="text-sm text-indigo-900">
                  {language === 'ru' 
                    ? `💡 AI интерпретация: При курсе ₸${currencyRate} и росте расходов на ${expensesGrowth}%, чистая прибыль изменится на ${profitChange}%, налоги — на ${taxChange}%.`
                    : `💡 AI interpretation: At ₸${currencyRate} rate and ${expensesGrowth}% expenses growth, net profit will change by ${profitChange}%, taxes by ${taxChange}%.`}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-100 px-3 py-2 rounded-lg">
                <Activity className="w-4 h-4" />
                <span>{language === 'ru' ? 'Точность прогноза: 88%' : 'Forecast confidence: 88%'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'ru' 
                  ? 'Настройте параметры сценария и примените его, чтобы увидеть AI прогноз влияния на бизнес' 
                  : 'Adjust scenario parameters and apply to see AI business impact forecast'}
              </p>
              <button
                onClick={() => {
                  setCurrencyRate(470);
                  setExpensesGrowth(10);
                  setTaxRate(18);
                  setTimeout(handleApplyScenario, 100);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {language === 'ru' ? 'Попробовать пример' : 'Try Example'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations Hub */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          {language === 'ru' ? 'AI Рекомендации' : 'AI Recommendations'}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            const status = recStatus[rec.id];

            return (
              <div
                key={rec.id}
                className={`rounded-xl p-4 border-2 transition-all ${
                  status === 'applied'
                    ? 'bg-green-50 border-green-300'
                    : status === 'dismissed'
                    ? 'bg-gray-50 border-gray-200 opacity-50'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${rec.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm text-gray-900">{rec.title}</h4>
                      {rec.priority === 'high' && status === 'pending' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-md flex items-center gap-1 flex-shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          {language === 'ru' ? 'Важно' : 'High'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                        {rec.impact}
                      </span>
                      {status === 'applied' && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {language === 'ru' ? 'Применено' : 'Applied'}
                        </span>
                      )}
                      {status === 'dismissed' && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {language === 'ru' ? 'Отклонено' : 'Dismissed'}
                        </span>
                      )}
                    </div>

                    {status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApplyRecommendation(rec.id)}
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {language === 'ru' ? 'Применить' : 'Apply'}
                        </button>
                        <button
                          onClick={() => handleDismissRecommendation(rec.id)}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {language === 'ru' ? 'Отклонить' : 'Dismiss'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk & Opportunity Radar + Smart Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk & Opportunity Radar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            {language === 'ru' ? 'Радар рисков и возможностей' : 'Risk & Opportunity Radar'}
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name={language === 'ru' ? 'Риск' : 'Risk'}
                dataKey="risk"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
              />
              <Radar
                name={language === 'ru' ? 'Возможность' : 'Opportunity'}
                dataKey="opportunity"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {riskData.map((item, idx) => {
              const riskLevel = item.risk > 70 ? 'high' : item.risk > 40 ? 'medium' : 'low';
              const riskColor = riskLevel === 'high' ? 'bg-red-100 text-red-700' : riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';

              return (
                <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${riskColor}`}>
                      {riskLevel === 'high' 
                        ? (language === 'ru' ? 'Высокий' : 'High')
                        : riskLevel === 'medium' 
                        ? (language === 'ru' ? 'Средний' : 'Medium')
                        : (language === 'ru' ? 'Низкий' : 'Low')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Insights Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            {language === 'ru' ? 'Умные инсайты' : 'Smart Insights'}
          </h3>

          <div className="space-y-3">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div key={insight.id} className={`${insight.bg} rounded-xl p-4 border border-gray-200`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 mb-2">{insight.text}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${
                              insight.confidence > 90 
                                ? 'from-green-500 to-emerald-500' 
                                : insight.confidence > 80 
                                ? 'from-blue-500 to-cyan-500' 
                                : 'from-orange-500 to-yellow-500'
                            }`}
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{insight.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => toast.info(language === 'ru' ? 'Обновление инсайтов...' : 'Refreshing insights...')}
            className="w-full mt-4 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'ru' ? 'Обновить инсайты' : 'Refresh Insights'}
          </button>
        </div>
      </div>

      {/* Future Cash-Flow Projection */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-600" />
          {language === 'ru' ? 'Прогноз денежного потока' : 'Future Cash-Flow Projection'}
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <RechartsTooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Bar
              dataKey="income"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              name={language === 'ru' ? 'Доходы' : 'Income'}
            />
            <Bar
              dataKey="outcome"
              fill="#f97316"
              radius={[8, 8, 0, 0]}
              name={language === 'ru' ? 'Расходы' : 'Outcome'}
            />
            <Bar
              dataKey="net"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name={language === 'ru' ? 'Чистый' : 'Net'}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-3 border border-green-200">
            <p className="text-xs text-green-700 mb-1">{language === 'ru' ? 'Средний доход' : 'Avg Income'}</p>
            <p className="text-lg text-green-900">
              ${Math.round(cashFlowData.reduce((sum, d) => sum + d.income, 0) / cashFlowData.length / 1000)}k
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
            <p className="text-xs text-orange-700 mb-1">{language === 'ru' ? 'Средний расход' : 'Avg Outcome'}</p>
            <p className="text-lg text-orange-900">
              ${Math.round(cashFlowData.reduce((sum, d) => sum + d.outcome, 0) / cashFlowData.length / 1000)}k
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">{language === 'ru' ? 'Средний остаток' : 'Avg Net'}</p>
            <p className="text-lg text-blue-900">
              ${Math.round(cashFlowData.reduce((sum, d) => sum + d.net, 0) / cashFlowData.length / 1000)}k
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 border border-red-200">
            <p className="text-xs text-red-700 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {language === 'ru' ? 'Зоны риска' : 'Risk Zones'}
            </p>
            <p className="text-lg text-red-900">{cashFlowData.filter(d => d.risk).length}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            {language === 'ru' 
              ? '⚠️ Прогноз показывает возможные кассовые разрывы в августе и ноябре. Рекомендуется создать резервный фонд.' 
              : '⚠️ Forecast shows potential cash gaps in August and November. Reserve fund recommended.'}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-800 mb-1">
              {language === 'ru' 
                ? '🤖 AI Ассистент FinSplit анализирует данные в реальном времени' 
                : '🤖 FinSplit AI Assistant analyzes data in real-time'}
            </p>
            <p className="text-xs text-gray-600">
              {language === 'ru' 
                ? 'Все прогнозы и рекомендации основаны на машинном обучении и исторических данных. Точность прогнозов: 88-95%. Данные обновляются каждые 24 часа.' 
                : 'All forecasts and recommendations are based on machine learning and historical data. Forecast accuracy: 88-95%. Data updated every 24 hours.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
