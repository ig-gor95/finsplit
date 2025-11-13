import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  return (
    <section id="about" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-black">
              About Our Company
            </h2>
            <p className="text-gray-600">
              We're a team of passionate professionals dedicated to delivering exceptional results. With years of experience and a commitment to innovation, we help businesses transform and grow.
            </p>
            <p className="text-gray-600">
              Our approach combines cutting-edge technology with human-centered design to create solutions that not only work flawlessly but also delight users.
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-6">
              <div>
                <div className="text-black">500+</div>
                <div className="text-gray-600">Projects</div>
              </div>
              <div>
                <div className="text-black">50+</div>
                <div className="text-gray-600">Team Members</div>
              </div>
              <div>
                <div className="text-black">98%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1635444282667-029d62d679f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZGVzaWdufGVufDF8fHx8MTc2MjExMzY5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Technology and design"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
