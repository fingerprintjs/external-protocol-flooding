import React, { useCallback } from 'react'
import { createAdditionalWindow, isAdditinalWindowOpened } from 'detector/window'
import { Footer, Centered, Logo } from 'components/ui'
import { Hr } from '../Hr/Hr'
import { revertLatestResult } from 'detector/detection'

type Props = {
  text: string
  onResume: () => unknown
}

export function Alert({ text, onResume }: Props) {
  const handleResume = useCallback(() => {
    revertLatestResult()
  
    if (!isAdditinalWindowOpened()) {
      createAdditionalWindow()
    }
  
    onResume()
  }, [])

  return (
    <>
      <Centered>
        <Logo />
        <h4>{text}</h4>
        <Hr />
        <button onClick={handleResume}>Continue</button>
        <Footer />
      </Centered>
    </>
  )
}