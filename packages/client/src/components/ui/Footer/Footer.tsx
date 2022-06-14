import React from 'react'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.container}>
      <span>
        <span className={styles.desktop}>Discovered by </span>
        <a href="https://fingerprint.com/" target="_blank" rel="noopener" className={styles.link}>Fingerprint</a>
      </span>
      <span className={styles.bull}>
        <a href="https://github.com/fingerprintjs/external-protocol-flooding" target="_blank" rel="noopener" className={styles.link}>Source Code</a>
      </span>
      <span className={styles.bull}>
        <a href="https://fingerprint.com/blog/external-protocol-flooding/" target="_blank" rel="noopener" className={styles.link}>Article</a>
      </span>
    </footer>
  )
}