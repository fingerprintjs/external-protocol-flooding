import React, { useEffect, useState } from 'react'
import { useDetectionProgress } from 'detector/hooks'
import { detectNext, DetectionResult } from 'detector/detection'
import { AppGrid, Centered, Footer, Logo, ProgressBar } from 'components/ui'

type Props = {
  onComplete: () => unknown
}

export function InProgress({ onComplete }: Props) {
  const [localCounter, setLocalCounter] = useState(0)
  const progress = useDetectionProgress()

  useEffect(() => {
    detectNext().then((result) => {
      if (result === DetectionResult.Ready) {
        setLocalCounter(localCounter + 1)
      }
    })
  }, [localCounter])

  useEffect(() => {
    if (progress.current >= progress.total) {
      onComplete()
    }
  }, [localCounter, progress])

  return (
    <>
      <Centered>
        <Logo />
        <h4>Wait a minute please!</h4>
        <p>We are detecting which apps you are using...</p>
        <ProgressBar total={progress.total} current={progress.current} />
      
      </Centered>
      <AppGrid layout='short' />
      <Footer />
    </>
  )
}