import { ApplicationCandidate } from 'detector/types'
import React from 'react'
import styles from './App.module.css'

type Props = ApplicationCandidate & { isDetected: boolean }

export function App({ title, icon, isDetected }: Props) {
  const className = isDetected ? styles.container : `${styles.container} ${styles.notDetected}`

  return (
    <li className={className}>
      <img src={icon} alt={title} className={styles.icon} />
      <strong className={styles.title}>{title}</strong>
    </li>
  )
}