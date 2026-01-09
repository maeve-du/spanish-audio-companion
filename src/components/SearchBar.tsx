import React, { useState, useCallback } from 'react';
import { Search, X, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onToggleNav?: () => void;
  showNavToggle?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onToggleNav,
  showNavToggle = true,
  onFocusChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocusChange?.(true);
  }, [onFocusChange]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocusChange?.(false);
  }, [onFocusChange]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={cn(
                'w-full pl-10 pr-10 py-3 rounded-lg',
                'bg-input border border-input',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'transition-all'
              )}
              aria-label="Search words"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {value && (
              <button
                onClick={() => onChange('')}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'h-5 w-5 text-muted-foreground hover:text-foreground',
                  'transition-colors'
                )}
                aria-label="Clear search"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* A-Z Toggle Button */}
          {showNavToggle && onToggleNav && !isFocused && (
            <button
              onClick={onToggleNav}
              className={cn(
                'flex-shrink-0 px-4 py-3 rounded-lg',
                'bg-primary text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'flex items-center gap-2',
                'font-medium'
              )}
              aria-label="Toggle alphabet navigation"
              type="button"
            >
              <List className="h-5 w-5" />
              <span className="hidden sm:inline">A-Z</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
