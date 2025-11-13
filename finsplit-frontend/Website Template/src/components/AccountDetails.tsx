import { X, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';

interface Account {
  id: number;
  name: string;
  balance: number;
  currency: string;
  country: string;
  type: string;
  bank?: string;
  category?: string;
  lastUpdated?: string;
}

interface AccountDetailsProps {
  account: Account;
  exchangeRate: number;
  baseCurrency: string;
  onClose: () => void;
  primaryCurrency?: string;
}

export function AccountDetails({ account, exchangeRate, baseCurrency, onClose, primaryCurrency }: AccountDetailsProps) {
  const { language } = useLanguage();
  const displayCurrency = primaryCurrency || baseCurrency;

  // Mock historical balance data (last 90 days)
  const balanceHistory = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - i));
    const baseBalance = account.balance;
    const variance = (Math.random() - 0.5) * baseBalance * 0.15; // ±15% variance
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Math.max(0, baseBalance + variance),
      incoming: Math.random() * baseBalance * 0.1,
      outgoing: Math.random() * baseBalance * 0.08,
    };
  });

  // Last 30 days for detailed view
  const last30Days = balanceHistory.slice(-30);

  // Forecast for next 7-30 days
  const forecastDays = 30;
  const forecast = Array.from({ length: forecastDays }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    const lastBalance = balanceHistory[balanceHistory.length - 1].balance;
    const trend = (balanceHistory[balanceHistory.length - 1].balance - balanceHistory[balanceHistory.length - 30].balance) / 30;
    const projection = lastBalance + (trend * (i + 1));
    const uncertainty = projection * 0.05 * Math.sqrt(i + 1); // Increasing uncertainty
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      projected: projection,
      optimistic: projection + uncertainty,
      pessimistic: Math.max(0, projection - uncertainty),
    };
  });

  // Recent transactions
  const recentTransactions = [
    { id: 1, type: 'incoming', amount: 150000, description: 'Client Payment #1234', date: '2 hours ago' },
    { id: 2, type: 'outgoing', amount: 45000, description: 'Office Rent', date: '5 hours ago' },
    { id: 3, type: 'incoming', amount: 280000, description: 'Project Invoice #5678', date: '1 day ago' },
    { id: 4, type: 'outgoing', amount: 12000, description: 'Software Subscription', date: '2 days ago' },
    { id: 5, type: 'incoming', amount: 95000, description: 'Consulting Fee', date: '3 days ago' },
  ];

  // Calculate statistics
  const totalIncoming = last30Days.reduce((sum, day) => sum + day.incoming, 0);
  const totalOutgoing = last30Days.reduce((sum, day) => sum + day.outgoing, 0);
  const netFlow = totalIncoming - totalOutgoing;
  const avgDailyBalance = last30Days.reduce((sum, day) => sum + day.balance, 0) / last30Days.length;
  
  const balanceChange30Days = last30Days[last30Days.length - 1].balance - last30Days[0].balance;
  const balanceChangePercent = (balanceChange30Days / last30Days[0].balance) * 100;

  const formatCurrency = (amount: number, currency: string) => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ' + currency;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-900 mb-2">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, account.currency)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">{account.name}</h2>
            <p className="text-sm text-gray-600">
              {account.bank || account.type} • {account.country}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">{language === 'ru' ? 'Текущий баланс' : 'Current Balance'}</p>
              <p className="text-2xl text-blue-900 mb-1">{formatCurrency(account.balance, account.currency)}</p>
              <p className="text-xs text-blue-700">
                ≈ {formatCurrency(account.balance * exchangeRate, baseCurrency)}
              </p>
            </div>

            <div className={`rounded-xl p-4 border ${
              balanceChange30Days >= 0 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
            }`}>
              <p className="text-sm text-gray-700 mb-1">{language === 'ru' ? 'Изменение (30д)' : 'Change (30d)'}</p>
              <div className="flex items-center gap-2 mb-1">
                {balanceChange30Days >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <p className={`text-2xl ${balanceChange30Days >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {balanceChangePercent >= 0 ? '+' : ''}{balanceChangePercent.toFixed(1)}%
                </p>
              </div>
              <p className={`text-xs ${balanceChange30Days >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {balanceChange30Days >= 0 ? '+' : ''}{formatCurrency(balanceChange30Days, account.currency)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-purple-700 mb-1">{language === 'ru' ? 'Средний баланс' : 'Avg Balance'}</p>
              <p className="text-2xl text-purple-900 mb-1">{formatCurrency(avgDailyBalance, account.currency)}</p>
              <p className="text-xs text-purple-700">
                {language === 'ru' ? 'За 30 дней' : 'Last 30 days'}
              </p>
            </div>

            <div className={`rounded-xl p-4 border ${
              netFlow >= 0
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
                : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
            }`}>
              <p className="text-sm text-gray-700 mb-1">{language === 'ru' ? 'Чистый поток' : 'Net Flow'}</p>
              <p className={`text-2xl ${netFlow >= 0 ? 'text-emerald-900' : 'text-orange-900'}`}>
                {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow, account.currency)}
              </p>
              <p className={`text-xs ${netFlow >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
                {language === 'ru' ? 'За 30 дней' : 'Last 30 days'}
              </p>
            </div>
          </div>

          {/* Balance History - 30 Days */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              {language === 'ru' ? 'Динамика баланса (30 дней)' : 'Balance Dynamics (30 days)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={last30Days}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={4}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBalance)"
                  name={language === 'ru' ? 'Баланс' : 'Balance'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Incoming vs Outgoing */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
                {language === 'ru' ? 'Входящие и исходящие платежи' : 'Incoming vs Outgoing'}
              </span>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {language === 'ru' ? 'Входящие:' : 'Incoming:'} {formatCurrency(totalIncoming, account.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {language === 'ru' ? 'Исходящие:' : 'Outgoing:'} {formatCurrency(totalOutgoing, account.currency)}
                  </span>
                </div>
              </div>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={4}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="incoming" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  name={language === 'ru' ? 'Входящие' : 'Incoming'}
                />
                <Bar 
                  dataKey="outgoing" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                  name={language === 'ru' ? 'Исходящие' : 'Outgoing'}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              {language === 'ru' ? 'Прогноз остатка на 30 дней' : 'Balance Forecast (30 days)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={4}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="optimistic" 
                  stroke="none"
                  fillOpacity={1} 
                  fill="url(#colorRange)"
                  name={language === 'ru' ? 'Оптимистичный' : 'Optimistic'}
                />
                <Area 
                  type="monotone" 
                  dataKey="pessimistic" 
                  stroke="none"
                  fillOpacity={1} 
                  fill="#fff"
                  name={language === 'ru' ? 'Пессимистичный' : 'Pessimistic'}
                />
                <Area 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorProjected)"
                  name={language === 'ru' ? 'Прогноз' : 'Projected'}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-sm text-indigo-700 mt-4">
              {language === 'ru' 
                ? '* Прогноз основан на тренде последних 30 дней. Диапазон показывает возможные отклонения.'
                : '* Forecast based on last 30 days trend. Range shows possible deviations.'}
            </p>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">
              {language === 'ru' ? 'Последние операции' : 'Recent Transactions'}
            </h3>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'incoming' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'incoming' ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`text-lg ${
                    transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'incoming' ? '+' : '-'}
                    {formatCurrency(transaction.amount, account.currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Exchange Rate Info (for foreign currency accounts) */}
          {account.currency !== baseCurrency && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="text-gray-900 mb-4">
                {language === 'ru' ? 'Курсовая переоценка' : 'Currency Revaluation'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-amber-700 mb-1">
                    {language === 'ru' ? 'Текущий курс' : 'Current Rate'}
                  </p>
                  <p className="text-xl text-gray-900">
                    1 {account.currency} = {exchangeRate.toFixed(2)} {baseCurrency}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {language === 'ru' ? 'Источник: ЦБ РФ / НБК' : 'Source: CBR / NBK'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-700 mb-1">
                    {language === 'ru' ? 'Изменение за месяц' : 'Change this month'}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <p className="text-xl text-green-600">+2.3%</p>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    {language === 'ru' ? 'Выгода:' : 'Gain:'} +{formatCurrency(account.balance * 0.023, baseCurrency)}
                  </p>
                </div>
                <div className="flex items-center">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
                    {language === 'ru' ? 'Пересчитать по новому курсу' : 'Recalculate at new rate'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
