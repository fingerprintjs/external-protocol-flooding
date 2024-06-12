import React from 'react'
import { AppGrid, BrowserIcons, Centered, Footer, Hr, Logo } from 'components/ui'
import { useIdentifier } from 'hooks/api'

type Props = {
  onRestart: () => unknown
}

export function Result({ onRestart }: Props) {
  const idenifier = useIdentifier()

  return (
    <>
      <Centered>
        <Logo />
        <h1>{idenifier?.toUpperCase()}</h1>
        <p>This is your identifier</p>

        <a onClick={onRestart} style={{ marginBottom: 32 }}>
          Want to try again?
        </a>

        <Hr />
      </Centered>
      <AppGrid layout='full' />
      <Centered>
        <h4 style={{ marginTop: -50 }}>Verify your result in other browsers</h4>
        <p>Compare your identifier by running this demo in other browsers, including Tor Browser.</p>
        <BrowserIcons />
        <Hr />
      </Centered>
      <Footer />
    </>
  )
}
