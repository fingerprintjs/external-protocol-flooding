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
        <h2>{idenifier}</h2>
        { isLoading ? (
          <p>This is your identifier. Please wait...</p>
        ) : (
          stats.count < 2 ? (
            <p>This is your identifier. It is unique among <b>{stats.total}</b> tests so far.</p>
          ) : (
            <p>
              This is your identifier. It was seen <b>{stats.count}</b> times among <b>{stats.total}</b> tests so far. <br/>
              That means it is <b>{percent}%</b> unique.
            </p>
          )
        )}

        <a onClick={onRestart} style={{ marginBottom: 32 }}>Want to try again?</a>

        <Hr/>

      </Centered>
      <AppGrid layout='full' />
      <Centered>
        <h4 style={{ marginTop: -50 }}>Verify your result in other browsers</h4>
        <p>
          Compare your identifier by running this demo in other browsers, including Tor Browser.
        </p>
        <BrowserIcons />
        <Hr/>
      </Centered>
      <Footer />
    </>
  )
}