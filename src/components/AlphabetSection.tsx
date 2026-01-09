import React, { useRef, useEffect } from 'react'
import { WordItem } from './WordItem'
import type { Word } from '@/lib/words'

interface AlphabetSectionProps {
  letter: string
  words: Word[]
  isActive: boolean
}

export const AlphabetSection: React.FC<AlphabetSectionProps> = ({ letter, words, isActive }) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isActive])

  if (words.length === 0) {
    return null
  }

  return (
    <div ref={sectionRef} className='mb-8' id={`section-${letter}`}>
      <h2 className='sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-4 py-3 text-2xl font-bold text-foreground border-b border-border mb-2'>
        {letter.toUpperCase()}
      </h2>
      <div className='divide-y divide-border'>
        {words.map((word) => (
          <WordItem key={word.word} word={word.word} />
        ))}
      </div>
    </div>
  )
}
