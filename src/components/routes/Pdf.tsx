import { sendWindowMessage } from 'detector/window'
import React from 'react'

export function Pdf() {
  function handleOnload() {
    sendWindowMessage('pdf_loaded')
  }

  return (
    <>
      <embed onLoad={handleOnload} src="data:application/pdf;base64,JVBERi0xLg10cmFpbGVyPDwvUm9vdDw8L1BhZ2VzPDwvS2lkc1s8PC9NZWRpYUJveFswIDAgMyAzXT4+XT4+Pj4+Pg=="></embed>
    </>
  )
}