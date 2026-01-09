import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useWords } from '@/hooks/useWords';
import { groupWordsByLetter, SPANISH_ALPHABET, type Word } from '@/lib/words';
import { fuzzySearch } from '@/lib/search';
import { AlphabetSection } from './AlphabetSection';
import { WordItem } from './WordItem';

interface WordListProps {
  searchQuery: string;
  onLetterClick?: (letter: string) => void;
}

export const WordList: React.FC<WordListProps> = ({
  searchQuery,
  onLetterClick,
}) => {
  const { words, loading, error } = useWords();
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearching = searchQuery.trim().length > 0;

  const { groupedWords, searchResults } = useMemo(() => {
    if (loading || error) {
      return { groupedWords: new Map<string, Word[]>(), searchResults: [] };
    }

    if (isSearching) {
      const allWordStrings = words.map((w) => w.word);
      const matchedWords = fuzzySearch(searchQuery, allWordStrings);
      const matchedWordObjects = matchedWords
        .map((word) => words.find((w) => w.word === word))
        .filter((w): w is Word => w !== undefined);
      return {
        groupedWords: new Map<string, Word[]>(),
        searchResults: matchedWordObjects,
      };
    }

    const grouped = groupWordsByLetter(words);
    return { groupedWords: grouped, searchResults: [] };
  }, [words, searchQuery, loading, error, isSearching]);

  // Handle letter navigation - exposed globally for AlphabetNav
  const handleLetterNavigation = React.useCallback((letter: string) => {
    if (isSearching) return;
    setActiveLetter(letter);
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Reset active letter after scroll
    setTimeout(() => setActiveLetter(null), 1000);
    // Call optional callback
    onLetterClick?.(letter);
  }, [isSearching, onLetterClick]);

  // Expose handler globally for AlphabetNav component
  useEffect(() => {
    (window as any).__scrollToLetter = handleLetterNavigation;
    return () => {
      delete (window as any).__scrollToLetter;
    };
  }, [handleLetterNavigation]);

  // Scroll synchronization - update active letter based on scroll position
  useEffect(() => {
    if (isSearching || loading || error) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        // Find which section is currently in view
        const sections = SPANISH_ALPHABET.map((letter) => {
          const element = document.getElementById(`section-${letter}`);
          if (!element) return { letter, top: Infinity };
          const rect = element.getBoundingClientRect();
          return { letter, top: Math.abs(rect.top) };
        });

        // Find the section with the smallest distance from top
        const closestSection = sections.reduce((prev, current) => {
          return current.top < prev.top ? current : prev;
        });

        if (closestSection && closestSection.top !== Infinity) {
          const updateActiveLetter = (window as any).__updateActiveLetter;
          if (updateActiveLetter) {
            updateActiveLetter(closestSection.letter);
          }
        }
      }, 100);
    };

    // Get the main scrollable container (the parent of WordList)
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => {
        mainElement.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [isSearching, loading, error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading words...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-destructive">Error loading words</div>
          <div className="text-sm text-muted-foreground mt-2">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {isSearching ? (
        <div className="divide-y divide-border">
          {searchResults.length > 0 ? (
            searchResults.map((word) => (
              <WordItem key={word.word} word={word.word} />
            ))
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No words found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      ) : (
        <div>
          {SPANISH_ALPHABET.map((letter) => {
            const letterWords = groupedWords.get(letter) || [];
            return (
              <AlphabetSection
                key={letter}
                letter={letter}
                words={letterWords}
                isActive={activeLetter === letter}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
