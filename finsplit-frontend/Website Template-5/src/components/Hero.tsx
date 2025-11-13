import { Button } from './ui/button';
import { ArrowRight, Globe, Building2, Briefcase, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-60 pointer-events-none" />
      
      <div className="container mx-auto relative">
        {/* Trust badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">Trusted by businesses across Kazakhstan, Russia, Georgia, Armenia & EU</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-black">
                Unified Financial Hub for International Business
              </h1>
              <p className="text-gray-600 max-w-lg text-lg">
                Manage finances across countries in one platform. FinSplit combines multi-currency balances, automated reporting, currency control, and AI-powered analytics for entrepreneurs, freelancers, and small businesses operating internationally.
              </p>
            </div>

            {/* Account types badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-900">Personal</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <Building2 className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-900">Business</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <Briefcase className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-900">Freelance</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <Globe className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-900">Multiple Entities</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2">
                View Demo
              </Button>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div>
                <div className="text-blue-600">5+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div>
                <div className="text-purple-600">10+</div>
                <div className="text-sm text-gray-600">Currencies</div>
              </div>
              <div>
                <div className="text-green-600">AI-Powered</div>
                <div className="text-sm text-gray-600">Analytics</div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBkYXNoYm9hcmQlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzYyMDcxMzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="FinSplit financial dashboard"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay card showing multi-currency */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Multi-Currency Balance</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Live</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xs text-gray-500">USD</div>
                    <div className="text-sm">$24.5K</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">EUR</div>
                    <div className="text-sm">€18.2K</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">KZT</div>
                    <div className="text-sm">₸8.9M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
