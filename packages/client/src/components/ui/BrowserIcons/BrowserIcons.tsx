import React from 'react'
import chromeIcon from 'assets/chrome.svg'
import torBrowserIcon from 'assets/tor.svg'
import safariIcon from 'assets/safari.svg'
import firefoxIcon from 'assets/firefox.svg'
import styles from './BrowserIcons.module.css'

export function BrowserIcons() {
  return (
    <div className={styles.container}>
      <img className={styles.icon} src={chromeIcon} />
      •
      <img className={styles.icon} src={torBrowserIcon} />
      •
      <img className={styles.icon} src={safariIcon} />
      •
      <img className={styles.icon} src={firefoxIcon} />
    </div>
  )
}