import { ImageWithFallback } from './figma/ImageWithFallback';
import { Check } from 'lucide-react';
import { Button } from './ui/button';

export function Services() {
  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjIwNDc4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-black">
              Professional Services Tailored to Your Needs
            </h2>
            <p className="text-gray-600">
              We provide comprehensive solutions to help your business thrive in the digital landscape.
            </p>
            
            <ul className="space-y-4">
              {[
                'Strategic planning and consultation',
                'Custom development solutions',
                'Design and user experience',
                'Marketing and growth strategies',
                'Ongoing support and maintenance',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Button size="lg">
              View All Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
