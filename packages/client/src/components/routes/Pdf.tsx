import React from 'react'

const contents = '%PDF-1.4\n'
  + '%����\n'
  + '5 0 obj\n'
  + '<</Type /Pages\n'
  + '/Count 1\n'
  + '/Kids [2 0 R]>>\n'
  + 'endobj\n'
  + '6 0 obj\n'
  + '<</Type /Catalog\n'
  + '/Pages 5 0 R>>\n'
  + 'endobj\n'
  + 'xref\n'
  + '0 7\n'
  + '0000000000 65535 f \n'
  + '0000000015 00000 n \n'
  + '0000000494 00000 n \n'
  + '0000000270 00000 n \n'
  + '0000000307 00000 n \n'
  + '0000000694 00000 n \n'
  + '0000000749 00000 n \n'
  + 'trailer\n'
  + '<</Size 7\n'
  + '/Root 6 0 R\n'
  + '/Info 1 0 R>>\n'
  + 'startxref\n'
  + '796\n'
  + '%%EOF'

export function Pdf() {
  // We can not use data URL here since the iframe will be considered as
  // a frame with a different origin
  const blob = new Blob([contents], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  return (
    <>
      <iframe src={url} />
    </>
  )
}