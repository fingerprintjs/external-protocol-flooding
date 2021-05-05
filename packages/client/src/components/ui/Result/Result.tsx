import React from 'react'
import sha1 from '@cryptography/sha1'
import { useDetectionProgress } from 'detector/hooks'
import { AppGrid, BrowserIcons, Centered, Footer, Hr, Logo } from 'components/ui'

type Props = {
  onRestart: () => unknown
}

export function Result({ onRestart }: Props) {
  const progress = useDetectionProgress()
  const idenifier = sha1(progress.state.map((item: boolean) => +item).toString().replace(/,/g, ''), 'hex').slice(0, 16)

  return (
    <>
      <Centered>
        <Logo />
        <p>Your 99,5% accurate personal ID is...</p>
        <h1>{idenifier}</h1>
        <a onClick={onRestart}>Want to try again?</a>

        <Hr/>
      
        <h4>Verify this in other browsers!</h4>
        <p>This is your unique personal ID based on your fingerprint. Feel free to check if we can reveal you in other browsers including Tor!</p>
        <BrowserIcons />

        <Hr/>

      </Centered>
      <AppGrid layout='full' />
      <Footer />
    </>
  )
}