import { useState, useMemo, useEffect } from 'react';
import { UploadStatements } from './UploadStatements';
import { PricingModal } from './PricingModal';
import { TaxReportWizard } from './TaxReportWizard';
import { DashboardAnalytics } from './DashboardAnalytics';
import { CustomSelect } from './CustomSelect';
import { CreateDocumentModal } from './CreateDocumentModal';
import { FXRiskAnalysis } from './FXRiskAnalysis';
import { AccountDetails } from './AccountDetails';
import { AddAccountModal } from './AddAccountModal';
import { AccountStatementModal } from './AccountStatementModal';
import { CostAnalysis } from './CostAnalysis';
import { AIAnalytics } from './AIAnalytics';
import { InfoTooltip } from './InfoTooltip';
import { OrganizationSelector } from './OrganizationSelector';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { TransactionMatching } from './TransactionMatching';
import { DocumentUploadManager } from './DocumentUploadManager';
import { DocumentsHub } from './DocumentsHub';
import { toast } from 'sonner';
import { useLanguage } from '../utils/LanguageContext';
import { useOrganization } from '../utils/OrganizationContext';
import { useAccounts, useTransactions, useTransactionStatistics } from '../hooks';
import {
  BarChart3,
  Wallet,
  ArrowUpDown,
  Globe,
  FileText,
  Receipt,
  Bell,
  Settings,
  LogOut,
  Upload,
  TrendingUp,
  Send,
  Crown,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Filter,
  Download,
  Search,
  CreditCard,
  Building2,
  Target,
  Zap,
  Clock,
  Plus,
  FileDown,
  CheckCircle2,
  XCircle,
  Calendar,
  Eye,
  Edit,
  ArrowRightLeft,
  TrendingDown,
  PieChart,
  Users,
  Shield,
  Languages,
  Save,
  Mail,
  Star,
  RefreshCw,
  Link,
  AlertTriangle,
  Lightbulb,
  X,
  Check
} from 'lucide-react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// Mock data for multi-currency accounts
const accounts = [
  { id: 1, name: 'Business KZ (Halyk)', currency: 'KZT', balance: 5240000, country: 'KZ', color: 'from-blue-500 to-cyan-500', flag: '🇰🇿', accountNumber: 'KZ12 3456 7890 1234 5678', isPrimary: true, type: 'Business', bank: 'Halyk Bank', category: 'Revenue', lastUpdated: '2 hours ago' },
  { id: 2, name: 'Business RU (Sber)', currency: 'RUB', balance: 850000, country: 'RU', color: 'from-purple-500 to-pink-500', flag: '🇷🇺', accountNumber: '40817 810 1 2345 6789012', isPrimary: false, type: 'Business', bank: 'Sberbank', category: 'Expenses', lastUpdated: '5 hours ago' },
  { id: 3, name: 'USD Account', currency: 'USD', balance: 12500, country: 'KZ', color: 'from-green-500 to-emerald-500', flag: '🇺🇸', accountNumber: 'KZ99 8765 4321 9876 5432', isPrimary: false, type: 'Business', bank: 'Kaspi Bank', category: 'Revenue', lastUpdated: '1 hour ago' },
  { id: 4, name: 'EUR Account', currency: 'EUR', balance: 8200, country: 'GE', color: 'from-indigo-500 to-blue-500', flag: '🇪🇺', accountNumber: 'GE29 NB00 0000 0123 4567 89', isPrimary: false, type: 'Business', bank: 'TBC Bank', category: 'Reserve', lastUpdated: '3 days ago' },
];

// Exchange rates
const exchangeRates: Record<string, number> = {
  KZT: 1,
  RUB: 5.2,
  USD: 450,
  EUR: 490,
};

// Mock transactions with AI categorization and counterparty details
const transactions = [
  { 
    id: 1, 
    date: '2025-11-02', 
    description: 'Invoice Payment #INV-2845', 
    account: 'USD Account', 
    amount: 2500.00, 
    category: 'Income', 
    aiConfidence: 98, 
    country: 'KZ', 
    status: 'Completed',
    type: 'incoming',
    counterparty: {
      name: 'Tech Solutions Ltd',
      account: 'US64 SVBK 0000 0000 0001 2345',
      bank: 'Silicon Valley Bank',
      country: 'USA',
      taxId: '12-3456789'
    },
    purpose: 'Payment for web development services, Invoice INV-2845',
    reference: 'TXN-2025-11-02-001',
    fee: 25.00,
    exchangeRate: 450.5,
    tags: ['client-payment', 'development']
  },
  { 
    id: 2, 
    date: '2025-11-02', 
    description: 'AWS Cloud Services', 
    account: 'Business KZ (Halyk)', 
    amount: -45000, 
    category: 'IT Services', 
    aiConfidence: 95, 
    country: 'KZ', 
    status: 'Completed',
    type: 'outgoing',
    counterparty: {
      name: 'Amazon Web Services',
      account: 'US29 AMZN 1234 5678 9012',
      bank: 'JP Morgan Chase',
      country: 'USA',
      taxId: '91-1234567'
    },
    purpose: 'Monthly cloud hosting and infrastructure services',
    reference: 'AWS-INV-NOV-2025',
    fee: 450.00,
    exchangeRate: 450.0,
    tags: ['subscription', 'cloud']
  },
  { 
    id: 3, 
    date: '2025-11-01', 
    description: 'Salary - Development Team', 
    account: 'Business RU (Sber)', 
    amount: -320000, 
    category: 'Salaries', 
    aiConfidence: 100, 
    country: 'RU', 
    status: 'Completed',
    type: 'outgoing',
    counterparty: {
      name: 'Ivanov Ivan Petrovich',
      account: '40817 810 1 2345 6789012',
      bank: 'Sberbank',
      country: 'Russia',
      taxId: '123456789012'
    },
    purpose: 'Salary payment for October 2025',
    reference: 'SAL-OCT-2025-001',
    fee: 0.00,
    exchangeRate: 5.2,
    tags: ['payroll', 'salary']
  },
  { 
    id: 4, 
    date: '2025-11-01', 
    description: 'Office Rent November', 
    account: 'Business KZ (Halyk)', 
    amount: -250000, 
    category: 'Rent', 
    aiConfidence: 100, 
    country: 'KZ', 
    status: 'Completed',
    type: 'outgoing',
    counterparty: {
      name: 'Almaty Business Center LLP',
      account: 'KZ86 125K ZT50 0410 0100',
      bank: 'Halyk Bank',
      country: 'Kazakhstan',
      taxId: '123456789012'
    },
    purpose: 'Office rent payment for November 2025',
    reference: 'RENT-NOV-2025',
    fee: 0.00,
    exchangeRate: 1.0,
    tags: ['rent', 'recurring']
  },
  { 
    id: 5, 
    date: '2025-10-31', 
    description: 'Client Payment - Web Development', 
    account: 'USD Account', 
    amount: 5000.00, 
    category: 'Income', 
    aiConfidence: 98, 
    country: 'KZ', 
    status: 'Completed',
    type: 'incoming',
    counterparty: {
      name: 'Digital Marketing Corp',
      account: 'US89 BOFA 0000 0000 1234 5678',
      bank: 'Bank of America',
      country: 'USA',
      taxId: '98-7654321'
    },
    purpose: 'Website redesign project - Final payment',
    reference: 'DIG-INV-1045',
    fee: 50.00,
    exchangeRate: 451.2,
    tags: ['client-payment', 'project']
  },
  { 
    id: 6, 
    date: '2025-10-30', 
    description: 'Google Ads Campaign', 
    account: 'USD Account', 
    amount: -850.00, 
    category: 'Marketing', 
    aiConfidence: 92, 
    country: 'KZ', 
    status: 'Completed',
    type: 'outgoing',
    counterparty: {
      name: 'Google Ireland Limited',
      account: 'IE29 AIBK 9311 5212 3456 78',
      bank: 'AIB Bank',
      country: 'Ireland',
      taxId: 'IE6388047V'
    },
    purpose: 'Digital advertising campaign - October 2025',
    reference: 'GADS-OCT-2025',
    fee: 8.50,
    exchangeRate: 450.8,
    tags: ['marketing', 'ads']
  },
  { 
    id: 7, 
    date: '2025-10-29', 
    description: 'Internet & Telecom', 
    account: 'Business RU (Sber)', 
    amount: -12000, 
    category: 'Utilities', 
    aiConfidence: 97, 
    country: 'RU', 
    status: 'Completed',
    type: 'outgoing',
    counterparty: {
      name: 'Rostelecom PJSC',
      account: '40702 810 1 0000 1234567',
      bank: 'VTB Bank',
      country: 'Russia',
      taxId: '7707049388'
    },
    purpose: 'Internet and telephone services - October 2025',
    reference: 'RT-OCT-2025',
    fee: 0.00,
    exchangeRate: 5.2,
    tags: ['utilities', 'recurring']
  },
  { 
    id: 8, 
    date: '2025-10-28', 
    description: 'Software Licenses', 
    account: 'EUR Account', 
    amount: -450.00, 
    category: 'IT Services', 
    aiConfidence: 95, 
    country: 'GE', 
    status: 'Completed',
    type: 'outgoing',
    counterparty: {
      name: 'Microsoft Ireland Operations',
      account: 'IE64 BOFI 9000 0112 3456 78',
      bank: 'Bank of Ireland',
      country: 'Ireland',
      taxId: 'IE9805942B'
    },
    purpose: 'Office 365 Business Premium - Annual subscription',
    reference: 'MS-LIC-2025-001',
    fee: 4.50,
    exchangeRate: 490.0,
    tags: ['software', 'subscription']
  },
  { 
    id: 9, 
    date: '2025-10-27', 
    description: 'Freelance Payment - Design', 
    account: 'USD Account', 
    amount: -1200.00, 
    category: 'Contractor', 
    aiConfidence: 94, 
    country: 'KZ', 
    status: 'Pending',
    type: 'outgoing',
    counterparty: {
      name: 'Anna Petrova (Freelancer)',
      account: 'GE29 NB00 0000 0123 4567 89',
      bank: 'TBC Bank',
      country: 'Georgia',
      taxId: '01234567890'
    },
    purpose: 'UI/UX design services for mobile app',
    reference: 'FRL-DES-2025-10',
    fee: 12.00,
    exchangeRate: 451.5,
    tags: ['freelance', 'design']
  },
  { 
    id: 10, 
    date: '2025-10-25', 
    description: 'Consulting Fee', 
    account: 'EUR Account', 
    amount: 3500.00, 
    category: 'Income', 
    aiConfidence: 99, 
    country: 'GE', 
    status: 'Completed',
    type: 'incoming',
    counterparty: {
      name: 'Enterprise Solutions GmbH',
      account: 'DE89 3704 0044 0532 0130 00',
      bank: 'Commerzbank',
      country: 'Germany',
      taxId: 'DE123456789'
    },
    purpose: 'Business consulting services - September 2025',
    reference: 'CONS-SEP-2025',
    fee: 35.00,
    exchangeRate: 489.5,
    tags: ['consulting', 'client-payment']
  },
];

// Tax reports data
const taxReports = [
  { id: 1, country: 'KZ', form: '910.00', period: 'Q3 2025', status: 'Filed', dueDate: '2025-10-20', filedDate: '2025-10-18', flag: '🇰🇿' },
  { id: 2, country: 'KZ', form: '240.00', period: 'October 2025', status: 'Draft', dueDate: '2025-11-15', filedDate: null, flag: '🇰🇿' },
  { id: 3, country: 'RU', form: 'УСН', period: 'Q3 2025', status: 'Filed', dueDate: '2025-10-25', filedDate: '2025-10-24', flag: '🇷🇺' },
  { id: 4, country: 'RU', form: '3-НДФЛ', period: '2024', status: 'Pending', dueDate: '2025-04-30', filedDate: null, flag: '🇷🇺' },
];

// Currency operations data
const currencyOps = [
  { id: 1, date: '2025-11-01', from: 'USD', to: 'KZT', amount: 5000, rate: 450.5, total: 2252500, status: 'Completed', purpose: 'Operational expenses' },
  { id: 2, date: '2025-10-28', from: 'EUR', to: 'USD', amount: 2000, rate: 1.09, total: 2180, status: 'Completed', purpose: 'International payment' },
  { id: 3, date: '2025-10-25', from: 'KZT', to: 'USD', amount: 1000000, rate: 451.2, total: 2216, status: 'Pending', purpose: 'Supplier payment' },
];

// Documents data
const documents = [
  { id: 1, type: 'Invoice', number: 'INV-2845', date: '2025-11-02', client: 'Tech Solutions Ltd', amount: 2500, currency: 'USD', status: 'Paid' },
  { id: 2, type: 'Act', number: 'ACT-891', date: '2025-11-01', client: 'Digital Corp', amount: 850000, currency: 'RUB', status: 'Signed' },
  { id: 3, type: 'Invoice', number: 'INV-2844', date: '2025-10-28', client: 'StartUp Inc', amount: 3200, currency: 'USD', status: 'Sent' },
  { id: 4, type: 'Contract', number: 'CNT-102', date: '2025-10-15', client: 'Enterprise LLC', amount: 15000, currency: 'EUR', status: 'Signed' },
];

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

// AI Analytics data
const aiAnalytics = {
  categorization: 95,
  recommendations: [
    { id: 1, type: 'cost-saving', title: 'Optimize cloud services', description: 'Switch to annual billing to save $450/year', impact: '+$450/year' },
    { id: 2, type: 'tax', title: 'Tax deadline approaching', description: 'Form 240.00 due Nov 15', impact: 'Urgent' },
    { id: 3, type: 'fx', title: 'Favorable exchange rate', description: 'Convert USD to KZT now, rate improved by 2%', impact: '+$100 savings' },
  ],
  expensesByCategory: [
    { category: 'Salaries', amount: 320000, percentage: 45, color: 'bg-blue-500' },
    { category: 'Rent', amount: 250000, percentage: 35, color: 'bg-purple-500' },
    { category: 'IT Services', amount: 95000, percentage: 13, color: 'bg-green-500' },
    { category: 'Marketing', amount: 50000, percentage: 7, color: 'bg-amber-500' },
  ]
};

// Detected anomalies for AI Analytics
const detectedAnomalies = [
  { 
    type: 'unusual', 
    category: 'IT Services', 
    amount: 12500, 
    date: 'Nov 15', 
    percentageAboveAvg: 285,
    description: 'Unusual expense detected'
  },
  { 
    type: 'spike', 
    category: 'Marketing', 
    amount: 8900, 
    date: 'Nov 8', 
    percentageAboveAvg: 45,
    description: 'Spending spike'
  },
];

// Smart recommendations for AI Analytics
const smartRecommendations = [
  {
    id: 1,
    type: 'currency',
    priority: 'high',
    title: 'Diversify Currency Risk',
    description: 'Consider moving 30% of USD funds to EUR',
    potentialSaving: 0,
    icon: 'globe'
  },
  {
    id: 2,
    type: 'tax',
    priority: 'urgent',
    title: 'Tax Deadline Approaching',
    description: 'KZ IP tax declaration due in 5 days',
    potentialSaving: 0,
    icon: 'alert'
  },
  {
    id: 3,
    type: 'optimization',
    priority: 'medium',
    title: 'Optimize Subscriptions',
    description: '₸12,500 in recurring payments could be reduced',
    potentialSaving: 26,
    icon: 'lightbulb'
  },
];

// Initial notifications data
const initialNotifications = [
  { id: 1, type: 'tax', title: 'Tax deadline approaching', message: 'Form 240.00 due in 12 days', date: '2025-11-03', read: false, icon: FileText, priority: 'high' },
  { id: 2, type: 'fx', title: 'Exchange rate alert', message: 'USD/KZT rate improved by 2%', date: '2025-11-02', read: false, icon: TrendingUp, priority: 'medium' },
  { id: 3, type: 'transaction', title: 'Large transaction detected', message: 'Salary payment processed: 320,000 RUB', date: '2025-11-01', read: false, icon: DollarSign, priority: 'low' },
  { id: 4, type: 'system', title: 'Statement uploaded', message: 'Halyk Bank statement imported successfully', date: '2025-10-31', read: true, icon: CheckCircle2, priority: 'low' },
  { id: 5, type: 'alert', title: 'Unusual expense detected', message: 'Marketing expenses 285% above average', date: '2025-10-30', read: true, icon: AlertTriangle, priority: 'high' },
  { id: 6, type: 'fx', title: 'Currency risk alert', message: 'USD/RUB volatility increased by 15%', date: '2025-10-29', read: true, icon: Globe, priority: 'medium' },
  { id: 7, type: 'system', title: 'New account connected', message: 'TBC Bank account successfully linked', date: '2025-10-28', read: true, icon: CheckCircle2, priority: 'low' },
  { id: 8, type: 'tax', title: 'Tax report generated', message: 'Q3 2025 tax report ready for review', date: '2025-10-27', read: true, icon: FileText, priority: 'medium' },
];

interface DashboardProps {
  onLogout: () => void;
  isDemo?: boolean;
}

export function Dashboard({ onLogout, isDemo = false }: DashboardProps) {
  // Читаем активную секцию из URL
  const getInitialSection = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'dashboard';
  };
  
  const [activeSection, setActiveSection] = useState(getInitialSection());
  
  // Синхронизируем activeSection с URL
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.location.hash = section;
  };
  
  // Слушаем изменения hash в URL (например, при нажатии кнопки "назад")
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash); // Здесь можно setActiveSection, т.к. hash уже изменился
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showTaxWizard, setShowTaxWizard] = useState(false);
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAccountStatement, setShowAccountStatement] = useState(false);

  // Фильтры для транзакций (должны быть объявлены ДО использования)
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [transactionStatus, setTransactionStatus] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Комментарии к транзакциям
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showingCommentId, setShowingCommentId] = useState<string | null>(null);

  // API hooks - только для реального режима (не demo)
  const { data: accountsData, isLoading: isLoadingAccounts } = useAccounts();
  
  // Передаем фильтры в API запрос
  const transactionFilters = {
    accountId: selectedAccountId !== 'all' ? selectedAccountId : undefined,
    transactionType: transactionType !== 'all' ? 
      (transactionType === 'incoming' ? 'INCOME' : 
       transactionType === 'outgoing' ? 'EXPENSE' : 
       'TRANSFER') : undefined,
    status: transactionStatus !== 'all' ? transactionStatus : undefined,
    currency: selectedCurrency ? selectedCurrency : undefined,
  };
  
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactions(
    0, 
    100, 
    'transactionDate,desc',
    transactionFilters
  );
  const { data: statistics, isLoading: isLoadingStats } = useTransactionStatistics();
  
  console.log('Dashboard loaded:', { isDemo, accountsData, transactionsData, statistics });

  // Общие суммы из API (по ВСЕМ транзакциям)
  const totalIncome = transactionsData?.totalIncome || statistics?.totalIncome || 0;
  const totalExpenses = transactionsData?.totalExpenses || statistics?.totalExpenses || 0;
  const totalBalance = transactionsData?.balance || statistics?.balance || 0;

  // Вычисление месячных доходов и расходов из транзакций ТЕКУЩЕЙ СТРАНИЦЫ
  const monthlyStats = useMemo(() => {
    // Для demo режима возвращаем mock данные
    if (isDemo) {
      return { income: 10700, expenses: 8450 };
    }

    if (!transactionsData?.content || transactionsData.content.length === 0) {
      console.log('No transactions data for monthly stats');
      return { income: 0, expenses: 0 };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    console.log('Calculating monthly stats from transactions:', transactionsData.content.length);
    console.log('Total from API - Income:', totalIncome, 'Expenses:', totalExpenses, 'Balance:', totalBalance);

    const monthlyTransactions = transactionsData.content.filter(tx => {
      const txDate = new Date(tx.transactionDate);
      const isCurrentMonth = txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      if (isCurrentMonth) {
        console.log('Monthly transaction:', tx.description, tx.amount, tx.transactionType);
      }
      return isCurrentMonth;
    });

    console.log('Monthly transactions count:', monthlyTransactions.length);

    const income = monthlyTransactions
      .filter(tx => tx.transactionType === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = monthlyTransactions
      .filter(tx => tx.transactionType === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);

    console.log('Monthly stats:', { income, expenses, monthlyTransactionsCount: monthlyTransactions.length });

    return { income, expenses };
  }, [transactionsData, isDemo, totalIncome, totalExpenses, totalBalance]);
  
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  
  // Используем реальные данные из API или fallback на mock для demo режима
  const accountsList = isDemo ? accounts : (accountsData || []);
  const transactionsList = isDemo ? transactions : (transactionsData?.content || []);
  const [primaryAccountCurrency, setPrimaryAccountCurrency] = useState<string>('RUB');
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [fxFrom, setFxFrom] = useState('USD');
  const [fxTo, setFxTo] = useState('KZT');
  const [fxAmount, setFxAmount] = useState('1000');
  const [selectedTaxCountry, setSelectedTaxCountry] = useState('KZ');
  const [showNotifications, setShowNotifications] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState('RUB');
  const [periodFilter, setPeriodFilter] = useState('last30days');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { language, setLanguage, t } = useLanguage();
  const { 
    getFilteredEntities, 
    viewMode, 
    selectedEntity, 
    selectedHolding,
    legalEntities 
  } = useOrganization();
  
  // Transaction filters and sorting
  const [transactionCounterparty, setTransactionCounterparty] = useState<string>('');
  const [transactionSort, setTransactionSort] = useState<'date' | 'amount' | 'counterparty'>('date');
  const [transactionSortOrder, setTransactionSortOrder] = useState<'asc' | 'desc'>('desc');
  const [transactionAmountMin, setTransactionAmountMin] = useState<string>('');
  const [transactionAmountMax, setTransactionAmountMax] = useState<string>('');
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [transactionDocuments, setTransactionDocuments] = useState<Record<number, any[]>>({
    // Тестовые документы для демонстрации
    1: [
      {
        id: 'test-doc-1',
        fileName: 'invoice_aws_november.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date().toISOString(),
        extractedData: {
          amount: 45000,
          date: '2025-11-02',
          vendor: 'Amazon Web Services',
          invoiceNumber: 'AWS-INV-NOV-2025',
          confidence: 95
        }
      },
      {
        id: 'test-doc-2',
        fileName: 'receipt_aws.jpg',
        fileType: 'image/jpeg',
        uploadDate: new Date().toISOString(),
        extractedData: {
          amount: 45000,
          date: '2025-11-02',
          vendor: 'AWS',
          confidence: 88
        }
      }
    ],
    3: [
      {
        id: 'test-doc-3',
        fileName: 'rent_invoice_november.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date().toISOString(),
        extractedData: {
          amount: 250000,
          date: '2025-11-01',
          vendor: 'Almaty Business Center',
          invoiceNumber: 'RENT-NOV-2025',
          confidence: 98
        }
      }
    ]
  });

  const sections = [
    { id: 'dashboard', name: t('nav.cashflow'), icon: BarChart3 },
    { id: 'accounts', name: t('nav.accounts'), icon: Wallet },
    { id: 'transactions', name: t('nav.transactions'), icon: ArrowUpDown },
    { id: 'matching', name: language === 'ru' ? 'Мэтчинг транзакций' : 'Transaction Matching', icon: ArrowRightLeft },
    { id: 'currency', name: t('nav.fxcontrol'), icon: Globe },
    { id: 'taxes', name: t('nav.taxes'), icon: FileText },
    { id: 'documents', name: t('nav.documents'), icon: Receipt },
    { id: 'costs', name: language === 'ru' ? 'Расходы и потери' : 'Costs & Losses', icon: TrendingDown },
    { id: 'analytics', name: 'AI Analytics', icon: PieChart },
    { id: 'notifications', name: t('nav.alerts'), icon: Bell },
    { id: 'settings', name: t('nav.settings'), icon: Settings },
  ];

  // Filter accounts by selected organization
  const filteredAccounts = (() => {
    // Для реальных данных из API - просто возвращаем все счета
    if (!isDemo) {
      return accountsList;
    }
    
    // Для demo режима - фильтрация по организациям
    if (viewMode === 'all') {
      return accountsList;
    }
    
    const filteredEntities = getFilteredEntities();
    const allowedAccountIds = new Set<number>();
    
    filteredEntities.forEach((entity: any) => {
      entity.accounts?.forEach((accountId: any) => {
        const numId = typeof accountId === 'string' ? parseInt(accountId, 10) : accountId;
        allowedAccountIds.add(numId);
      });
    });
    
    if (allowedAccountIds.size === 0) {
      return accountsList;
    }
    
    return accountsList.filter((account: any) => allowedAccountIds.has(account.id));
  })();

  // Calculate total balance in KZT using filtered accounts
  const totalBalanceKZT = filteredAccounts.reduce((sum: number, acc: any) => {
    if (isDemo) {
      return sum + (acc.balance * (exchangeRates[acc.currency] || 1));
    } else {
      // Для реальных данных используем currentBalance
      return sum + (acc.currentBalance || 0);
    }
  }, 0);

  // Filter and sort transactions
  const filteredTransactions = transactionsList
    .filter(t => {
      // Для реальных данных из API - фильтрация уже произошла на бэкенде
      if (!isDemo) {
        // Только фильтр по категории (пока не реализован на бэкенде)
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        return true;
      }
      
      // Для demo режима (старая логика)
      const account = filteredAccounts.find((a: any) => a.name === (t as any).account);
      if (!account) return false;
      
      if (selectedCountry && (t as any).country !== selectedCountry) return false;
      const accountCurrency = accounts.find((a: any) => a.name === (t as any).account)?.currency;
      if (selectedCurrency && accountCurrency !== selectedCurrency) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      
      if (transactionType !== 'all' && (t as any).type !== transactionType) return false;
      if (transactionStatus !== 'all' && (t as any).status !== transactionStatus) return false;
      
      // Search in description and counterparty
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesDescription = t.description.toLowerCase().includes(query);
        const matchesCounterparty = t.counterparty?.name.toLowerCase().includes(query);
        const matchesPurpose = t.purpose?.toLowerCase().includes(query);
        const matchesReference = t.reference?.toLowerCase().includes(query);
        if (!matchesDescription && !matchesCounterparty && !matchesPurpose && !matchesReference) return false;
      }
      
      // Counterparty filter
      if (transactionCounterparty && !t.counterparty?.name.toLowerCase().includes(transactionCounterparty.toLowerCase())) {
        return false;
      }
      
      // Amount range filter
      const absAmount = Math.abs(t.amount);
      if (transactionAmountMin && absAmount < parseFloat(transactionAmountMin)) return false;
      if (transactionAmountMax && absAmount > parseFloat(transactionAmountMax)) return false;
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (transactionSort) {
        case 'date':
          const dateA = isDemo ? new Date((a as any).date) : new Date(a.transactionDate);
          const dateB = isDemo ? new Date((b as any).date) : new Date(b.transactionDate);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'counterparty':
          const nameA = isDemo ? ((a as any).counterparty?.name || '') : (a.recipientName || '');
          const nameB = isDemo ? ((b as any).counterparty?.name || '') : (b.recipientName || '');
          comparison = nameA.localeCompare(nameB);
          break;
      }
      
      return transactionSortOrder === 'asc' ? comparison : -comparison;
    });

  // Exchange rates (base: KZT)
  const currencyRates: Record<string, number> = {
    'KZT': 1,
    'USD': 480,
    'EUR': 520,
    'RUB': 5.2,
  };

  // Convert amount to display currency
  const convertToDisplayCurrency = (amount: number, fromCurrency: string): number => {
    // First convert to KZT
    const amountInKZT = amount * (exchangeRates[fromCurrency] || 1);
    // Then convert to display currency
    return amountInKZT / currencyRates[displayCurrency];
  };

  const formatCurrency = (amount: number | undefined | null, currency: string) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return `0 ${currency}`;
    }
    const absAmount = Math.abs(amount);
    if (currency === 'KZT' || currency === 'RUB') {
      return `${absAmount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
    }
    return `${absAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };
  
  const formatDisplayCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (displayCurrency === 'KZT' || displayCurrency === 'RUB') {
      return `${absAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${displayCurrency}`;
    }
    return `${absAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${displayCurrency}`;
  };

  const calculateFX = () => {
    const amount = parseFloat(fxAmount);
    const rate = fxFrom === 'USD' && fxTo === 'KZT' ? 450.5 :
                  fxFrom === 'EUR' && fxTo === 'USD' ? 1.09 :
                  fxFrom === 'KZT' && fxTo === 'USD' ? 0.0022 : 1;
    const result = amount * rate;
    toast.success(`${amount} ${fxFrom} = ${result.toFixed(2)} ${fxTo} (Rate: ${rate})`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Filed': return 'text-green-600 bg-green-100';
      case 'Draft': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-amber-600 bg-amber-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Sent': return 'text-blue-600 bg-blue-100';
      case 'Signed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSaveTransaction = (updatedTransaction: any) => {
    setTransactionsList(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  // Loading screen при первой загрузке данных (не demo)
  if (!isDemo && (isLoadingAccounts || isLoadingStats)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'ru' ? 'Загрузка данных...' : 'Loading data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl text-gray-900">{language === 'ru' ? 'ФинСплит' : 'FinSplit'}</h1>
                {isDemo && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
                    {t('auth.demoMode')}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isDemo 
                  ? t('auth.demoSubtitle') 
                  : (language === 'ru' ? 'Международный бизнес' : 'International Business')
                }
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const unreadCount = section.id === 'notifications' ? notifications.filter(n => !n.read).length : 0;
            return (
              <button
                key={section.id}
                onClick={() => {
                  handleSectionChange(section.id);
                  setShowNotifications(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left group relative ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeSection === section.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="text-sm">{section.name}</span>
                {unreadCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
                {activeSection === section.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-blue-700">{language === 'ru' ? 'Тариф' : 'Plan'}</span>
              <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-md">
                <Crown className="w-3 h-3" />
                PRO
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {language === 'ru' ? '3 юрисдикции активны' : '3 jurisdictions active'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all flex items-center gap-3 text-sm group"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-gray-900 flex items-center gap-2">
                {sections.find(s => s.id === activeSection)?.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeSection === 'dashboard' && t('dashboard.subtitle')}
                {activeSection === 'accounts' && t('accounts.subtitle')}
                {activeSection === 'transactions' && t('transactions.subtitle')}
                {activeSection === 'matching' && (language === 'ru' ? 'Сопоставление переводов между счетами в разных странах' : 'Match transfers between accounts in different countries')}
                {activeSection === 'currency' && t('currency.subtitle')}
                {activeSection === 'taxes' && t('taxes.subtitle')}
                {activeSection === 'documents' && t('documents.subtitle')}
                {activeSection === 'costs' && (language === 'ru' ? 'Аналитика налогов, комиссий и финансовых потерь' : 'Analysis of taxes, fees and financial losses')}
                {activeSection === 'analytics' && (language === 'ru' ? 'AI-аналитика и рекомендации' : 'AI analytics and recommendations')}
                {activeSection === 'notifications' && (language === 'ru' ? 'Уведомления и оповещения' : 'Notifications and alerts')}
                {activeSection === 'settings' && t('settings.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Display Currency Filter */}
              {activeSection === 'dashboard' && (
                <>
                  <CustomSelect
                    value={displayCurrency}
                    onChange={(value) => {
                      setDisplayCurrency(value);
                      toast.success(language === 'ru' 
                        ? `Валюта отображения: ${value}` 
                        : `Display currency: ${value}`
                      );
                    }}
                    options={[
                      { value: 'USD', label: 'USD 💵', icon: <DollarSign className="w-4 h-4" /> },
                      { value: 'EUR', label: 'EUR 💶', icon: <DollarSign className="w-4 h-4" /> },
                      { value: 'KZT', label: 'KZT 🇰🇿', icon: <DollarSign className="w-4 h-4" /> },
                      { value: 'RUB', label: 'RUB 🇷🇺', icon: <DollarSign className="w-4 h-4" /> },
                    ]}
                    icon={<DollarSign className="w-4 h-4" />}
                  />

                  {/* Period Filter */}
                  <CustomSelect
                    value={periodFilter}
                    onChange={(value) => {
                      setPeriodFilter(value);
                      toast.success(language === 'ru' 
                        ? `Период: ${t('filters.' + value)}` 
                        : `Period: ${t('filters.' + value)}`
                      );
                    }}
                    options={[
                      { value: 'last7days', label: t('filters.last7days') },
                      { value: 'last30days', label: t('filters.last30days') },
                      { value: 'last90days', label: t('filters.last90days') },
                      { value: 'thisMonth', label: t('filters.thisMonth') },
                      { value: 'lastMonth', label: t('filters.lastMonth') },
                      { value: 'thisQuarter', label: t('filters.thisQuarter') },
                      { value: 'thisYear', label: t('filters.thisYear') },
                    ]}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </>
              )}

              {/* Notifications Bell */}
              <button
                onClick={() => handleSectionChange('notifications')}
                className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              <CustomSelect
                value={language}
                onChange={(value) => {
                  const newLang = value as 'en' | 'ru';
                  setLanguage(newLang);
                  toast.success(t('language.changed'));
                }}
                options={[
                  { value: 'en', label: '🇬🇧 English' },
                  { value: 'ru', label: '🇷🇺 Русский' },
                ]}
                icon={<Languages className="w-4 h-4" />}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                <span className="text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Organization Selector */}
              <OrganizationSelector compact={true} />
              
              {/* Total Income/Expenses Cards (from ALL transactions) */}
              {!isDemo && transactionsData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-4">
                    <p className="text-sm text-green-700 mb-1">{language === 'ru' ? 'Всего доходов' : 'Total Income'}</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(totalIncome, statistics?.currency || 'RUB')}</p>
                    <p className="text-xs text-green-600">{language === 'ru' ? 'За всё время' : 'All time'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 p-4">
                    <p className="text-sm text-red-700 mb-1">{language === 'ru' ? 'Всего расходов' : 'Total Expenses'}</p>
                    <p className="text-2xl font-bold text-red-900">{formatCurrency(totalExpenses, statistics?.currency || 'RUB')}</p>
                    <p className="text-xs text-red-600">{language === 'ru' ? 'За всё время' : 'All time'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-4">
                    <p className="text-sm text-blue-700 mb-1">{language === 'ru' ? 'Чистый баланс' : 'Net Balance'}</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalBalance, statistics?.currency || 'RUB')}</p>
                    <p className="text-xs text-blue-600">{language === 'ru' ? 'Доходы - Расходы' : 'Income - Expenses'}</p>
                  </div>
                </div>
              )}
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-blue-100">{t('dashboard.totalBalance')}</p>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl mb-1">
                    {isLoadingStats ? '...' : formatCurrency(totalBalance, statistics?.currency || 'RUB')}
                  </p>
                  <p className="text-sm text-blue-100">{language === 'ru' ? 'Общий баланс' : 'Total Balance'}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">{t('dashboard.monthlyIncome')}</p>
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">
                    {isLoadingTransactions ? '...' : formatCurrency(monthlyStats.income, statistics?.currency || 'RUB')}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {language === 'ru' ? 'за текущий месяц' : 'current month'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">{t('dashboard.monthlyExpenses')}</p>
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">
                    {isLoadingTransactions ? '...' : formatCurrency(monthlyStats.expenses, statistics?.currency || 'RUB')}
                  </p>
                  <p className="text-sm text-orange-600 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {language === 'ru' ? 'за текущий месяц' : 'current month'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">{t('dashboard.pendingTasks')}</p>
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl text-gray-900 mb-1">0</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'ru' ? 'Дедлайн: 15 ноя' : 'Tax deadline: Nov 15'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  {t('quickActions.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex flex-col items-start gap-3 p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                      <Upload className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900 mb-1">{t('quickActions.uploadStatement')}</p>
                      <p className="text-xs text-gray-500">{t('quickActions.uploadSubtitle')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowTaxWizard(true)}
                    className="flex flex-col items-start gap-3 p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-all">
                      <FileText className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900 mb-1">{t('quickActions.generateReport')}</p>
                      <p className="text-xs text-gray-500">{t('quickActions.reportSubtitle')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => toast.info(t('quickActions.transferComingSoon'))}
                    className="flex flex-col items-start gap-3 p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-all">
                      <Send className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900 mb-1">{t('quickActions.transferMoney')}</p>
                      <p className="text-xs text-gray-500">{t('quickActions.transferSubtitle')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="flex flex-col items-start gap-3 p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-600 hover:bg-amber-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-600 transition-all">
                      <Crown className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900 mb-1">{t('quickActions.upgradePlan')}</p>
                      <p className="text-xs text-gray-500">{t('quickActions.upgradeSubtitle')}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Accounts Overview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    {t('accounts.title')}
                  </h3>
                  <button
                    onClick={() => handleSectionChange('accounts')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {t('dashboard.viewAll')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {isLoadingAccounts ? (
                    <div className="col-span-4 text-center py-8 text-gray-500">
                      {language === 'ru' ? 'Загрузка счетов...' : 'Loading accounts...'}
                    </div>
                  ) : accountsList.length === 0 ? (
                    <div className="col-span-4 text-center py-8">
                      <p className="text-gray-500 mb-4">
                        {language === 'ru' ? 'Нет счетов. Загрузите банковскую выписку.' : 'No accounts yet. Upload a bank statement.'}
                      </p>
                      <button
                        onClick={() => handleSectionChange('upload')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        {language === 'ru' ? 'Загрузить выписку' : 'Upload Statement'}
                      </button>
                    </div>
                  ) : (
                    accountsList.map((account, index) => {
                      // Цветовая схема для реальных счетов
                      const colors = [
                        'from-blue-500 to-cyan-500',
                        'from-purple-500 to-pink-500',
                        'from-green-500 to-emerald-500',
                        'from-indigo-500 to-blue-500',
                        'from-amber-500 to-orange-500',
                        'from-red-500 to-rose-500'
                      ];
                      const accountColor = colors[index % colors.length];
                      const accountName = account.accountName || account.clientName || account.accountNumber;
                      const accountBalance = account.currentBalance || 0;

                      return (
                        <div
                          key={account.id}
                          onClick={() => {
                            // Toggle filter: if same currency selected, reset filter
                            if (selectedCurrency === account.currency && activeSection === 'transactions') {
                              setSelectedCurrency(null);
                              toast.info(language === 'ru' 
                                ? `Показаны все транзакции` 
                                : `Showing all transactions`
                              );
                            } else {
                              setSelectedCurrency(account.currency);
                              handleSectionChange('transactions');
                              toast.info(language === 'ru' 
                                ? `Показ операций для ${accountName}` 
                                : `Showing transactions for ${accountName}`
                              );
                            }
                          }}
                          className={`bg-gradient-to-br ${accountColor} rounded-xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group relative ${
                            selectedCurrency === account.currency && activeSection === 'transactions' ? 'ring-4 ring-white ring-offset-2' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                              {account.currency === 'RUB' ? '🇷🇺' : account.currency === 'USD' ? '🇺🇸' : account.currency === 'EUR' ? '🇪🇺' : account.currency === 'KZT' ? '🇰🇿' : '💰'}
                            </span>
                            <div className="flex items-center gap-2">
                              {selectedCurrency === account.currency && activeSection === 'transactions' && (
                                <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                              )}
                              <Building2 className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                          <p className="text-sm text-white/80 mb-2 group-hover:text-white transition-colors truncate">{accountName}</p>
                          <p className="text-2xl mb-1 group-hover:scale-105 transition-transform">{formatCurrency(accountBalance, account.currency)}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-white/70 group-hover:text-white/90 transition-colors flex items-center gap-1">
                              {account.currency}
                              {account.latestBalanceDate && (
                                <span className="text-white/60">
                                  • {new Date(account.latestBalanceDate).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { day: '2-digit', month: '2-digit' })}
                                </span>
                              )}
                            </p>
                            {selectedCurrency === account.currency && activeSection === 'transactions' ? (
                              <span className="text-xs text-white/90">✓</span>
                            ) : (
                              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900 flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5 text-blue-600" />
                    {t('dashboard.recentTransactions')}
                  </h3>
                  <button
                    onClick={() => handleSectionChange('transactions')}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all hover:gap-2"
                  >
                    {t('dashboard.viewAll')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {isLoadingTransactions ? (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'ru' ? 'Загрузка транзакций...' : 'Loading transactions...'}
                    </div>
                  ) : transactionsList.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {language === 'ru' ? 'Нет транзакций' : 'No transactions yet'}
                      </p>
                    </div>
                  ) : (
                    transactionsList.slice(0, 5).map((transaction) => {
                      const isIncome = transaction.transactionType === 'INCOME';
                      const displayAmount = isIncome ? transaction.amount : -transaction.amount;
                      
                      return (
                        <div
                          key={transaction.id}
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionDetails(true);
                          }}
                          className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                              isIncome ? 'bg-green-100 group-hover:bg-green-200' : 'bg-red-100 group-hover:bg-red-200'
                            }`}>
                              {isIncome ? (
                                <TrendingUp className="w-6 h-6 text-green-600" />
                              ) : (
                                <TrendingDown className="w-6 h-6 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                {transaction.description || transaction.paymentPurpose || 'No description'}
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {transaction.recipientName && (
                                  <>
                                    <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors truncate max-w-[200px]">
                                      {transaction.recipientName}
                                    </p>
                                    <span className="text-xs text-gray-400">•</span>
                                  </>
                                )}
                                <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                                  {transaction.category || transaction.transactionType}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                              {isIncome ? '+' : '-'}
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.transactionDate).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Analytics Widgets */}
              <DashboardAnalytics 
                onNavigate={(section) => handleSectionChange(section)}
                onFilterCategory={(category) => setSelectedCategory(category)}
                onFilterCurrency={(currency) => setSelectedCurrency(currency)}
                displayCurrency={displayCurrency}
                periodFilter={periodFilter}
              />
            </div>
          )}

          {/* Accounts Section */}
          {activeSection === 'accounts' && (
            <div className="space-y-6">
              {accountsList.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">
                    {language === 'ru' ? 'Нет подключённых счетов' : 'No connected accounts'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {language === 'ru' 
                      ? '💡 Добавьте первый счёт, чтобы видеть свои финансы в одном месте.'
                      : '💡 Add your first account to see your finances in one place.'}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowAddAccount(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Link className="w-5 h-5" />
                      {language === 'ru' ? 'Подключить банк' : 'Connect Bank'}
                    </button>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      {language === 'ru' ? 'Импорт выписки' : 'Import Statement'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm text-blue-700 mb-1">
                        {language === 'ru' ? 'Всего средств' : 'Total Funds'}
                      </p>
                      {primaryAccountCurrency ? (
                        <>
                          <p className="text-2xl text-blue-900 mb-1">
                            {formatCurrency(totalBalanceKZT / (exchangeRates[primaryAccountCurrency] || 1), primaryAccountCurrency)}
                          </p>
                          <p className="text-xs text-blue-700">
                            {language === 'ru' ? 'В основной валюте' : 'In primary currency'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl text-blue-900 mb-1">
                            {formatCurrency(totalBalanceKZT, 'KZT')}
                          </p>
                          <p className="text-xs text-blue-700">
                            ≈ {formatCurrency(totalBalanceKZT / (exchangeRates[displayCurrency] || 1), displayCurrency)}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <p className="text-sm text-purple-700 mb-1">
                        {language === 'ru' ? 'Активные счета' : 'Active Accounts'}
                      </p>
                      <p className="text-2xl text-purple-900">{accountsList.length}</p>
                      <p className="text-xs text-purple-700">
                        {accountsList.filter(a => a.isPrimary).length} {language === 'ru' ? 'основных' : 'primary'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <p className="text-sm text-green-700 mb-1">
                        {language === 'ru' ? 'Стран/юрисдикций' : 'Countries/Jurisdictions'}
                      </p>
                      <p className="text-2xl text-green-900">
                        {new Set(accountsList.map(a => a.country)).size}
                      </p>
                      <p className="text-xs text-green-700">
                        {Array.from(new Set(accountsList.map(a => a.flag))).join(' ')}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                      <p className="text-sm text-amber-700 mb-1">
                        {language === 'ru' ? 'Валют' : 'Currencies'}
                      </p>
                      <p className="text-2xl text-amber-900">
                        {new Set(accountsList.map(a => a.currency)).size}
                      </p>
                      <p className="text-xs text-amber-700">
                        {Array.from(new Set(accountsList.map(a => a.currency))).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Primary Currency Selection */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            {language === 'ru' ? 'Основная валюта' : 'Primary Currency'}
                            <InfoTooltip text={language === 'ru' ? 'Основная валюта используется для отображения всех сумм в разделах аналитики, налогов и FX контроля' : 'Primary currency is used to display all amounts in analytics, taxes, and FX control sections'} />
                          </div>
                          <p className="text-xs text-blue-700">
                            {language === 'ru' ? 'Используется для аналитики и отчётов' : 'Used for analytics and reports'}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <select
                          value={primaryAccountCurrency}
                          onChange={(e) => {
                            setPrimaryAccountCurrency(e.target.value);
                            toast.success(
                              language === 'ru' 
                                ? `Основная валюта: ${e.target.value}` 
                                : `Primary currency: ${e.target.value}`
                            );
                          }}
                          className="pl-4 pr-10 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white appearance-none hover:border-blue-500 transition-colors min-w-[200px]"
                        >
                          <option value="USD">💵 USD - US Dollar</option>
                          <option value="EUR">💶 EUR - Euro</option>
                          <option value="KZT">🇰🇿 KZT - Tenge</option>
                          <option value="RUB">🇷🇺 RUB - Ruble</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronRight className="w-5 h-5 text-blue-600 rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Organization Selector */}
                  <div className="mb-6">
                    <OrganizationSelector compact={true} />
                  </div>

                  {/* Add Account Button */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-lg text-gray-900">{t('accounts.title')}</h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowUploadModal(true)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        {language === 'ru' ? 'Загрузить выписку' : 'Upload Statement'}
                      </button>
                      <button 
                        onClick={() => setShowAddAccount(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        {t('accounts.addAccount')}
                      </button>
                    </div>
                  </div>

                  {/* Accounts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAccounts.map((account) => {
                      // Для реальных данных из API
                      const accountBalance = account.currentBalance || account.balance || 0;
                      const baseBalance = accountBalance * (exchangeRates[account.currency] || 1);
                      const displayBalance = primaryAccountCurrency 
                        ? (accountBalance * (exchangeRates[account.currency] || 1)) / (exchangeRates[primaryAccountCurrency] || 1)
                        : baseBalance;
                      const displayCurr = primaryAccountCurrency || displayCurrency;
                      const lastUpdated = account.lastUpdated || account.latestBalanceDate || '2h ago';
                      const isOutdated = typeof lastUpdated === 'string' && (lastUpdated.includes('days') || lastUpdated.includes('дн'));
                      const category = account.category || 'Revenue';
                      const bankName = account.bank || account.type || 'Bank';
                      const accountColor = account.color || 'from-blue-500 to-purple-500';
                      const accountFlag = account.flag || '🏦';
                      
                      return (
                        <div
                          key={account.id}
                          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedAccount(account);
                            setShowAccountDetails(true);
                          }}
                        >
                          <div className={`w-full h-40 bg-gradient-to-br ${accountColor} rounded-xl mb-4 p-5 flex flex-col justify-between text-white shadow-lg`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-3xl">{accountFlag}</span>
                                <span className="text-2xl">{bankName === 'Kaspi Bank' ? '💳' : bankName === 'Halyk Bank' ? '🏛️' : bankName === 'Sberbank' ? '🇷🇺' : '🏦'}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                {account.isPrimary && (
                                  <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-md backdrop-blur-sm">
                                    {language === 'ru' ? 'Основной' : 'Primary'}
                                  </span>
                                )}
                                <span className={`px-2 py-1 text-xs rounded-md backdrop-blur-sm ${
                                  category === 'Revenue' ? 'bg-green-500/30 text-white' :
                                  category === 'Expenses' ? 'bg-red-500/30 text-white' :
                                  'bg-blue-500/30 text-white'
                                }`}>
                                  {category}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-white/80 mb-1">{account.accountNumber}</p>
                              <p className="text-3xl mb-1">{formatCurrency(accountBalance, account.currency)}</p>
                              <p className="text-xs text-white/70">
                                {primaryAccountCurrency && account.currency !== primaryAccountCurrency 
                                  ? `≈ ${formatCurrency(displayBalance, displayCurr)}`
                                  : `${account.currency}`
                                }
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm text-gray-900 block">{account.accountName || account.name || account.accountNumber}</span>
                                <span className="text-xs text-gray-500">{account.clientName || bankName}</span>
                              </div>
                              <span className="text-sm text-gray-600">{account.transactionCount || 0} tx</span>
                            </div>
                            
                            {/* Status Update */}
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-xs text-gray-600">
                                {language === 'ru' ? 'Обновлено:' : 'Updated:'}
                              </span>
                              <span className={`text-xs ${isOutdated ? 'text-amber-600' : 'text-green-600'}`}>
                                {lastUpdated}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAccount(account);
                                  setShowAccountStatement(true);
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                              >
                                <FileDown className="w-4 h-4" />
                                {language === 'ru' ? 'Выписка' : 'Statement'}
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newAccounts = accountsList.map(a => 
                                    a.id === account.id ? { ...a, isPrimary: true } : { ...a, isPrimary: false }
                                  );
                                  setAccountsList(newAccounts);
                                  toast.success(
                                    language === 'ru' 
                                      ? `${account.name} установлен как основной счёт` 
                                      : `${account.name} set as primary account`
                                  );
                                }}
                                className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 ${
                                  account.isPrimary 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <Star className={`w-4 h-4 ${account.isPrimary ? 'fill-white' : ''}`} />
                                {account.isPrimary 
                                  ? (language === 'ru' ? 'Основной' : 'Primary')
                                  : (language === 'ru' ? 'Сделать основным' : 'Set Primary')
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Transaction Matching Section */}
          {activeSection === 'matching' && (
            <TransactionMatching accounts={filteredAccounts} />
          )}

          {/* Currency Control Section */}
          {activeSection === 'currency' && (
            <div className="space-y-6">
              {/* Organization Selector */}
              <OrganizationSelector compact={true} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* FX Calculator */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                    {t('currency.calculator')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">{t('currency.from')}</label>
                      <select
                        value={fxFrom}
                        onChange={(e) => setFxFrom(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="KZT">KZT - Tenge</option>
                        <option value="RUB">RUB - Ruble</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">{t('currency.amount')}</label>
                      <input
                        type="number"
                        value={fxAmount}
                        onChange={(e) => setFxAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">{t('currency.to')}</label>
                      <select
                        value={fxTo}
                        onChange={(e) => setFxTo(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="KZT">KZT - Tenge</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="RUB">RUB - Ruble</option>
                      </select>
                    </div>
                    <button
                      onClick={calculateFX}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      {t('currency.calculate')}
                    </button>
                  </div>
                </div>

                {/* Exchange Rates */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg text-gray-900 mb-6">{language === 'ru' ? 'Текущие курсы' : 'Current Rates'}</h3>
                  <div className="space-y-4">
                    {Object.entries(exchangeRates).map(([currency, rate]) => (
                      <div key={currency} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-900">1 {currency}</p>
                          <p className="text-xs text-gray-500">{language === 'ru' ? 'к тенге' : 'to KZT'}</p>
                        </div>
                        <p className="text-lg text-gray-900">{rate.toFixed(2)} ₸</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent FX Operations */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg text-gray-900 mb-6">{t('currency.recentOps')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm text-gray-600">{t('currency.date')}</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">{language === 'ru' ? 'Операция' : 'Operation'}</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">{t('currency.rate')}</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">{t('currency.status')}</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">{t('currency.purpose')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currencyOps.map((op) => (
                        <tr key={op.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm text-gray-900">{op.date}</td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {(op.amount || 0).toLocaleString()} {op.from} → {(op.total || 0).toLocaleString()} {op.to}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">{op.rate}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(op.status)}`}>
                              {op.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{op.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FX & Currency Risk Analysis */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg text-gray-900 mb-6">
                  {language === 'ru' ? 'FX & Валютные риски' : 'FX & Currency Risks'}
                </h3>
                <FXRiskAnalysis accounts={accounts} exchangeRates={exchangeRates} />
              </div>
            </div>
          )}

          {/* Tax Reports Section */}
          {activeSection === 'taxes' && (
            <div className="space-y-6">
              {/* Organization Selector */}
              <OrganizationSelector compact={true} />
              
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg text-gray-900 mb-6">{t('taxes.generateReport')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t('taxes.selectCountry')}</label>
                    <select
                      value={selectedTaxCountry}
                      onChange={(e) => setSelectedTaxCountry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="KZ">🇰🇿 Kazakhstan</option>
                      <option value="RU">🇷🇺 Russia</option>
                      <option value="GE">🇬🇪 Georgia</option>
                      <option value="AM">🇦🇲 Armenia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t('taxes.selectForm')}</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                      {selectedTaxCountry === 'KZ' && (
                        <>
                          <option value="910">910.00</option>
                          <option value="240">240.00</option>
                        </>
                      )}
                      {selectedTaxCountry === 'RU' && (
                        <>
                          <option value="USN">УСН</option>
                          <option value="3NDFL">3-НДФЛ</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t('taxes.period')}</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option value="q4-2025">Q4 2025</option>
                      <option value="q3-2025">Q3 2025</option>
                      <option value="q2-2025">Q2 2025</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setShowTaxWizard(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {t('taxes.generateReport')}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg text-gray-900 mb-6">{language === 'ru' ? 'Налоговые отчёты' : 'Tax Reports'}</h3>
                <div className="space-y-4">
                  {taxReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{report.flag}</span>
                            <p className="text-sm text-gray-900">{report.form} - {report.period}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-gray-500">
                              {language === 'ru' ? 'Срок:' : 'Due:'} {report.dueDate}
                            </p>
                            {report.filedDate && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <p className="text-xs text-gray-500">
                                  {language === 'ru' ? 'Подано:' : 'Filed:'} {report.filedDate}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs rounded-md ${getStatusColor(report.status)}`}>
                          {t(`taxes.status${report.status}`)}
                        </span>
                        <button
                          onClick={() => toast.info(language === 'ru' ? 'Скачивание PDF...' : 'Downloading PDF...')}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <DocumentsHub
              language={language}
              documents={documents}
              transactionDocuments={transactionDocuments}
              transactions={transactions}
              formatCurrency={formatCurrency}
              onCreateDocument={() => setShowCreateDocument(true)}
              onUploadFiles={() => setShowDocumentUpload(true)}
              getStatusColor={getStatusColor}
            />
          )}

          {/* AI Analytics Section */}
          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Distribution */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-600" />
                    {language === 'ru' ? 'Распределение расходов' : 'Expense Distribution'}
                  </h3>
                  <div className="space-y-4">
                    {aiAnalytics.expensesByCategory.map((cat) => (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">{cat.category}</span>
                          <span className="text-sm text-gray-900">{cat.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${cat.color} h-2 rounded-full transition-all`}
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Stats */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                  <h3 className="text-gray-900 mb-6">{language === 'ru' ? 'AI Производительность' : 'AI Performance'}</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">{language === 'ru' ? 'Точность категоризации' : 'Categorization Accuracy'}</span>
                        <span className="text-2xl text-blue-600">{aiAnalytics.categorization}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${aiAnalytics.categorization}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-2xl text-gray-900 mb-1">
                          {transactions.length}
                        </p>
                        <p className="text-xs text-gray-600">{language === 'ru' ? 'Транзакций обработано' : 'Transactions Processed'}</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-2xl text-gray-900 mb-1">2.4h</p>
                        <p className="text-xs text-gray-600">{language === 'ru' ? 'Времени сэкономл��но' : 'Time Saved'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-900 mb-6">{language === 'ru' ? 'AI Рекомендации' : 'AI Recommendations'}</h3>
                <div className="space-y-4">
                  {aiAnalytics.recommendations.map((rec) => (
                    <div key={rec.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {rec.type === 'cost-saving' && <TrendingDown className="w-5 h-5 text-white" />}
                        {rec.type === 'tax' && <FileText className="w-5 h-5 text-white" />}
                        {rec.type === 'fx' && <Globe className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-1">{rec.title}</p>
                        <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                          {rec.impact}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        {language === 'ru' ? 'Применить' : 'Apply'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomalies & Smart Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detected Anomalies */}
                <div className="bg-white rounded-2xl border border-orange-200 p-6 shadow-sm">
                  <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    {language === 'ru' ? 'Обнаруженные аномалии' : 'Detected Anomalies'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'ru' ? 'Н��обычные паттерны в ваших транзакциях' : 'Unusual patterns in your transactions'}
                  </p>
                  <div className="space-y-3">
                    {detectedAnomalies.map((anomaly, idx) => (
                      <div key={idx} className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <p className="text-sm text-orange-900">
                              {language === 'ru' ? 
                                (anomaly.type === 'unusual' ? 'Необычный расход обнаружен' : 'Всплеск расходов') :
                                (anomaly.type === 'unusual' ? 'Unusual Expense Detected' : 'Spending spike')
                              }
                            </p>
                          </div>
                          <span className="text-xs text-orange-700">{anomaly.date}</span>
                        </div>
                        <p className="text-xs text-orange-700 mb-1">
                          {language === 'ru' ? 'Всплеск расх��дов в' : 'Spending spike in'} <span className="font-semibold">{anomaly.category}</span>
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-orange-900">
                            USD {(anomaly.amount || 0).toLocaleString()}
                          </p>
                          <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded">
                            +{anomaly.percentageAboveAvg}% {language === 'ru' ? 'выше среднего' : 'above average'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart Recommendations */}
                <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm">
                  <h3 className="text-gray-900 flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    {language === 'ru' ? 'Умные рекомендации' : 'Smart Recommendations'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'ru' ? 'Действия для оптимизации финансов' : 'Actions to optimize your finances'}
                  </p>
                  <div className="space-y-3">
                    {smartRecommendations.map((rec) => (
                      <div 
                        key={rec.id} 
                        className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                          rec.priority === 'urgent' ? 'bg-red-50 border-red-200' :
                          rec.priority === 'high' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                        }`}
                        onClick={() => {
                          toast.success(language === 'ru' ? 'Открываем детали рекомендации...' : 'Opening recommendation details...');
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {rec.icon === 'globe' && <Globe className="w-4 h-4 text-blue-600" />}
                            {rec.icon === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                            {rec.icon === 'lightbulb' && <Lightbulb className="w-4 h-4 text-green-600" />}
                            <p className={`text-sm ${
                              rec.priority === 'urgent' ? 'text-red-900' :
                              rec.priority === 'high' ? 'text-blue-900' : 'text-green-900'
                            }`}>
                              {rec.title}
                            </p>
                          </div>
                          {rec.priority === 'urgent' && (
                            <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded">
                              {language === 'ru' ? 'Срочно' : 'Urgent'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700">
                          {rec.description}
                        </p>
                        {rec.potentialSaving > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-700">
                              {language === 'ru' ? 'Потенциальная экономия:' : 'Potential saving:'} USD {rec.potentialSaving}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Costs & Losses Analysis Section */}
          {activeSection === 'costs' && (
            <CostAnalysis
              displayCurrency={displayCurrency}
              periodFilter={periodFilter}
              onNavigate={handleSectionChange}
              primaryCurrency={primaryAccountCurrency}
            />
          )}

          {/* AI Analytics Section */}
          {activeSection === 'analytics' && (
            <AIAnalytics currency={displayCurrency} />
          )}

          {/* Transactions Section */}
          {activeSection === 'transactions' && (
            <div className="space-y-6">
              {/* Total Income/Expenses Summary */}
              {!isDemo && transactionsData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Income */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-4">
                    <p className="text-sm text-green-700 mb-1">{language === 'ru' ? 'Всего доходов' : 'Total Income'}</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(totalIncome, statistics?.currency || 'RUB')}</p>
                    <p className="text-xs text-green-600">{language === 'ru' ? 'За всё время' : 'All time'}</p>
                  </div>

                  {/* Total Expenses */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 p-4">
                    <p className="text-sm text-red-700 mb-1">{language === 'ru' ? 'Всего расходов' : 'Total Expenses'}</p>
                    <p className="text-2xl font-bold text-red-900">{formatCurrency(totalExpenses, statistics?.currency || 'RUB')}</p>
                    <p className="text-xs text-red-600">{language === 'ru' ? 'За всё время' : 'All time'}</p>
                  </div>

                  {/* Balance */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-4">
                    <p className="text-sm text-blue-700 mb-1">{language === 'ru' ? 'Чистый баланс' : 'Net Balance'}</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalBalance, statistics?.currency || 'RUB')}</p>
                    <p className="text-xs text-blue-600">{language === 'ru' ? 'Доходы - Расходы' : 'Income - Expenses'}</p>
                  </div>
                </div>
              )}
              {/* Organization Selector */}
              <OrganizationSelector compact={true} />
              
              {/* Transaction Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Transactions */}
                <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <ArrowUpDown className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-gray-500 text-sm">{language === 'ru' ? 'Всего' : 'Total'}</span>
                  </div>
                  <h3 className="text-3xl text-gray-900 mb-1">{filteredTransactions.length}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ru' ? 'Транзакций' : 'Transactions'}</p>
                </div>

                {/* Incoming Count */}
                <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-gray-500 text-sm">{language === 'ru' ? 'Доходы' : 'Income'}</span>
                  </div>
                  <h3 className="text-3xl text-gray-900 mb-1">
                    {isDemo 
                      ? filteredTransactions.filter((t: any) => t.type === 'incoming').length
                      : filteredTransactions.filter(t => t.transactionType === 'INCOME').length
                    }
                  </h3>
                  <p className="text-gray-600 text-sm">{language === 'ru' ? 'транзакций' : 'transactions'}</p>
                </div>

                {/* Outgoing Count */}
                <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-rose-100 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-gray-500 text-sm">{language === 'ru' ? 'Расходы' : 'Expenses'}</span>
                  </div>
                  <h3 className="text-3xl text-gray-900 mb-1">
                    {isDemo
                      ? filteredTransactions.filter((t: any) => t.type === 'outgoing').length
                      : filteredTransactions.filter(t => t.transactionType === 'EXPENSE').length
                    }
                  </h3>
                  <p className="text-gray-600 text-sm">{language === 'ru' ? 'транзакций' : 'transactions'}</p>
                </div>

                {/* Pending */}
                <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-gray-500 text-sm">{language === 'ru' ? 'Ожидают' : 'Pending'}</span>
                  </div>
                  <h3 className="text-3xl text-gray-900 mb-1">
                    {filteredTransactions.filter(t => t.status === 'Pending').length}
                  </h3>
                  <p className="text-gray-600 text-sm">{language === 'ru' ? 'В обработке' : 'Processing'}</p>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Table Header with Integrated Filters */}
                <div className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-purple-50/30 p-6 border-b border-gray-200">
                  <div className="flex flex-col gap-4">
                    {/* Title Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                          <ArrowUpDown className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl text-gray-900">
                              {language === 'ru' ? 'Транзакции' : 'Transactions'}
                            </h2>
                            {(() => {
                              const activeFiltersCount = [
                                selectedCountry,
                                selectedCurrency,
                                selectedCategory !== 'all',
                                transactionType !== 'all',
                                transactionStatus !== 'all',
                                searchQuery,
                              ].filter(Boolean).length;
                              
                              return activeFiltersCount > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs">
                                  <Filter className="w-3 h-3 mr-1" />
                                  {activeFiltersCount} {language === 'ru' ? 'фильтров' : 'filters'}
                                </span>
                              ) : null;
                            })()}
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700">
                              <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
                              {filteredTransactions.length} {language === 'ru' ? 'записей' : 'records'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{language === 'ru' ? 'Обновлено' : 'Updated'} 2 min ago</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Export and Upload */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toast.success(language === 'ru' ? 'Экспорт начат' : 'Export started')}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>{language === 'ru' ? 'Экспорт' : 'Export'}</span>
                        </button>
                        
                        <button
                          onClick={() => setShowDocumentUpload(true)}
                          className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{language === 'ru' ? 'Загрузить документы' : 'Upload Documents'}</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search */}
                      <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder={language === 'ru' ? 'Поиск по описанию, контрагенту, назначению...' : 'Search by description, counterparty, purpose...'}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all hover:border-gray-300"
                        />
                      </div>

                      {/* Type Filter */}
                      <CustomSelect
                        value={transactionType}
                        onChange={setTransactionType}
                        options={[
                          { value: 'all', label: language === 'ru' ? 'Все типы' : 'All Types', icon: <Filter className="w-4 h-4" /> },
                          { value: 'incoming', label: language === 'ru' ? 'Поступления' : 'Income', icon: <TrendingUp className="w-4 h-4" /> },
                          { value: 'outgoing', label: language === 'ru' ? 'Расходы' : 'Expenses', icon: <TrendingDown className="w-4 h-4" /> },
                        ]}
                        className="w-auto"
                      />

                      {/* Account Filter */}
                      <CustomSelect
                        value={selectedAccountId}
                        onChange={setSelectedAccountId}
                        options={[
                          { value: 'all', label: language === 'ru' ? 'Все счета' : 'All Accounts', icon: <Wallet className="w-4 h-4" /> },
                          ...accountsList.map((account: any) => ({
                            value: account.id,
                            label: `${account.accountNumber || account.name}${account.accountName ? ` - ${account.accountName}` : ''}`,
                            icon: <Building2 className="w-4 h-4" />
                          }))
                        ]}
                        className="w-auto min-w-[200px]"
                      />

                      {/* Category Filter */}
                      <CustomSelect
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        options={[
                          { value: 'all', label: language === 'ru' ? 'Все категории' : 'All Categories', icon: <Target className="w-4 h-4" /> },
                          { value: 'Income', label: language === 'ru' ? 'Доходы' : 'Income', icon: <DollarSign className="w-4 h-4" /> },
                          { value: 'Salaries', label: language === 'ru' ? 'Зарплаты' : 'Salaries', icon: <Users className="w-4 h-4" /> },
                          { value: 'Rent', label: language === 'ru' ? 'Аренда' : 'Rent', icon: <Building2 className="w-4 h-4" /> },
                          { value: 'IT Services', label: 'IT Services', icon: <Zap className="w-4 h-4" /> },
                          { value: 'Marketing', label: language === 'ru' ? 'Маркетинг' : 'Marketing', icon: <Target className="w-4 h-4" /> },
                        ]}
                        className="w-auto"
                      />

                      {/* Status Filter */}
                      <CustomSelect
                        value={transactionStatus}
                        onChange={setTransactionStatus}
                        options={[
                          { value: 'all', label: language === 'ru' ? 'Все статусы' : 'All Status', icon: <CheckCircle2 className="w-4 h-4" /> },
                          { value: 'Completed', label: language === 'ru' ? 'Завершено' : 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
                          { value: 'Pending', label: language === 'ru' ? 'Ожидание' : 'Pending', icon: <Clock className="w-4 h-4" /> },
                        ]}
                        className="w-auto"
                      />

                      {/* Reset Filters Button */}
                      {(selectedCountry || selectedCurrency || selectedCategory !== 'all' || transactionType !== 'all' || transactionStatus !== 'all' || searchQuery) && (
                        <button
                          onClick={() => {
                            setSelectedCountry(null);
                            setSelectedCurrency(null);
                            setSelectedCategory('all');
                            setTransactionType('all');
                            setTransactionStatus('all');
                            setSearchQuery('');
                            setTransactionCounterparty('');
                            setTransactionAmountMin('');
                            setTransactionAmountMax('');
                            toast.success(language === 'ru' ? 'Фильтры сброшены' : 'Filters reset');
                          }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all flex items-center gap-2 text-sm border-2 border-gray-200"
                        >
                          <X className="w-4 h-4" />
                          <span>{language === 'ru' ? 'Сбросить' : 'Reset'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table Content */}
                {filteredTransactions.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ArrowUpDown className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-base text-gray-900 mb-2">
                      {language === 'ru' ? 'Транзакции не найдены' : 'No transactions found'}
                    </h3>
                    <p className="text-gray-500">
                      {language === 'ru' ? 'По��робуйте изменить фильтры поиска' : 'Try adjusting your search filters'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{language === 'ru' ? 'Дата' : 'Date'}</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>{language === 'ru' ? 'Контрагент' : 'Counterparty'}</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>{language === 'ru' ? 'Описание' : 'Description'}</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>{language === 'ru' ? 'Категория' : 'Category'}</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center justify-end gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{language === 'ru' ? 'Сумма' : 'Amount'}</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-center text-xs text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{language === 'ru' ? 'Статус' : 'Status'}</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-center text-xs text-gray-600 uppercase tracking-wider">
                            {language === 'ru' ? 'Действия' : 'Actions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredTransactions.map((transaction, index) => {
                          const account = accounts.find(a => a.name === transaction.account);
                          const currency = account?.currency || 'USD';
                          // Проверяем и для demo данных (type) и для API данных (transactionType)
                          const isIncoming = isDemo 
                            ? (transaction as any).type === 'incoming' 
                            : transaction.transactionType === 'INCOME';
                          
                          return (
                            <tr
                              key={transaction.id}
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setShowTransactionDetails(true);
                              }}
                              className={`group cursor-pointer transition-all hover:bg-gray-50 ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                              }`}
                            >
                              {/* Date Column */}
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isIncoming 
                                      ? 'bg-green-50' 
                                      : 'bg-red-50'
                                  }`}>
                                    {isIncoming ? (
                                      <TrendingUp className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <TrendingDown className="w-5 h-5 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-900">{transaction.date}</div>
                                    <div className="text-xs text-gray-500 font-mono">
                                      {transaction.reference}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Counterparty Column */}
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm text-gray-900 truncate max-w-[200px]">
                                      {transaction.counterparty?.name || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                      {transaction.counterparty?.bank}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Description Column */}
                              <td className="px-4 py-4">
                                <div className="max-w-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm text-gray-900 truncate flex-1">{transaction.description}</div>
                                    {transactionDocuments[transaction.id] && transactionDocuments[transaction.id].length > 0 && (
                                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs flex-shrink-0">
                                        <FileText className="w-3 h-3" />
                                        <span>{transactionDocuments[transaction.id].length}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate mt-0.5">{transaction.purpose}</div>
                                </div>
                              </td>

                              {/* Category Column */}
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs ${
                                  transaction.category === 'Income' ? 'bg-green-100 text-green-700' :
                                  transaction.category === 'Salaries' ? 'bg-blue-100 text-blue-700' :
                                  transaction.category === 'Rent' ? 'bg-purple-100 text-purple-700' :
                                  transaction.category === 'IT Services' ? 'bg-indigo-100 text-indigo-700' :
                                  transaction.category === 'Marketing' ? 'bg-pink-100 text-pink-700' :
                                  transaction.category === 'Utilities' ? 'bg-orange-100 text-orange-700' :
                                  transaction.category === 'Contractor' ? 'bg-cyan-100 text-cyan-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {transaction.category}
                                </span>
                              </td>

                              {/* Amount Column */}
                              <td className="px-4 py-4 text-right">
                                <div className={`text-sm mb-0.5 ${
                                  isIncoming ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {isIncoming ? '+' : ''}{formatCurrency(transaction.amount, currency)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {currency}
                                  {transaction.fee > 0 && (
                                    <span className="text-orange-600 ml-1">
                                      • Fee: {formatCurrency(transaction.fee, currency)}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Status Column */}
                              <td className="px-4 py-4 text-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs ${
                                  transaction.status === 'Completed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {transaction.status === 'Completed' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5" />
                                  )}
                                  {transaction.status === 'Completed' 
                                    ? (language === 'ru' ? 'Завершено' : 'Complete')
                                    : (language === 'ru' ? 'Ожидание' : 'Pending')
                                  }
                                </span>
                              </td>

                              {/* Actions Column */}
                              <td className="px-4 py-4 relative" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1">
                                  {/* Comment indicator or button */}
                                  {transaction.latestComment ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowingCommentId(showingCommentId === transaction.id ? null : transaction.id);
                                      }}
                                      className="relative w-7 h-7 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center justify-center transition-all"
                                      title={language === 'ru' ? 'Показать комментарий' : 'Show comment'}
                                    >
                                      <AlertCircle className="w-4 h-4 text-amber-600" />
                                    </button>
                                  ) : editingCommentId === transaction.id ? (
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        maxLength={200}
                                        placeholder={language === 'ru' ? 'Комментарий...' : 'Comment...'}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                                        autoFocus
                                      />
                                      <button
                                        onClick={async () => {
                                          if (commentText.trim() && !isDemo) {
                                            try {
                                              // Вызываем API для сохранения комментария
                                              const response = await fetch(`/api/transactions/${transaction.id}/comments`, {
                                                method: 'POST',
                                                headers: {
                                                  'Content-Type': 'application/json',
                                                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                                                },
                                                body: JSON.stringify({ commentText: commentText.trim() })
                                              });
                                              
                                              if (response.ok) {
                                                // Обновляем транзакцию в списке
                                                transaction.latestComment = commentText.trim();
                                                toast.success(language === 'ru' ? 'Комментарий сохранен' : 'Comment saved');
                                              } else {
                                                toast.error(language === 'ru' ? 'Ошибка сохранения' : 'Save failed');
                                              }
                                            } catch (error) {
                                              console.error('Error saving comment:', error);
                                              toast.error(language === 'ru' ? 'Ошибка сохранения' : 'Save failed');
                                            }
                                          } else if (isDemo) {
                                            // Для demo - сохраняем в объект транзакции
                                            transaction.latestComment = commentText.trim();
                                            toast.success(language === 'ru' ? 'Комментарий сохранен (demo)' : 'Comment saved (demo)');
                                          }
                                          setEditingCommentId(null);
                                          setCommentText('');
                                        }}
                                        disabled={!commentText.trim()}
                                        className="w-7 h-7 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
                                        title={language === 'ru' ? 'Сохранить' : 'Save'}
                                      >
                                        <Check className="w-4 h-4 text-white" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(null);
                                          setCommentText('');
                                        }}
                                        className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-all"
                                        title={language === 'ru' ? 'Отмена' : 'Cancel'}
                                      >
                                        <X className="w-3.5 h-3.5 text-gray-600" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCommentId(transaction.id);
                                        setCommentText('');
                                      }}
                                      className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-70 hover:opacity-100 hover:bg-gray-200 transition-all"
                                      title={language === 'ru' ? 'Добавить комментарий' : 'Add comment'}
                                    >
                                      <Mail className="w-3.5 h-3.5 text-gray-600" />
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTransaction(transaction);
                                      setShowTransactionDetails(true);
                                    }}
                                    className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-70 hover:opacity-100 hover:bg-blue-100 transition-all"
                                    title={language === 'ru' ? 'Детали' : 'Details'}
                                  >
                                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  </button>
                                </div>
                                
                                {/* Comment popup */}
                                {showingCommentId === transaction.id && transaction.latestComment && (
                                  <div className="absolute right-0 top-12 z-50 p-3 bg-white border-2 border-amber-200 rounded-lg shadow-xl max-w-xs min-w-[200px]">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                        <p className="text-xs font-medium text-gray-700">
                                          {language === 'ru' ? 'Комментарий' : 'Comment'}
                                        </p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowingCommentId(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">{transaction.latestComment}</p>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    {t('settings.profile')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">{language === 'ru' ? 'Название компании' : 'Company Name'}</label>
                      <input
                        type="text"
                        defaultValue="My Business LLC"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">{language === 'ru' ? 'Email' : 'Email'}</label>
                      <input
                        type="email"
                        defaultValue="business@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">{language === 'ru' ? 'Телефон' : 'Phone'}</label>
                      <input
                        type="tel"
                        defaultValue="+7 700 123 4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    {t('settings.security')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-900">{language === 'ru' ? 'Двухфакторная аутентификация' : 'Two-Factor Authentication'}</p>
                        <p className="text-xs text-gray-500">{language === 'ru' ? 'Включено' : 'Enabled'}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-900">{language === 'ru' ? 'Сессии' : 'Active Sessions'}</p>
                        <p className="text-xs text-gray-500">2 {language === 'ru' ? 'активных' : 'active'}</p>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        {language === 'ru' ? 'Управление' : 'Manage'}
                      </button>
                    </div>
                    <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      {language === 'ru' ? 'Изменить пароль' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-gray-900 mb-6">{language === 'ru' ? 'Настройки' : 'Preferences'}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <Languages className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{t('settings.language')}</p>
                        <p className="text-xs text-blue-700">{language === 'ru' ? 'Русский' : 'English'}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'ru')}
                        className="pl-4 pr-10 py-2.5 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white appearance-none hover:border-blue-500 transition-colors"
                      >
                        <option value="en">🇬🇧 English</option>
                        <option value="ru">🇷🇺 Русский</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="w-5 h-5 text-blue-600 rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-900">{t('settings.notifications')}</p>
                        <p className="text-xs text-gray-500">{language === 'ru' ? 'Email уведомления' : 'Email notifications'}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                      {language === 'ru' ? 'Настроить' : 'Configure'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast.success(language === 'ru' ? 'Настройки сохранены' : 'Settings saved successfully')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {t('settings.save')}
              </button>
            </div>
          )}

          {/* Transaction Details Modal */}
          {showTransactionDetails && selectedTransaction && (
            <TransactionDetailsModal
              transaction={selectedTransaction}
              language={language}
              accounts={accounts}
              formatCurrency={formatCurrency}
              onClose={() => setShowTransactionDetails(false)}
              onSave={(updatedTransaction) => {
                handleSaveTransaction(updatedTransaction);
              }}
              attachedDocuments={transactionDocuments[selectedTransaction.id]}
            />
          )}

          {/* Document Upload Manager */}
          {showDocumentUpload && (
            <DocumentUploadManager
              onClose={() => setShowDocumentUpload(false)}
              transactions={transactionsList}
              onDocumentsMatched={(matches) => {
                const newDocs = { ...transactionDocuments };
                matches.forEach(match => {
                  if (match.matchStatus === 'matched' && match.suggestedTransactionId) {
                    if (!newDocs[match.suggestedTransactionId]) {
                      newDocs[match.suggestedTransactionId] = [];
                    }
                    newDocs[match.suggestedTransactionId].push({
                      id: match.id,
                      fileName: match.file.name,
                      fileType: match.file.type,
                      uploadDate: new Date().toISOString(),
                      extractedData: match.extractedData
                    });
                  }
                });
                setTransactionDocuments(newDocs);
              }}
            />
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Bell className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl mb-1">
                        {language === 'ru' ? 'Уведомления' : 'Notifications'}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {language === 'ru' 
                          ? `${notifications.filter(n => !n.read).length} непрочитанных из ${notifications.length}` 
                          : `${notifications.filter(n => !n.read).length} unread of ${notifications.length}`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <CustomSelect
                      value={notificationFilter}
                      onChange={(value) => setNotificationFilter(value as 'all' | 'unread' | 'read')}
                      options={[
                        { value: 'all', label: language === 'ru' ? 'Все' : 'All', icon: <Bell className="w-4 h-4" /> },
                        { value: 'unread', label: language === 'ru' ? 'Непрочитанные' : 'Unread', icon: <AlertCircle className="w-4 h-4" /> },
                        { value: 'read', label: language === 'ru' ? 'Прочитанные' : 'Read', icon: <CheckCircle2 className="w-4 h-4" /> },
                      ]}
                    />
                    <button
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                        toast.success(language === 'ru' ? 'Все уведомления отмечены как прочитанные' : 'All notifications marked as read');
                      }}
                      className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">{language === 'ru' ? 'Прочитать все' : 'Mark all read'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications
                  .filter(notification => {
                    if (notificationFilter === 'unread') return !notification.read;
                    if (notificationFilter === 'read') return notification.read;
                    return true;
                  })
                  .map((notification) => {
                    const Icon = notification.icon;
                    const getTypeColor = () => {
                      switch (notification.type) {
                        case 'tax': return 'from-purple-500 to-pink-500';
                        case 'fx': return 'from-blue-500 to-cyan-500';
                        case 'transaction': return 'from-green-500 to-emerald-500';
                        case 'alert': return 'from-orange-500 to-red-500';
                        case 'system': return 'from-gray-500 to-gray-600';
                        default: return 'from-blue-500 to-purple-500';
                      }
                    };

                    const getPriorityBadge = () => {
                      if (notification.priority === 'high') {
                        return (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {language === 'ru' ? 'Важно' : 'High'}
                          </span>
                        );
                      }
                      if (notification.priority === 'medium') {
                        return (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
                            {language === 'ru' ? 'Средний' : 'Medium'}
                          </span>
                        );
                      }
                      return null;
                    };

                    return (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (!notification.read) {
                            setNotifications(notifications.map(n => 
                              n.id === notification.id ? { ...n, read: true } : n
                            ));
                          }
                        }}
                        className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${
                          notification.read 
                            ? 'border-gray-200 opacity-75' 
                            : 'border-blue-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor()} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {notification.message}
                                </p>
                              </div>
                              
                              {/* Priority Badge */}
                              {getPriorityBadge()}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{notification.date}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-md text-xs ${
                                  notification.type === 'tax' ? 'bg-purple-100 text-purple-700' :
                                  notification.type === 'fx' ? 'bg-blue-100 text-blue-700' :
                                  notification.type === 'transaction' ? 'bg-green-100 text-green-700' :
                                  notification.type === 'alert' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                </span>
                                
                                {notification.read ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotifications(notifications.map(n => 
                                        n.id === notification.id ? { ...n, read: false } : n
                                      ));
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={language === 'ru' ? 'Отметить как непрочитанное' : 'Mark as unread'}
                                  >
                                    <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotifications(notifications.map(n => 
                                        n.id === notification.id ? { ...n, read: true } : n
                                      ));
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={language === 'ru' ? 'Отметить как прочитанное' : 'Mark as read'}
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty State */}
                  {notifications.filter(n => {
                    if (notificationFilter === 'unread') return !n.read;
                    if (notificationFilter === 'read') return n.read;
                    return true;
                  }).length === 0 && (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg text-gray-900 mb-2">
                        {language === 'ru' ? 'Нет уведомлений' : 'No notifications'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {notificationFilter === 'unread' 
                          ? (language === 'ru' ? 'Все уведомления прочитаны' : 'All notifications are read')
                          : (language === 'ru' ? 'У вас пока нет уведомлений' : 'You don\'t have any notifications yet')}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Document Modal */}
      {showCreateDocument && (
        <CreateDocumentModal onClose={() => setShowCreateDocument(false)} />
      )}

      {/* Account Details Modal */}
      {showAccountDetails && selectedAccount && (
        <AccountDetails
          account={selectedAccount}
          exchangeRate={exchangeRates[selectedAccount.currency] || 1}
          baseCurrency={displayCurrency}
          primaryCurrency={primaryAccountCurrency || undefined}
          onClose={() => {
            setShowAccountDetails(false);
            setSelectedAccount(null);
          }}
        />
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <AddAccountModal
          onClose={() => setShowAddAccount(false)}
          onAccountAdded={(newAccount) => {
            setAccountsList([...accountsList, newAccount]);
          }}
        />
      )}

      {/* Account Statement Modal */}
      {showAccountStatement && selectedAccount && (
        <AccountStatementModal
          account={selectedAccount}
          onClose={() => {
            setShowAccountStatement(false);
            setSelectedAccount(null);
          }}
          onCreateReport={() => {
            setShowTaxWizard(true);
          }}
          onCreateDocument={() => {
            setShowCreateDocument(true);
          }}
          primaryCurrency={primaryAccountCurrency || undefined}
          exchangeRate={
            primaryAccountCurrency 
              ? (exchangeRates[selectedAccount.currency] || 1) / (exchangeRates[primaryAccountCurrency] || 1)
              : 1
          }
        />
      )}

      {/* Upload Statements Modal */}
      {showUploadModal && (
        <UploadStatements onClose={() => setShowUploadModal(false)} />
      )}

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal onClose={() => setShowPricingModal(false)} />
      )}

      {/* Tax Report Wizard */}
      {showTaxWizard && (
        <TaxReportWizard onClose={() => setShowTaxWizard(false)} />
      )}


    </div>
  );
}
