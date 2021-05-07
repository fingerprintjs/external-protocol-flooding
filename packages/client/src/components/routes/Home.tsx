import React, { useCallback, useState } from 'react'
import { Alert, InProgress, Result, TorBrowser, Welcome } from 'components/ui'
import { AlertMessage, ApplicationState, getInternalApplicationState } from 'detector/detection'
import { getBrowserFamily } from 'detector/browser'
import { BrowserFamily } from 'detector/types'

export function Home() {
  const target = getBrowserFamily()
  const [state, setState] = useState(getInternalApplicationState())
  const [alertMessage, setAlertMessage] = useState('')
  const handleAlert = useCallback((message: AlertMessage) => {
    setAlertMessage(message)
    setState(ApplicationState.Alerted)
  }, [])

  switch(state) {
    case ApplicationState.Ready:
      return <Result onRestart={() => setState(ApplicationState.Welcome)} />

    case ApplicationState.Alerted:
      return (
        <Alert
          text={alertMessage}
          onResume={() => setState(ApplicationState.InProgress)}
          onCancel={() => setState(ApplicationState.Welcome)}
        />
      )

    case ApplicationState.InProgress:
      if (target === BrowserFamily.TorBrowser) {
        return (
          <TorBrowser
            onComplete={() => setState(ApplicationState.Ready)}
          />
        )
      }

      return (
        <InProgress
          onAlert={handleAlert}
          onComplete={() => setState(ApplicationState.Ready)}
        />
      )

    default:
      return <Welcome onStart={() => setState(ApplicationState.InProgress)} />
  }
}