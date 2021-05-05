import React, { useState } from 'react'
import { InProgress, Result, Welcome } from 'components/ui'
import { ApplicationState, getInternalApplicationState } from 'detector/detection'

export function Home() {
  const [state, setState] = useState(getInternalApplicationState())

  switch(state) {
    case ApplicationState.Ready:
      return <Result onRestart={() => setState(ApplicationState.Welcome)} />

    case ApplicationState.InProgress:
      return <InProgress onComplete={() => setState(ApplicationState.Ready)} />

    default:
      return <Welcome onStart={() => setState(ApplicationState.InProgress)} />
  }
}