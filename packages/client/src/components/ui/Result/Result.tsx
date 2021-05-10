import React from 'react'
import { AppGrid, BrowserIcons, Centered, Footer, Hr, Logo } from 'components/ui'
import { useStatistics, useIdentifier } from 'hooks/api'

type Props = {
  onRestart: () => unknown
}

export function Result({ onRestart }: Props) {
  const { stats, isLoading } = useStatistics()
  const idenifier = useIdentifier()
  const percent = (100 - stats.count/stats.total*100).toFixed(2)

  return (
    <>
      <Centered>
        <Logo />
        <p>Your cross-browser identifier is...</p>
        <h1>{idenifier}</h1>
        { isLoading ? (
          <p>Loading statistics data...</p>
        ) : (
          stats.count <= 2 ? (
            <p>Your identifier is unique among <b>{stats.total}</b> users we checked so far!</p>
          ) : (
            <p>
              Your identifier was seen <b>{stats.count}</b> times among <b>{stats.total}</b> users we checked so far. <br/>
              That means it is <b>{percent}%</b> unique!
            </p>
          )
        )}

        <a onClick={onRestart}>Want to try again?</a>

        <Hr/>
      
        <h4>Verify this in other browsers!</h4>
        <p>
          This is your unique ID based on the applications that you have installed. <br />
          You can also try it in other browsers, including Tor Browsers!
        </p>
        <BrowserIcons />

        <Hr/>

      </Centered>
      <AppGrid layout='full' />
      <Footer />
    </>
  )
}