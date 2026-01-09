/**
 * @file Audio file path configuration for Spanish Dictionary
 * @description Manages audio file URLs with support for both local development
 * and cloud/CDN deployment. Handles Spanish special characters in filenames.
 */

/**
 * Determines the base URL for audio files based on the environment
 * 
 * @returns {string} Base URL path for audio files
 * 
 * @description
 * - **Development:** Returns '/audio' for local Vite dev server
 * - **Production:** Uses VITE_AUDIO_BASE_URL environment variable if set,
 *   otherwise falls back to '/audio'
 * 
 * @example
 * // In development (npm run dev)
 * getAudioBaseUrl() // returns '/audio'
 * 
 * // In production with CDN
 * // Set VITE_AUDIO_BASE_URL=https://cdn.example.com/spanish-audio
 * getAudioBaseUrl() // returns 'https://cdn.example.com/spanish-audio'
 */
const getAudioBaseUrl = (): string => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return '/audio';
  }
  
  // Production: use environment variable or default to relative path
  return import.meta.env.VITE_AUDIO_BASE_URL || '/audio';
};

/**
 * Constructs the complete URL path to an audio file for a given Spanish word
 * 
 * Audio files are organized in folders by first letter:
 * /audio/words starting with the letter a/hola.mp3
 * 
 * @param {string} word - The Spanish word to get audio for
 * @returns {string} Complete URL path to the audio file
 * 
 * @example
 * getAudioUrl("hola")
 * // returns "/audio/words starting with the letter h/hola.mp3"
 * 
 * getAudioUrl("España")
 * // returns "/audio/words starting with the letter e/Espa%C3%B1a.mp3"
 * // Note: ñ is URL-encoded, but folder is 'e' (normalized)
 * 
 * getAudioUrl("Ñoño")
 * // returns "/audio/words starting with the letter n/%C3%91o%C3%B1o.mp3"
 * // Note: ñ words are in 'n' folder (normalized grouping)
 * 
 * @technical
 * - Normalizes first letter to determine folder (removes accents)
 * - URL-encodes word to handle special characters (ñ, á, etc.)
 * - Folder structure matches audio file organization in /public/audio/
 */
export const getAudioUrl = (word: string): string => {
  const baseUrl = getAudioBaseUrl();
  
  // Find the first letter of the word (normalized, removing accents)
  // This matches how words are organized in folders:
  // - "hola" → 'h' folder
  // - "Árbol" → 'a' folder (á normalized to a)
  // - "Ñoño" → 'n' folder (ñ normalized to n)
  const normalizedFirstChar = word
    .charAt(0)
    .toLowerCase()
    .normalize('NFD')                  // Decompose: ñ → n + ̃
    .replace(/[\u0300-\u036f]/g, '');  // Remove combining marks
  
  const firstLetter = normalizedFirstChar || 'a'; // Fallback to 'a' if empty
  
  // Folder name follows the structure in /public/audio/
  const folderName = `words starting with the letter ${firstLetter}`;
  
  // Encode the word to handle special characters in URL
  // This is crucial for Spanish characters: ñ, á, é, í, ó, ú, ü
  const encodedWord = encodeURIComponent(word);
  
  return `${baseUrl}/${folderName}/${encodedWord}.mp3`;
};

/**
 * Audio configuration object for external use
 * 
 * @exports audioConfig
 * @property {string} baseUrl - Current base URL for audio files
 * @property {function} getUrl - Function to construct full audio URL for a word
 * 
 * @example
 * import { audioConfig } from '@/lib/audio-config';
 * 
 * console.log(audioConfig.baseUrl); // '/audio' or CDN URL
 * const url = audioConfig.getUrl('hola'); // Get audio URL for "hola"
 */
export const audioConfig = {
  baseUrl: getAudioBaseUrl(),
  getUrl: getAudioUrl,
};
