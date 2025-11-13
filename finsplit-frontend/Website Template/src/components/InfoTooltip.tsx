import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'dark' | 'light';
}

export function InfoTooltip({ text, position = 'top', variant = 'dark' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800',
  };

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
        className={`w-5 h-5 flex items-center justify-center rounded-full transition-all cursor-help group flex-shrink-0 ${
          variant === 'light' 
            ? 'bg-white/20 hover:bg-white/30' 
            : 'bg-blue-100 hover:bg-blue-500'
        }`}
      >
        <Info className={`w-3.5 h-3.5 transition-colors ${
          variant === 'light'
            ? 'text-white group-hover:text-white'
            : 'text-blue-600 group-hover:text-white'
        }`} />
      </button>
      
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-in fade-in duration-200`}
          style={{ width: 'max-content', maxWidth: '280px' }}
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
            {text}
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
