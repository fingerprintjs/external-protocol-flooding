import React from 'react'
import styles from './FakeCaptcha.module.css'

export function FakeCaptcha() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h3>Enter Captcha</h3>
        <p>Any 24 random chars (will be picture there)</p>
        <input type="text" />
      </div>
    </div>
  )
}