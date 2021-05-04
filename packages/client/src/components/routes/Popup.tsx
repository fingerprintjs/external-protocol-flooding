import React, { useEffect } from 'react'
import { detectNext } from 'detector/detection'

export function Popup() {
  useEffect(() => {
    detectNext()
  }, [])

  return (
    <>
      <h2>Please wait</h2>
    </>
  )
}