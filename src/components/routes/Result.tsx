import React from 'react'
import { useDetectionProgress } from 'detector/hooks'
import { BrowserIcons, Centered, Footer, Hr, Logo } from 'components/ui'

export function Result() {
  const progress = useDetectionProgress()
  const idenifier = progress.state.map((item: boolean) => +item).toString().replaceAll(',', '')

  return (
    <Centered>
      <Logo />
      <p>Your 99,5% accurate personal ID is...</p>
      <h1>{idenifier}</h1>

      <Hr/>
    
      <h4>Verify this in other browsers!</h4>
      <p>This is your unique personal ID based on your fingerprint. Feel free to check if we can reveal you in other browsers including Tor!</p>
      <BrowserIcons />
      <Footer />
    </Centered>
  )
}