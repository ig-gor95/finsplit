import { useState } from 'react';
import { LanguageProvider, useLanguage } from './utils/LanguageContext';
import { OrganizationProvider } from './utils/OrganizationContext';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SignIn } from './components/SignIn';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { 
  BarChart3, 
  Shield, 
  Zap, 
  FileText, 
  Link2, 
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Check,
  TrendingUp,
  Globe,
  Brain,
  Upload,
  Receipt,
  Users,
  Building2,
  Wallet,
  LineChart,
  Sparkles,
  Lock,
  PieChart
} from 'lucide-react';

type AppView = 'home' | 'signin' | 'dashboard' | 'demo';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <LanguageProvider>
          <OrganizationProvider>
            <AppContent />
            <Toaster position="top-right" richColors />
          </OrganizationProvider>
        </LanguageProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  // Проверяем наличие токена при инициализации
  const getInitialView = (): AppView => {
    const token = localStorage.getItem('auth_token');
    if (token && token !== 'undefined' && token !== 'null') {
      return 'dashboard'; // Если есть токен - сразу показываем dashboard
    }
    return 'home';
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialView);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setCurrentView('home');
  };

  if (currentView === 'signin') {
    return (
      <SignIn 
        onClose={() => setCurrentView('home')}
        onSignIn={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'dashboard') {
    return <Dashboard onLogout={handleLogout} isDemo={false} />;
  }

  if (currentView === 'demo') {
    return <Dashboard onLogout={handleLogout} isDemo={true} />;
  }

  return <LandingPage 
    onSignIn={() => setCurrentView('signin')} 
    onDemo={() => setCurrentView('demo')}
  />;
}

function LandingPage({ onSignIn, onDemo }: { onSignIn: () => void; onDemo: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: BarChart3,
      titleKey: 'features.analytics.title' as const,
      descKey: 'features.analytics.desc' as const,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      titleKey: 'features.security.title' as const,
      descKey: 'features.security.desc' as const,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      titleKey: 'features.automation.title' as const,
      descKey: 'features.automation.desc' as const,
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: FileText,
      titleKey: 'features.reports.title' as const,
      descKey: 'features.reports.desc' as const,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Link2,
      titleKey: 'features.integration.title' as const,
      descKey: 'features.integration.desc' as const,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Users,
      titleKey: 'features.allAccounts.title' as const,
      descKey: 'features.allAccounts.desc' as const,
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  const productBenefits = [
    {
      icon: LineChart,
      titleKey: 'product.benefit1.title' as const,
      descKey: 'product.benefit1.desc' as const,
    },
    {
      icon: FileText,
      titleKey: 'product.benefit2.title' as const,
      descKey: 'product.benefit2.desc' as const,
    },
    {
      icon: Wallet,
      titleKey: 'product.benefit3.title' as const,
      descKey: 'product.benefit3.desc' as const,
    },
    {
      icon: Sparkles,
      titleKey: 'product.benefit4.title' as const,
      descKey: 'product.benefit4.desc' as const,
    },
    {
      icon: Receipt,
      titleKey: 'product.benefit5.title' as const,
      descKey: 'product.benefit5.desc' as const,
    },
    {
      icon: Globe,
      titleKey: 'product.benefit6.title' as const,
      descKey: 'product.benefit6.desc' as const,
    },
  ];

  const howItWorksSteps = [
    {
      icon: Upload,
      titleKey: 'howItWorks.step1.title' as const,
      descKey: 'howItWorks.step1.desc' as const,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Brain,
      titleKey: 'howItWorks.step2.title' as const,
      descKey: 'howItWorks.step2.desc' as const,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      titleKey: 'howItWorks.step3.title' as const,
      descKey: 'howItWorks.step3.desc' as const,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: language === 'ru' ? 'Бесплатно' : 'Free',
      period: '',
      features: [
        language === 'ru' ? '1 организация/компания' : '1 organization/company',
        language === 'ru' ? '2 банковских счета' : '2 bank accounts',
        language === 'ru' ? '100 транзакций/месяц' : '100 transactions/month',
        language === 'ru' ? 'Ручная категоризация' : 'Manual categorization',
        language === 'ru' ? 'Базовые отчёты' : 'Basic reports',
        language === 'ru' ? 'Email поддержка' : 'Email support',
      ],
      cta: language === 'ru' ? 'Начать бесплатно' : 'Start Free',
      popular: false,
    },
    {
      name: 'Professional',
      price: language === 'ru' ? '2 900 ₽' : '$29',
      period: `/ ${language === 'ru' ? 'месяц' : 'month'}`,
      features: [
        language === 'ru' ? '3 организации/компании' : '3 organizations/companies',
        language === 'ru' ? 'Неограниченно банковских счетов' : 'Unlimited bank accounts',
        language === 'ru' ? 'Неограниченно транзакций' : 'Unlimited transactions',
        language === 'ru' ? 'AI-категоризация и анализ' : 'AI categorization & analysis',
        language === 'ru' ? 'Налоговые отчёты (KZ, RU, GE, AM)' : 'Tax reports (KZ, RU, GE, AM)',
        language === 'ru' ? 'Мультивалютность и FX-риски' : 'Multi-currency & FX risks',
        language === 'ru' ? 'Генерация документов (счета, акты)' : 'Document generation (invoices, acts)',
        language === 'ru' ? 'Сопоставление транзакций' : 'Transaction matching',
        language === 'ru' ? 'Приоритетная поддержка' : 'Priority support',
      ],
      cta: language === 'ru' ? 'Выбрать план' : 'Choose Plan',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: language === 'ru' ? '12 000 ₽' : '$120',
      period: `/ ${language === 'ru' ? 'месяц' : 'month'}`,
      features: [
        language === 'ru' ? 'Неограниченно организаций' : 'Unlimited organizations',
        language === 'ru' ? 'Неограниченно счетов и транзакций' : 'Unlimited accounts & transactions',
        language === 'ru' ? 'Холдинговая структура и консолидация' : 'Holding structure & consolidation',
        language === 'ru' ? 'Расширенная AI-аналитика и прогнозы' : 'Advanced AI analytics & forecasts',
        language === 'ru' ? 'Налоговые отчёты (все страны + EU)' : 'Tax reports (all countries + EU)',
        language === 'ru' ? 'API доступ и вебхуки' : 'API access & webhooks',
        language === 'ru' ? 'Кастомные интеграции (1С, SAP)' : 'Custom integrations (1C, SAP)',
        language === 'ru' ? 'White-label опции' : 'White-label options',
        language === 'ru' ? 'Выделенный менеджер и SLA' : 'Dedicated manager & SLA',
      ],
      cta: language === 'ru' ? 'Выбрать план' : 'Choose Plan',
      popular: false,
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-gray-900">{language === 'ru' ? 'ФинСплит' : 'FinSplit'}</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.home')}
              </button>
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.features')}
              </button>
              <button onClick={() => scrollToSection('product')} className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.about')}
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.pricing')}
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.contact')}
              </button>
            </nav>

            {/* Language Switcher & CTA */}
            <div className="hidden md:flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ru')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="ru">🇷🇺 RU</option>
              </select>
              <button 
                onClick={onDemo}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
              >
                <span className="text-lg">▶</span>
                {t('nav.demo')}
              </button>
              <button 
                onClick={onSignIn}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('nav.signin')}
              </button>
              <button 
                onClick={onSignIn}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                {t('nav.signup')}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">
                  {t('nav.home')}
                </button>
                <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">
                  {t('nav.features')}
                </button>
                <button onClick={() => scrollToSection('product')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">
                  {t('nav.about')}
                </button>
                <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">
                  {t('nav.pricing')}
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-gray-900 transition-colors text-left">
                  {t('nav.contact')}
                </button>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'ru')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="ru">🇷🇺 Русский</option>
                  </select>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDemo();
                    }}
                    className="w-full px-6 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">▶</span>
                    {t('nav.demo')}
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSignIn();
                    }}
                    className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-left"
                  >
                    {t('nav.signin')}
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSignIn();
                    }}
                    className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    {t('nav.signup')}
                  </button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="pt-24 pb-16 px-4 bg-gradient-to-b from-blue-50 via-purple-50 to-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {/* Trust badge with countries */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>{t('hero.trustedBy')} {t('hero.countries')}</span>
                </div>
                
                {/* Main heading */}
                <div className="space-y-4">
                  <h1 className="text-gray-900 leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {t('hero.title')}
                    </span>
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {t('hero.subtitle')}
                  </p>
                </div>
                
                {/* Account types badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg text-sm">
                  <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-green-700">{t('hero.forEveryone')}: {t('hero.accountTypes')}</span>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={onSignIn}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 group"
                  >
                    {t('hero.cta.primary')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={onDemo}
                    className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                  >
                    <span className="text-xl">▶</span>
                    {t('hero.cta.secondary')}
                  </button>
                </div>
              </div>
              
              {/* Right side visual */}
              <div className="relative">
                <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                  <div className="h-full w-full rounded-3xl bg-white p-8 flex flex-col items-center justify-center space-y-6">
                    {/* Main icon with animations */}
                    <div className="relative">
                      {/* Background glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                      
                      {/* Main globe icon */}
                      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-8">
                        <Globe className="w-24 h-24 text-blue-600" />
                      </div>
                      
                      {/* Floating badges */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Currency indicators */}
                    <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1">USD</div>
                        <div className="text-sm text-gray-800">$24.5K</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center border border-purple-200">
                        <div className="text-xs text-purple-600 mb-1">EUR</div>
                        <div className="text-sm text-gray-800">€18.2K</div>
                      </div>
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-3 text-center border border-pink-200">
                        <div className="text-xs text-pink-600 mb-1">KZT</div>
                        <div className="text-sm text-gray-800">₸8.9M</div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        {language === 'ru' 
                          ? 'Управление международными финансами' 
                          : 'International Finance Management'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">{language === 'ru' ? 'Возможности' : 'Features'}</span>
              </div>
              <h2 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('features.title')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 p-8 space-y-4 group"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(feature.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section id="product" className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full mb-6 border border-purple-200">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700">{language === 'ru' ? 'Продукт' : 'Product'}</span>
                </div>
                <h2 className="mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('product.title')}
                </h2>
                <p className="text-gray-600 text-lg">
                  {t('product.subtitle')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {productBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all group"
                    >
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {t(benefit.titleKey)}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {t(benefit.descKey)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-1 text-gray-900">10+</div>
                    <div className="text-gray-600 text-sm">{t('about.stats.countries')}</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-1 text-gray-900">50+</div>
                    <div className="text-gray-600 text-sm">{t('about.stats.banks')}</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-1 text-gray-900">20+</div>
                    <div className="text-gray-600 text-sm">{t('about.stats.currencies')}</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl mb-1 text-gray-900">AI</div>
                    <div className="text-gray-600 text-sm">{t('about.stats.automation')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="howItWorks" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-pink-50 rounded-full mb-6 border border-blue-200">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">{language === 'ru' ? 'Как это работает' : 'How It Works'}</span>
              </div>
              <h2 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('howItWorks.title')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('howItWorks.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {howItWorksSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-4 hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1 group">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl">{index + 1}</span>
                      </div>
                      <h3 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {t(step.titleKey)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t(step.descKey)}
                      </p>
                    </div>
                    {index < howItWorksSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-cyan-50 rounded-full mb-6 border border-green-200">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">{language === 'ru' ? 'Примеры использования' : 'Use Cases'}</span>
              </div>
              <h2 className="mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('useCases.title')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('useCases.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t('useCases.freelancer.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('useCases.freelancer.desc')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {language === 'ru' ? 'Личные счета' : 'Personal Accounts'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {language === 'ru' ? 'ИП' : 'Sole Proprietor'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {language === 'ru' ? 'Фриланс' : 'Freelance'}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-xl hover:shadow-2xl transition-all md:scale-105 relative group">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm shadow-lg">
                  {language === 'ru' ? 'Популярно' : 'Popular'}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t('useCases.business.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('useCases.business.desc')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {language === 'ru' ? 'ТОО/ООО' : 'LLC'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {language === 'ru' ? 'Несколько счетов' : 'Multiple Accounts'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {language === 'ru' ? 'Команда' : 'Team'}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t('useCases.enterprise.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('useCases.enterprise.desc')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {language === 'ru' ? 'Холдинг' : 'Holding'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {language === 'ru' ? 'Группа компаний' : 'Group of Companies'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {language === 'ru' ? 'Консолидация' : 'Consolidation'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full mb-6 border border-green-200">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">{language === 'ru' ? 'Тарифы' : 'Pricing'}</span>
              </div>
              <h2 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('pricing.title')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('pricing.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border-2 p-8 flex flex-col transition-all duration-300 relative ${
                    plan.popular
                      ? 'border-blue-600 shadow-2xl md:scale-105'
                      : 'border-gray-200 hover:shadow-xl hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm shadow-lg">
                      {t('pricing.popular')}
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{plan.price}</span>
                      {plan.period && <span className="text-gray-600">{plan.period}</span>}
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onSignIn}
                    className={`w-full py-3.5 rounded-lg transition-all flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-purple-50 rounded-full mb-6 border border-amber-200">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700">{language === 'ru' ? 'О нас' : 'About Us'}</span>
              </div>
              <h2 className="mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('about.title')}
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {t('about.description')}
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 mb-8">
                <p className="text-gray-900 text-lg">
                  {t('about.mission')}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 bg-white border border-blue-200 rounded-lg shadow-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{language === 'ru' ? 'Личные счета' : 'Personal Accounts'}</span>
                </div>
                <div className="px-4 py-2 bg-white border border-purple-200 rounded-lg shadow-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">{language === 'ru' ? 'Бизнес счета' : 'Business Accounts'}</span>
                </div>
                <div className="px-4 py-2 bg-white border border-green-200 rounded-lg shadow-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{language === 'ru' ? 'Фриланс' : 'Freelance'}</span>
                </div>
                <div className="px-4 py-2 bg-white border border-amber-200 rounded-lg shadow-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-gray-700">{language === 'ru' ? 'Несколько компаний' : 'Multiple Companies'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full mb-6 border border-pink-200">
                  <Mail className="w-4 h-4 text-pink-600" />
                  <span className="text-sm text-pink-700">{language === 'ru' ? 'Контакты' : 'Contact'}</span>
                </div>
                <h2 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('contact.title')}
                </h2>
                <p className="text-gray-600 text-lg">
                  {t('contact.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{t('contact.info.email')}</h3>
                      <a href="mailto:hello@finsplit.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                        hello@finsplit.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{t('contact.info.phone')}</h3>
                      <a href="tel:+77001234567" className="text-blue-600 hover:text-blue-700 transition-colors">
                        {language === 'ru' ? '+7 (700) 123-45-67' : '+1 (555) 123-4567'}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{t('contact.info.address')}</h3>
                      <p className="text-gray-600">
                        {language === 'ru' 
                          ? 'Алматы, Казахстан / Москва, Россия' 
                          : 'Almaty, Kazakhstan / Moscow, Russia'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  alert(t('contact.formSuccess'));
                }}>
                  <div>
                    <input
                      type="text"
                      placeholder={t('contact.name')}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={t('contact.email')}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder={t('contact.message')}
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                  >
                    {t('contact.send')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <button 
                onClick={() => scrollToSection('home')}
                className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white">{language === 'ru' ? 'ФинСплит' : 'FinSplit'}</h3>
              </button>
              <p className="text-gray-400 text-sm">
                {language === 'ru' 
                  ? 'Единый финансовый центр для международного бизнеса'
                  : 'Unified financial hub for international business'}
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-white">{t('footer.company')}</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('product')} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {t('nav.about')}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {t('nav.features')}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {t('nav.pricing')}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {t('nav.contact')}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-white">{t('footer.product')}</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {language === 'ru' ? 'Возможности' : 'Features'}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {language === 'ru' ? 'Тарифы' : 'Pricing'}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('howItWorks')} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {language === 'ru' ? 'Как это работает' : 'How It Works'}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-white">{t('footer.legal')}</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onSignIn} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {t('footer.privacy')}
                  </button>
                </li>
                <li>
                  <button onClick={onSignIn} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {t('footer.terms')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">{t('footer.copyright')}</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}