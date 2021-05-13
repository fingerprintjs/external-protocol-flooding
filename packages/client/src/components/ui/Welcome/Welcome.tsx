import React, { useCallback } from 'react'
import { initDetection } from 'detector/hooks'
import { getBrowserFamily } from 'detector/browser'
import { BrowserFamily } from 'detector/types'
import { Footer, Centered, BrowserIcons, Logo } from 'components/ui'
import { TermsAccept } from '../TermsAccept/TermsAccept'
import { Hr } from '../Hr/Hr'

type Props = {
  onStart: () => unknown
}

export function Welcome({ onStart }: Props) {
  const target = getBrowserFamily()
  const isMobile = window.innerWidth <= 680
  const isChromeLinux = target === BrowserFamily.Chrome && /Linux/.test(navigator.platform)

  const handleStart = useCallback(() => {
    initDetection()
    onStart()
  }, [])

  return (
    <>
      <Centered>
        <Logo />
        <h1>External Protocol <br/> Flooding Vulnerability</h1>
        <h4>
          This demo generates an accurate cross-browser identifier by checking a list of installed applications on your computer.
          Works on desktop Chrome, Safari, Firefox and Tor Browser.
        </h4>
        <BrowserIcons />

        {true && (
          <>
            <h4>This demo may work incorrect on Chrome on Linux</h4>
            <a onClick={handleStart}>Try it anyway</a>
          </>
        )}

        {!isChromeLinux && isMobile && (
          <>
            <Hr/>
            <h4>
              This demo works only on desktop browsers
            </h4>
          </>
        )}
      
        {false && !isChromeLinux && !isMobile && (
          <>
            <button onClick={handleStart}>Get My Identifier</button>
            <TermsAccept />
          </>
        )}
        <Footer />
      </Centered>
    </>
  )
}