import { createContext, useContext } from 'react'

export type IntroPhase = 'intro' | 'revealing' | 'done'

export const IntroContext = createContext<{ phase: IntroPhase; replay: () => void }>({
  phase: 'done',
  replay: () => {},
})

export const useIntro = () => useContext(IntroContext)
