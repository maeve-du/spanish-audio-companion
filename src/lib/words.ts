/**
 * @file Word list management and utilities for Spanish dictionary
 * @description Provides core functionality for managing Spanish words, including
 * normalization for search, grouping by letter, and Spanish character handling.
 */

/**
 * Represents a Spanish word with search-optimized fields
 * 
 * @interface Word
 * @property {string} word - The original Spanish word with all accents and special characters
 * @property {string} normalized - Lowercase version with accents removed for search matching
 * @property {string} firstLetter - The normalized first letter (a-z) used for alphabetical grouping
 * 
 * @example
 * {
 *   word: "España",
 *   normalized: "espana",
 *   firstLetter: "e"
 * }
 */
export interface Word {
  word: string;
  normalized: string;
  firstLetter: string;
}

/**
 * Normalizes Spanish text for search operations by removing accents and converting to lowercase
 * 
 * This function uses Unicode NFD (Canonical Decomposition) to separate base characters
 * from combining diacritical marks, then removes those marks. This allows searching
 * for Spanish words without needing to type accents (e.g., "espanol" matches "español").
 * 
 * @param {string} text - The Spanish text to normalize
 * @returns {string} Lowercase text with all diacritical marks removed
 * 
 * @example
 * normalizeSpanishText("España") // returns "espana"
 * normalizeSpanishText("México") // returns "mexico"
 * normalizeSpanishText("niño") // returns "nino"
 * normalizeSpanishText("HOLA") // returns "hola"
 * 
 * @technical
 * - Uses NFD normalization: splits "é" into "e" + combining acute accent
 * - Regex [\u0300-\u036f] matches all combining diacritical marks (Unicode range)
 * - trim() removes leading/trailing whitespace
 */
export const normalizeSpanishText = (text: string): string => {
  return text
    .toLowerCase()                    // Convert to lowercase
    .normalize('NFD')                 // Decompose accented chars (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .trim();                          // Clean whitespace
};

/**
 * Extracts and normalizes the first letter of a word for alphabetical grouping
 * 
 * @param {string} word - The Spanish word to process
 * @returns {string} The normalized first letter (a-z), or empty string if word is empty
 * 
 * @example
 * getFirstLetter("hola") // returns "h"
 * getFirstLetter("Ñoño") // returns "n" (ñ normalized to n)
 * getFirstLetter("Árbol") // returns "a" (á normalized to a)
 */
export const getFirstLetter = (word: string): string => {
  const normalized = normalizeSpanishText(word);
  return normalized.charAt(0) || '';
};

/**
 * Placeholder function for generating word list from audio files
 * 
 * In production, words are pre-generated at build time by scanning the
 * /public/audio/ directory and creating /public/words.json. This function
 * exists for potential runtime generation but is not currently used.
 * 
 * @returns {Promise<Word[]>} Empty array (not implemented for runtime use)
 * 
 * @see useWords hook for actual word loading from words.json
 */
export const generateWordList = async (): Promise<Word[]> => {
  // Actual word list is loaded from /public/words.json
  // This file is generated at build time using a Node script that:
  // 1. Scans public/audio/ for all .mp3 files
  // 2. Extracts filenames as words
  // 3. Normalizes each word
  // 4. Writes to words.json
  
  return [];
};

/**
 * Groups an array of words by their first letter for alphabetical display
 * 
 * Creates a Map where keys are letters (a-z) and values are arrays of words
 * starting with that letter. Words within each group are sorted alphabetically
 * using Spanish locale collation rules.
 * 
 * @param {Word[]} words - Array of Word objects to group
 * @returns {Map<string, Word[]>} Map of letter → sorted array of words
 * 
 * @example
 * const words = [
 *   { word: "hola", normalized: "hola", firstLetter: "h" },
 *   { word: "adiós", normalized: "adios", firstLetter: "a" },
 *   { word: "hasta", normalized: "hasta", firstLetter: "h" }
 * ];
 * 
 * groupWordsByLetter(words)
 * // Returns:
 * // Map {
 * //   'a' => [{ word: "adiós", ... }],
 * //   'h' => [{ word: "hasta", ... }, { word: "hola", ... }]
 * // }
 * 
 * @technical
 * - Uses Map for O(1) letter lookup performance
 * - Sorts using localeCompare with 'es' locale for proper Spanish ordering
 * - Handles special Spanish characters like ñ correctly in sorting
 */
export const groupWordsByLetter = (words: Word[]): Map<string, Word[]> => {
  const groups = new Map<string, Word[]>();
  
  // Group words by first letter
  words.forEach((word) => {
    const letter = word.firstLetter;
    if (!groups.has(letter)) {
      groups.set(letter, []);
    }
    groups.get(letter)!.push(word);
  });
  
  // Sort words within each group using Spanish locale rules
  groups.forEach((wordList) => {
    wordList.sort((a, b) => a.word.localeCompare(b.word, 'es'));
  });
  
  return groups;
};

/**
 * Standard 26-letter alphabet (A-Z) used for navigation
 * 
 * Note: ñ is NOT included as a separate letter in the navigation.
 * Words starting with ñ are grouped under 'n' for simplicity and
 * to maintain a standard 26-letter navigation that fits on all screens.
 * 
 * @constant {string[]}
 */
export const SPANISH_ALPHABET = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];
