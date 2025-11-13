import { useMemo } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '../utils/LanguageContext';
import { Account } from '../api';
import { useAccountDetails } from '../hooks/useAccounts';

interface AccountDetailsProps {
  account: Account;
  exchangeRate: number;
  baseCurrency: string;
  onClose: () => void;
  primaryCurrency?: string;
}

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function AccountDetails({ account, exchangeRate, baseCurrency, onClose, primaryCurrency }: AccountDetailsProps) {
  const { language } = useLanguage();
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  const displayCurrency = primaryCurrency || baseCurrency;

  const { data: details, isLoading, isError } = useAccountDetails(account.id);

  const currentBalance = toNumber(details?.currentBalance ?? account.currentBalance);
  const balance30dAgo = toNumber(details?.balance30dAgo ?? currentBalance);
  const balanceChange30d = toNumber(details?.balanceChange30d);
  const averageBalance30d = toNumber(details?.averageBalance30d ?? currentBalance);

  const balanceChangePercent =
    balance30dAgo !== 0 ? (balanceChange30d / Math.abs(balance30dAgo)) * 100 : null;

  const balanceHistoryForChart = useMemo(() => {
    return (details?.balanceHistory30d ?? []).map((point) => {
      const date = new Date(`${point.date}T00:00:00`);
      return {
        date: date.toLocaleDateString(locale, { day: '2-digit', month: 'short' }),
        isoDate: point.date,
        balance: toNumber(point.balance),
      };
    });
  }, [details?.balanceHistory30d, locale]);

  const recentTransactions = details?.transactions ?? [];

  const formatCurrency = (amount: number | undefined | null, currency: string) => {
    const numeric = toNumber(amount);
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numeric);
    } catch {
      return `${numeric.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${currency}`;
    }
  };

  const formatShortCurrency = (amount: number) => {
    const numeric = toNumber(amount);
    if (Math.abs(numeric) >= 1_000_000) {
      return `${(numeric / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(numeric) >= 1_000) {
      return `${(numeric / 1_000).toFixed(1)}K`;
    }
    return numeric.toFixed(0);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-900 mb-2">{entry.payload.isoDate}</p>
          <p className="text-sm text-blue-600">
            {language === 'ru' ? 'Баланс' : 'Balance'}:{' '}
            {formatCurrency(entry.value, account.currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">
              {account.accountName || account.clientName || account.accountNumber}
            </h2>
            <p className="text-sm text-gray-600">
              {account.accountNumber} • {account.currency}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500">
              {language === 'ru' ? 'Загружаем данные по счёту…' : 'Loading account analytics…'}
            </p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              {language === 'ru'
                ? 'Не удалось загрузить данные по счёту. Попробуйте ещё раз позже.'
                : 'Failed to load account details. Please try again later.'}
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200/70 rounded-xl p-5 border border-blue-200 shadow-sm">
                <p className="text-sm text-blue-700 mb-1">
                  {language === 'ru' ? 'Текущий баланс' : 'Current Balance'}
                </p>
                <p className="text-2xl text-blue-900 mb-1">
                  {formatCurrency(currentBalance, account.currency)}
                </p>
                {displayCurrency !== account.currency && (
                  <p className="text-xs text-blue-700">
                    ≈ {formatCurrency(currentBalance * exchangeRate, displayCurrency)}
                  </p>
                )}
              </div>

              <div
                className={`rounded-xl p-5 border shadow-sm ${
                  balanceChange30d >= 0
                    ? 'bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200/70 border-emerald-200'
                    : 'bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200/70 border-rose-200'
                }`}
              >
                <p className="text-sm text-gray-700 mb-1">
                  {language === 'ru' ? 'Изменение (30д)' : 'Change (30d)'}
                </p>
                <div className="flex items-center gap-2 mb-1">
                  {balanceChange30d >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-rose-600" />
                  )}
                  <p
                    className={`text-2xl ${
                      balanceChange30d >= 0 ? 'text-emerald-900' : 'text-rose-900'
                    }`}
                  >
                    {balanceChange30d >= 0 ? '+' : '-'}
                    {formatCurrency(Math.abs(balanceChange30d), account.currency)}
                  </p>
                </div>
                <p
                  className={`text-xs ${
                    balanceChange30d >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {balanceChangePercent !== null
                    ? `${balanceChange30d >= 0 ? '+' : '-'}${Math.abs(balanceChangePercent).toFixed(1)}%`
                    : language === 'ru'
                    ? 'Нет данных для процента'
                    : 'No baseline for percent'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200/70 rounded-xl p-5 border border-purple-200 shadow-sm">
                <p className="text-sm text-purple-700 mb-1">
                  {language === 'ru' ? 'Баланс 30 дней назад' : 'Balance 30 days ago'}
                </p>
                <p className="text-2xl text-purple-900 mb-1">
                  {formatCurrency(balance30dAgo, account.currency)}
                </p>
                <p className="text-xs text-purple-700">
                  {language === 'ru' ? 'Расчётно' : 'Calculated'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200/70 rounded-xl p-5 border border-indigo-200 shadow-sm">
                <p className="text-sm text-indigo-700 mb-1">
                  {language === 'ru' ? 'Средний баланс' : 'Average Balance'}
                </p>
                <p className="text-2xl text-indigo-900 mb-1">
                  {formatCurrency(averageBalance30d, account.currency)}
                </p>
                <p className="text-xs text-indigo-700">
                  {language === 'ru' ? 'За последние 30 дней' : 'Last 30 days'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {language === 'ru' ? 'Динамика баланса (30 дней)' : 'Balance Dynamics (30 days)'}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={balanceHistoryForChart}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={3} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={formatShortCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                    name={language === 'ru' ? 'Баланс' : 'Balance'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 mb-4">
                {language === 'ru' ? 'Транзакции по счёту' : 'Account Transactions'}
              </h3>

              {recentTransactions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                  {language === 'ru'
                    ? 'За последние 30 дней не найдено транзакций по этому счёту.'
                    : 'No transactions found for this account in the last 30 days.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => {
                    const isIncome = transaction.transactionType === 'INCOME';
                    const amount = formatCurrency(
                      Math.abs(toNumber(transaction.amount)),
                      transaction.currency
                    );
                    const date = new Date(transaction.transactionDate).toLocaleString(locale, {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isIncome ? 'bg-emerald-100' : 'bg-rose-100'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-rose-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {date}
                              {transaction.recipientName ? ` • ${transaction.recipientName}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-medium ${
                              isIncome ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {amount}
                          </p>
                          {transaction.paymentPurpose && (
                            <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                              {transaction.paymentPurpose}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {account.currency !== displayCurrency && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
                <h3 className="text-gray-900 mb-4">
                  {language === 'ru' ? 'Курсовая переоценка' : 'Currency Revaluation'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-800">
                  <div>
                    <p className="text-amber-700 mb-1 font-medium">
                      {language === 'ru' ? 'Текущий курс' : 'Current Rate'}
                    </p>
                    <p className="text-lg text-gray-900">
                      1 {account.currency} = {exchangeRate.toFixed(4)} {displayCurrency}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-700 mb-1 font-medium">
                      {language === 'ru' ? 'Эквивалент баланса' : 'Balance Equivalent'}
                    </p>
                    <p className="text-lg text-gray-900">
                      {formatCurrency(currentBalance * exchangeRate, displayCurrency)}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <p className="text-xs text-amber-700">
                      {language === 'ru'
                        ? 'Курс предоставлен в демонстрационных целях.'
                        : 'Exchange rate shown for demonstration purposes.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
