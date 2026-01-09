/**
 * @file Audio Player Context - Global audio playback state management
 * @description Provides centralized control for Spanish word audio playback across
 * the entire application. Ensures only one audio plays at a time and manages
 * playback state globally.
 */

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Type definition for Audio Player Context value
 * 
 * @interface AudioPlayerContextType
 * @property {string | null} currentWord - The word currently being played (null if none)
 * @property {boolean} isPlaying - Whether audio is currently playing
 * @property {function} playWord - Function to play audio for a word
 * @property {function} stop - Function to stop current audio playback
 */
interface AudioPlayerContextType {
  currentWord: string | null;
  isPlaying: boolean;
  playWord: (word: string) => Promise<void>;
  stop: () => void;
}

/**
 * React Context for audio player state
 * 
 * @description
 * Provides global audio state that can be accessed by any component
 * wrapped in AudioPlayerProvider. Undefined by default to enforce
 * proper provider usage.
 */
const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

/**
 * Custom hook to access audio player context
 * 
 * @returns {AudioPlayerContextType} Audio player state and methods
 * @throws {Error} If used outside of AudioPlayerProvider
 * 
 * @example
 * function WordItem({ word }: { word: string }) {
 *   const { playWord, currentWord, isPlaying } = useAudioPlayer();
 *   const isPlaying = currentWord === word && isPlaying;
 *   
 *   return (
 *     <button onClick={() => playWord(word)}>
 *       {isPlaying ? 'Playing...' : 'Play'}
 *     </button>
 *   );
 * }
 */
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};

/**
 * Props for AudioPlayerProvider component
 * 
 * @interface AudioPlayerProviderProps
 * @property {React.ReactNode} children - Child components to wrap
 */
interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

/**
 * Audio Player Provider Component
 * 
 * @component
 * @param {AudioPlayerProviderProps} props - Component props
 * @returns {JSX.Element} Provider component wrapping children
 * 
 * @description
 * Manages global audio playback state using React Context. Should wrap the
 * entire application (or at least all components that need audio playback).
 * 
 * **Features:**
 * - Single audio instance management (only one plays at a time)
 * - Automatic cleanup of audio resources
 * - Event-driven state updates (ended, error, play, pause)
 * - Async audio loading and playback
 * 
 * **State Management:**
 * - `currentWord`: Tracks which word is playing (for visual feedback)
 * - `isPlaying`: Boolean flag for play/pause state
 * - `audioRef`: Ref to current Audio element (for cleanup)
 * 
 * @example
 * // In App.tsx or main.tsx
 * function App() {
 *   return (
 *     <AudioPlayerProvider>
 *       <YourComponents />
 *     </AudioPlayerProvider>
 *   );
 * }
 */
export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  // State: currently playing word (null if none)
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  
  // State: playback status (true if audio is playing)
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Ref: reference to HTML Audio element (for cleanup and control)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Stops the currently playing audio
   * 
   * @function stop
   * @returns {void}
   * 
   * @description
   * - Pauses audio playback
   * - Resets playback position to start
   * - Clears current word state
   * - Updates isPlaying to false
   * 
   * Used internally by playWord() to stop previous audio before starting new one.
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();        // Pause playback
      audioRef.current.currentTime = 0; // Reset to beginning
    }
    setCurrentWord(null);              // Clear current word
    setIsPlaying(false);               // Update playing state
  }, []);

  /**
   * Plays audio for a Spanish word
   * 
   * @async
   * @function playWord
   * @param {string} word - The Spanish word to play audio for
   * @returns {Promise<void>}
   * 
   * @description
   * **Flow:**
   * 1. Stop any currently playing audio
   * 2. Construct audio URL for the word
   * 3. Create new Audio element
   * 4. Attach event listeners (ended, error, play, pause)
   * 5. Start playback
   * 6. Update state (currentWord, isPlaying)
   * 
   * **Event Handling:**
   * - `ended`: Audio finished playing → reset state
   * - `error`: Audio failed to load → reset state, log error
   * - `play`: Playback started → set isPlaying=true
   * - `pause`: Playback paused → set isPlaying=false
   * 
   * **Error Handling:**
   * - Missing audio file: Logs error, resets state
   * - Network error: Logs error, resets state
   * - Playback error: Logs error, resets state
   * 
   * @example
   * const { playWord } = useAudioPlayer();
   * await playWord("hola"); // Plays hola.mp3
   * 
   * @technical
   * - Uses dynamic import to load audio-config (code splitting)
   * - Creates new Audio element each time (ensures clean state)
   * - Event listeners are attached to audio element (not global)
   * - Async/await for proper error handling
   */
  const playWord = useCallback(async (word: string) => {
    // Stop any currently playing audio first
    // This ensures only one audio plays at a time
    stop();

    // Dynamically import audio config (code splitting optimization)
    const { getAudioUrl } = await import('@/lib/audio-config');
    const audioUrl = getAudioUrl(word);

    // Create new HTML5 Audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Update state immediately (before audio loads)
    setCurrentWord(word);
    setIsPlaying(true);

    /**
     * Event: Audio playback ended naturally
     * 
     * Triggered when audio reaches the end. Resets state to allow
     * playing another word or replaying the same word.
     */
    audio.addEventListener('ended', () => {
      setCurrentWord(null);
      setIsPlaying(false);
    });

    /**
     * Event: Audio loading or playback error
     * 
     * Handles errors such as:
     * - 404: Audio file not found
     * - Network error: Failed to fetch
     * - Decode error: Invalid audio file
     * 
     * Logs error to console for debugging but doesn't show user error
     * (graceful degradation - app continues to work).
     */
    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      setCurrentWord(null);
      setIsPlaying(false);
    });

    /**
     * Event: Audio paused
     * 
     * Updates state when audio is paused (though our app doesn't
     * expose pause functionality, this handles edge cases).
     */
    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    /**
     * Event: Audio playback started
     * 
     * Ensures isPlaying state is in sync with actual playback.
     */
    audio.addEventListener('play', () => {
      setIsPlaying(true);
    });

    // Start audio playback (async)
    try {
      await audio.play();
    } catch (error) {
      // Handle playback errors (e.g., user didn't interact with page yet)
      console.error('Failed to play audio:', error);
      setCurrentWord(null);
      setIsPlaying(false);
    }
  }, [stop]);

  /**
   * Cleanup effect - runs on component unmount
   * 
   * @description
   * Ensures audio resources are properly cleaned up when provider unmounts.
   * Prevents memory leaks and stops audio if component unmounts mid-playback.
   * 
   * This is important for:
   * - Hot module replacement during development
   * - Route changes (if provider is not at root level)
   * - Testing (ensures clean state between tests)
   */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();   // Stop playback
        audioRef.current = null;     // Clear reference
      }
    };
  }, []);

  // Provide audio player state and methods to all children
  return (
    <AudioPlayerContext.Provider value={{ currentWord, isPlaying, playWord, stop }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
