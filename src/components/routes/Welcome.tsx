import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { initDetection } from 'components/detector/hooks'

export function Welcome() {
  const history = useHistory()
  const handleStart = useCallback(() => {
    initDetection()
    history.push('/progress')
  }, [history])

  return (
    <>
      <h2>Cross Browser Cookie Demo</h2>
      <button onClick={handleStart}>Get my identifier</button>
    </>
  )
}