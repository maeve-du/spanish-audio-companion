import React from 'react'
import { useAudioPlayer } from '@/contexts/AudioPlayerContext'
import { Play, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WordItemProps {
  word: string
}

export const WordItem: React.FC<WordItemProps> = ({ word }) => {
  const { currentWord, isPlaying, playWord } = useAudioPlayer()
  const isCurrentWord = currentWord === word
  const isCurrentlyPlaying = isCurrentWord && isPlaying

  const handleClick = () => {
    playWord(word)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full px-4 flex items-center justify-between',
        // 'hover:bg-muted/50 transition-colors',
        'hover:bg-[#FFE7A6] transition-colors',
        'text-left h-16', // Exact fixed height
        isCurrentWord && 'bg-[#FFE7A6]'
      )}
      aria-label={`Play audio for ${word}`}>
      <span className='text-base font-medium text-foreground leading-none'>{word}</span>
      {/* Fixed width container for right side - ensures same space regardless of content */}
      <div className='flex items-center gap-2 h-10 w-[120px] justify-end flex-shrink-0'>
        {isCurrentlyPlaying ? (
          <>
            <Volume2 className='h-5 w-5 animate-pulse flex-shrink-0 text-primary' />
            <span className='text-sm text-muted-foreground leading-none'>Playing...</span>
          </>
        ) : (
          <div
            className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors',
              'flex-shrink-0 ml-auto'
            )}>
            <Play className='h-5 w-5 ml-0.5 ' fill='currentColor' />
          </div>
        )}
      </div>
    </button>
  )
}
