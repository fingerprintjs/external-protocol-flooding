import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { initDetection } from 'detector/hooks'
import { Footer, Centered, BrowserIcons, Logo } from 'components/ui'

export function Welcome() {
  const history = useHistory()
  const handleStart = useCallback(() => {
    initDetection()
    history.push('/progress')
  }, [history])

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
      </Centered>
      <Footer />
    </>
  )
}