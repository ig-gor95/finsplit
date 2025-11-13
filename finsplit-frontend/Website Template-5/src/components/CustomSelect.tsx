import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder,
  icon,
  className = ''
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2.5">
          {selectedOption?.icon ? (
            <div className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors flex items-center justify-center">
              {selectedOption.icon}
            </div>
          ) : icon && (
            <div className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-all flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-all ${
                  option.value === value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {option.icon && (
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      option.value === value 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      {option.icon}
                    </div>
                  )}
                  <span className={option.value === value ? 'font-medium' : ''}>
                    {option.label}
                  </span>
                </span>
                {option.value === value && (
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
