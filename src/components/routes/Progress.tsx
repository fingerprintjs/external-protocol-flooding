import React, { useEffect, useState } from 'react'
import { useDetectionProgress } from 'components/detector/hooks'
import { applications } from 'components/detector/const'
import { detectNext, DetectionResult } from 'components/detector/detection'

export function Progress() {
  const [localCounter, setLocalCounter] = useState(0)
  const progress = useDetectionProgress()
  const percent = (progress.current / progress.total).toFixed(2)

  useEffect(() => {
    detectNext().then((result) => {
      if (result === DetectionResult.Ready) {
        setLocalCounter(localCounter + 1)
      }
    })
  }, [localCounter])

  return (
    <>
      <h2>Please wait</h2>
      <div>Checked {progress.current} out of {progress.total} ({percent}%)</div>
      <ul>
        {progress.state.map((isDetected: boolean, index: number) => {
          const appData = applications[index]

          return <li key={index}>{appData.title}: {isDetected ? <b>Installed</b> : 'Not found' }</li>
        })}
      </ul>
      
    </>
  )
}