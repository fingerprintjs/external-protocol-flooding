import React, { useCallback, useState } from 'react'
import { Alert, InProgress, Result, Welcome } from 'components/ui'
import { AlertMessage, ApplicationState, getInternalApplicationState } from 'detector/detection'

export function Home() {
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