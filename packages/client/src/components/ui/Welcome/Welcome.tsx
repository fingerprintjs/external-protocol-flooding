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
        <h1>External Protocol Flooding Vulnerability</h1>
        <h4>
          Allows anyone to perform reliable cross-border tracking. 
          It works on desktop Chrome, Safari, Firefox and even Tor.
        </h4>
        <BrowserIcons />
        <button onClick={handleStart}>Get My Identifier</button>
        <Footer />
      </Centered>
    </>
  )
}