import React, { useEffect } from 'react'
import captchaImage from 'assets/captcha.png'
import volumeIcon from 'assets/volume.svg'
import styles from './FakeCaptcha.module.css'

export function FakeCaptcha() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
  
    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [])

  return (
    <div className={styles.container}>
      <h3>Please verify that you are a human</h3>
      <img src={captchaImage} className={styles.image} alt="captcha" /><img src={volumeIcon} className={styles.volume} />
      <br/>

      <input type="text" className={styles.input} placeholder='Enter the words, separated by spaces' />
      <br/>

      {/* <div className={styles.button}>Verify</div> */}
    </div>
  )
}