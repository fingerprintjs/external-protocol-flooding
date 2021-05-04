import React from 'react'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.container}>
      <span>
        Discovered by <a href="#" className={styles.link}>FingerprintJS</a>
      </span>
      <span className={styles.bull}>
        <a href="#" className={styles.link}>Source Code</a>
      </span>
      <span className={styles.bull}>
        <a href="#" className={styles.link}>Article</a>
      </span>
    </footer>
  )
}