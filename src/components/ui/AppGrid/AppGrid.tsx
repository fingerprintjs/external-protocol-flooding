import React from 'react'
import styles from './AppGrid.module.css'

type Props = { children: React.ReactNode }

export function AppGrid({ children }: Props) {
  return (
    <ul className={styles.container}>
      {children}
    </ul>
  )
}