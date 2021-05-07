import React from 'react'
import { AppGrid, BrowserIcons, Centered, Footer, Hr, Logo } from 'components/ui'
import { useStatistics, useIdentifier } from 'hooks/api'

type Props = {
  onRestart: () => unknown
}

export function Result({ onRestart }: Props) {
  const { stats, isLoading } = useStatistics()
  const idenifier = useIdentifier()

  return (
    <>
      <Centered>
        <Logo />
        <p>Your cross-browser identifier is...</p>
        <h1>{idenifier}</h1>
        { isLoading ? (
          <p>Loading statistics data...</p>
        ) : (
          <p>This idenifier was seen {stats.count} times ({(stats.count/stats.total*100).toFixed(2)}%) from {stats.total} total</p>
        )}

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