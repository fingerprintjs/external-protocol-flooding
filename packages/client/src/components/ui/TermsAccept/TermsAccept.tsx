import React from 'react'
import styles from './TermsAccept.module.css'


export function TermsAccept() {
  return (
    <div className={styles.container}>
      by clicking this button I agree to the <a href="/terms">terms</a>.
    </div>
  )
}