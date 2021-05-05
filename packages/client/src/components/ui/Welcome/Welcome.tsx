import React, { useCallback } from 'react'
import { initDetection } from 'detector/hooks'
import { Footer, Centered, BrowserIcons, Logo } from 'components/ui'

type Props = {
  onStart: () => unknown
}

export function Welcome({ onStart }: Props) {
  const handleStart = useCallback(() => {
    initDetection()
    onStart()
  }, [])

  return (
    <>
      <Centered>
        <Logo />
        <h1>Cross-Browser <br/> Cookie</h1>
        <h4>
          World's first fast and reliable desktop cross-browser tracking vulnerability!
          Works with the Firefox, Chrome, Safari and even Tor browsers!
        </h4>
        <BrowserIcons />
        <button onClick={handleStart}>Get My Identifier</button>
        <Footer />
      </Centered>
    </>
  )
}