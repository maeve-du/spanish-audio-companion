/**
 * @file Custom React hook for loading and managing word data
 * @description Fetches Spanish word data from JSON file and provides loading/error states
 */

import { useState, useEffect } from 'react';
import type { Word } from '@/lib/words';

/**
 * Custom hook for fetching and managing Spanish word list
 * 
 * @returns {{
 *   words: Word[],
 *   loading: boolean,
 *   error: Error | null
 * }} Object containing word data, loading state, and error state
 * 
 * @description
 * Loads the complete Spanish word list from /public/words.json on component mount.
 * The data includes 3,612 Spanish words with normalized search fields.
 * 
 * **State Management:**
 * - `words`: Array of Word objects (empty until loaded)
 * - `loading`: true during fetch, false when complete or error
 * - `error`: null on success, Error object on failure
 * 
 * **Lifecycle:**
 * 1. Component mounts → useEffect triggers
 * 2. Set loading=true
 * 3. Fetch /words.json
 * 4. Parse JSON
 * 5. Set words state + loading=false
 * 6. Or set error state on failure
 * 
 * @example
 * function WordList() {
 *   const { words, loading, error } = useWords();
 * 
 *   if (loading) return <div>Loading words...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       {words.map(word => (
 *         <div key={word.word}>{word.word}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * @technical
 * - Runs only once on mount (empty dependency array)
 * - Fetches from public directory (no authentication needed)
 * - Error handling includes network failures and JSON parse errors
 * - Data is cached in component state (not refetched on re-render)
 * 
 * @performance
 * - JSON file size: ~298KB (3,612 words)
 * - Parse time: ~10-20ms on modern browsers
 * - One-time load, not repeated
 */
export const useWords = () => {
  // State for storing word array
  const [words, setWords] = useState<Word[]>([]);
  
  // Loading state: true during fetch
  const [loading, setLoading] = useState(true);
  
  // Error state: null on success, Error object on failure
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /**
     * Async function to load words from JSON file
     * 
     * @async
     * @throws {Error} Network error or invalid JSON
     */
    const loadWords = async () => {
      try {
        setLoading(true);
        
        // Fetch words.json from public directory
        // Note: /words.json maps to /public/words.json in Vite
        const response = await fetch('/words.json');
        
        // Check for HTTP errors (404, 500, etc.)
        if (!response.ok) {
          throw new Error('Failed to load words');
        }
        
        // Parse JSON response
        const data: Word[] = await response.json();
        
        // Update state with word data
        setWords(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        // Handle any errors (network, parsing, etc.)
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error loading words:', err);
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    // Execute load function on mount
    loadWords();
  }, []); // Empty array = run only once on mount

  return { words, loading, error };
};
