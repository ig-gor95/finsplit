import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-black">
              Your Brand
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-600 hover:text-black transition-colors">
              Home
            </a>
            <a href="#features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </a>
            <a href="#services" className="text-gray-600 hover:text-black transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-600 hover:text-black transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-600 hover:text-black transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">Log In</Button>
            <Button>Get Started</Button>
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
              <a href="#home" className="text-gray-600 hover:text-black transition-colors">
                Home
              </a>
              <a href="#features" className="text-gray-600 hover:text-black transition-colors">
                Features
              </a>
              <a href="#services" className="text-gray-600 hover:text-black transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-600 hover:text-black transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-black transition-colors">
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button variant="ghost" className="w-full">Log In</Button>
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
