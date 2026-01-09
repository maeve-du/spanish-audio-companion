import React, { useRef, useState, useEffect } from 'react';
import { SPANISH_ALPHABET } from '@/lib/words';
import { cn } from '@/lib/utils';

interface AlphabetNavProps {
  onLetterClick: (letter: string) => void;
  activeLetter?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlphabetNav: React.FC<AlphabetNavProps> = ({
  onLetterClick,
  activeLetter,
  isOpen,
  onClose,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleLetterClick = (letter: string) => {
    // Try to use global scroll function first (from WordList)
    const scrollToLetter = (window as any).__scrollToLetter;
    if (scrollToLetter) {
      scrollToLetter(letter);
    }
    // Also call the callback
    onLetterClick(letter);
  };

  const handleMouseDown = (letter: string) => {
    setIsDragging(false);
    handleLetterClick(letter);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      setIsDragging(true);
      const rect = navRef.current?.getBoundingClientRect();
      if (rect) {
        const y = e.clientY - rect.top;
        const letterHeight = rect.height / SPANISH_ALPHABET.length;
        const index = Math.floor(y / letterHeight);
        if (index >= 0 && index < SPANISH_ALPHABET.length) {
          handleLetterClick(SPANISH_ALPHABET[index]);
        }
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent list scrolling
    const rect = navRef.current?.getBoundingClientRect();
    if (rect) {
      const touch = e.touches[0];
      const y = touch.clientY - rect.top;
      const letterHeight = rect.height / SPANISH_ALPHABET.length;
      const index = Math.floor(y / letterHeight);
      if (index >= 0 && index < SPANISH_ALPHABET.length) {
        handleLetterClick(SPANISH_ALPHABET[index]);
      }
    }
  };

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Prevent body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/20"
      onClick={handleOverlayClick}
    >
      {/* Slide-in Navigation Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 w-16',
          'bg-card border-l-2 border-border shadow-2xl',
          'flex flex-col',
          'animate-in slide-in-from-right duration-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Letter Navigation - All 26 letters fit on screen */}
        <div
          ref={navRef}
          className={cn(
            'flex-1 flex flex-col items-center justify-center',
            'py-1 gap-0',
            'select-none'
          )}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {SPANISH_ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                if (!isDragging) {
                  handleLetterClick(letter);
                }
              }}
              onMouseDown={() => handleMouseDown(letter)}
              className={cn(
                'w-6 h-6 flex items-center justify-center flex-shrink-0',
                'text-xs font-bold',
                'rounded-full transition-all',
                'hover:bg-primary/20 hover:scale-110',
                activeLetter === letter
                  ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                  : 'text-foreground'
              )}
              aria-label={`Jump to letter ${letter.toUpperCase()}`}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
