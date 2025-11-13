import { Card, CardContent } from './ui/card';
import { Zap, Shield, Sparkles, Users, TrendingUp, Clock } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience blazing fast performance with optimized code and modern infrastructure.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security to keep your data safe and protected at all times.',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Design',
    description: 'Stunning, intuitive interfaces that users love and enjoy interacting with.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with powerful collaboration tools and features.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics',
    description: 'Gain valuable insights with comprehensive analytics and reporting tools.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help you whenever you need assistance.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-black mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-600">
            Powerful features designed to help you achieve your goals faster and more efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
