import React from 'react'
import sha1 from '@cryptography/sha1'
import { useDetectionProgress } from 'detector/hooks'
import { App, AppGrid, BrowserIcons, Centered, Footer, Hr, Logo } from 'components/ui'
import { applications } from 'detector/const'

export function Result() {
  const progress = useDetectionProgress()
  const idenifier = sha1(progress.state.map((item: boolean) => +item).toString().replaceAll(',', ''), 'hex').slice(0, 16)

  return (
    <>
      <Centered>
        <Logo />
        <p>Your 99,5% accurate personal ID is...</p>
        <h1>{idenifier}</h1>

        <Hr/>
      
        <h4>Verify this in other browsers!</h4>
        <p>This is your unique personal ID based on your fingerprint. Feel free to check if we can reveal you in other browsers including Tor!</p>
        <BrowserIcons />

        <Hr/>

      </Centered>
      <AppGrid>
        {progress.state.map((isDetected: boolean, index: number) => {
          const appData = applications[index]
          return <App {...appData} isDetected={isDetected} />
        })}
      </AppGrid>
      <Footer />
    </>
  )
}