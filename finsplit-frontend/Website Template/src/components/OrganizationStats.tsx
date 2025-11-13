import { useOrganization } from '../utils/OrganizationContext';
import { useLanguage } from '../utils/LanguageContext';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

export function OrganizationStats() {
  const { language } = useLanguage();
  const { getFilteredEntities, viewMode } = useOrganization();

  const filteredEntities = getFilteredEntities();
  
  const totalRevenue = filteredEntities.reduce((sum, entity) => sum + entity.revenue, 0);
  const totalExpenses = filteredEntities.reduce((sum, entity) => sum + entity.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Revenue */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-green-700">
            {language === 'ru' ? 'Доходы' : 'Revenue'}
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div className="text-xl text-green-900 mb-1">
          ${(totalRevenue / 1000).toFixed(0)}k
        </div>
        <div className="text-xs text-green-600">
          {filteredEntities.length} {language === 'ru' ? 'юр. лиц' : 'entities'}
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-orange-700">
            {language === 'ru' ? 'Расходы' : 'Expenses'}
          </div>
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-orange-600" />
          </div>
        </div>
        <div className="text-xl text-orange-900 mb-1">
          ${(totalExpenses / 1000).toFixed(0)}k
        </div>
        <div className="text-xs text-orange-600">
          {((totalExpenses / totalRevenue) * 100).toFixed(0)}% {language === 'ru' ? 'от доходов' : 'of revenue'}
        </div>
      </div>

      {/* Net Profit */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-blue-700">
            {language === 'ru' ? 'Чистая прибыль' : 'Net Profit'}
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className={`text-xl mb-1 ${netProfit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
          ${(netProfit / 1000).toFixed(0)}k
        </div>
        <div className={`text-xs ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {netProfit >= 0 ? '↗' : '↘'} {language === 'ru' ? 'Чистый доход' : 'Net income'}
        </div>
      </div>

      {/* Profit Margin */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-purple-700">
            {language === 'ru' ? 'Маржа' : 'Profit Margin'}
          </div>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-purple-600" />
          </div>
        </div>
        <div className="text-xl text-purple-900 mb-1">
          {profitMargin}%
        </div>
        <div className="text-xs text-purple-600">
          {language === 'ru' ? 'Рентабельность' : 'Profitability'}
        </div>
      </div>
    </div>
  );
}
