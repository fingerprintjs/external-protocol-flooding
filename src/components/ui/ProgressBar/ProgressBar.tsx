import React from 'react'
import styles from './ProgressBar.module.css'

type Props = {
  total: number,
  current: number
}

export function ProgressBar({ total, current }: Props) {
  const percentage = Math.max(0, Math.min(1, (current / total))) * 100
  const width = `${percentage.toFixed(2)}%`

  return (
    <div className={styles.container}>
      <div className={styles.bar} style={{ width }}/>
    </div>
  )
}