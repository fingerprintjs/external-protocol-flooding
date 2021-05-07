import React, { useEffect, useState } from 'react'
import { useDetectionProgress } from 'detector/hooks'
import { detectTorBrowserInline, isDetectionCompleted } from 'detector/detection'
// import { isAdditinalWindowOpened } from 'detector/window'
import { AppGrid, Centered, Footer, Logo, ProgressBar } from 'components/ui'
import { FakeCaptcha } from '../FakeCaptcha/FakeCaptcha'

type Props = {
  onComplete: () => unknown
}

export function TorBrowser({ onComplete }: Props) {
  const [latestIndex, setLatestIndex] = useState(-1)
  const progress = useDetectionProgress()

  function handleUserGestureEvent() {
    if (!isDetectionCompleted()) {
      detectTorBrowserInline((index) => {
        setLatestIndex(index)
      })
    }
  }

  useEffect(() => {
    if (isDetectionCompleted()) {
      onComplete()
    }
  }, [latestIndex])

  useEffect(() => {
    addEventListener('keyup', handleUserGestureEvent)
    addEventListener('click', handleUserGestureEvent)

    handleUserGestureEvent()
    return () => {
      removeEventListener('keyup', handleUserGestureEvent)
      removeEventListener('click', handleUserGestureEvent)
    }
  }, [])

  return (
    <>
      <FakeCaptcha />
      <Centered>
        <Logo />
        <h4>Wait a minute please!</h4>
        <p>We are detecting which applications you have installed...</p>
        <ProgressBar total={progress.total} current={progress.current} />
      </Centered>
      <AppGrid layout='short' />
      <Footer />
    </>
  )
}