import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDetectionProgress } from 'detector/hooks'
import { applications } from 'detector/const'
import { detectNext, DetectionResult } from 'detector/detection'
import { Centered, Footer, Logo, ProgressBar } from 'components/ui'

export function Progress() {
  const [localCounter, setLocalCounter] = useState(0)
  const progress = useDetectionProgress()
  const history = useHistory()

  useEffect(() => {
    detectNext().then((result) => {
      if (result === DetectionResult.Ready) {
        setLocalCounter(localCounter + 1)
      }
    })
  }, [localCounter])

  useEffect(() => {
    if (false) { // if (progress.current >= progress.total) {
      history.replace('/result')
    }
  }, [localCounter, progress])

  return (
    <Centered>
      <Logo />
      <h4>Wait a minute please!</h4>
      <p>We are detecting which apps you are using...</p>
      <ProgressBar total={progress.total} current={progress.current} />
    
      <ul>
        {progress.state.map((isDetected: boolean, index: number) => {
          const appData = applications[index]

          return <li key={index}>{appData.title}: {isDetected ? <b>Installed</b> : 'Not found' }</li>
        })}
      </ul>
      <Footer />
    </Centered>
  )
}