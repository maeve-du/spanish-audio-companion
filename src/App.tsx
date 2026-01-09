import React, { useState, useCallback, useEffect } from 'react'
import { AudioPlayerProvider } from './contexts/AudioPlayerContext'
import { SearchBar } from './components/SearchBar'
import { AlphabetNav } from './components/AlphabetNav'
import { WordList } from './components/WordList'

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleLetterClick = useCallback(
    (letter: string) => {
      if (searchQuery.trim()) return // Don't navigate when searching

      setActiveLetter(letter)
      const scrollToLetter = (window as any).__scrollToLetter
      if (scrollToLetter) {
        scrollToLetter(letter)
      }

      // Close nav after clicking a letter (optional, for better UX)
      setTimeout(() => setIsNavOpen(false), 500)
    },
    [searchQuery]
  )

  const handleToggleNav = useCallback(() => {
    setIsNavOpen((prev) => !prev)
  }, [])

  const handleCloseNav = useCallback(() => {
    setIsNavOpen(false)
  }, [])

  const handleSearchFocusChange = useCallback((isFocused: boolean) => {
    setIsSearchFocused(isFocused)
    // Close nav when search is focused
    if (isFocused) {
      setIsNavOpen(false)
    }
  }, [])

  // Update active letter based on scroll position
  useEffect(() => {
    const updateActiveLetter = (letter: string) => {
      setActiveLetter(letter)
    }

    // Expose function for scroll synchronization
    ;(window as any).__updateActiveLetter = updateActiveLetter

    return () => {
      delete (window as any).__updateActiveLetter
    }
  }, [])

  // Store initial viewport height to prevent layout shifts when keyboard opens
  const [viewportHeight, setViewportHeight] = React.useState<number | null>(null)

  useEffect(() => {
    // Capture the initial viewport height on mount
    setViewportHeight(window.innerHeight)
  }, [])

  // Prevent body scroll and lock viewport height when search is focused
  useEffect(() => {
    if (isSearchFocused) {
      // Store current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isSearchFocused])

  return (
    <AudioPlayerProvider>
      <div
        className='flex flex-col bg-[#FFF8EB] overflow-hidden'
        style={{
          height: viewportHeight ? `${viewportHeight}px` : '100vh',
          maxHeight: viewportHeight ? `${viewportHeight}px` : '100vh'
        }}>
        {/* Header */}
        <header className='flex-shrink-0 z-40 bg-primary text-primary-foreground shadow-md'>
          <div className='max-w-4xl mx-auto px-4 py-4'>
            <h1 className='text-2xl font-bold text-center'>Español Dict Audio Companion</h1>
          </div>
        </header>

        {/* Main Content - Scrollable area with proper height */}
        <main className='flex-1 overflow-y-auto max-w-4xl mx-auto w-full'>
          <div className='px-0'>
            <WordList searchQuery={searchQuery} onLetterClick={handleLetterClick} />
          </div>
        </main>

        {/* Search Bar - Fixed at bottom */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder='Search...'
          onToggleNav={handleToggleNav}
          showNavToggle={!searchQuery.trim()}
          onFocusChange={handleSearchFocusChange}
        />

        {/* Alphabet Navigation - Toggleable Overlay */}
        {!searchQuery.trim() && !isSearchFocused && (
          <AlphabetNav
            onLetterClick={handleLetterClick}
            activeLetter={activeLetter}
            isOpen={isNavOpen}
            onClose={handleCloseNav}
          />
        )}
      </div>
    </AudioPlayerProvider>
  )
}

export default App
