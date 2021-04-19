import React from 'react'
import styles from './Centered.module.css'

type Props = {
  children: React.ReactNode
}

export function Centered({ children }: Props) {
  return (
    <section className={styles.container}>
      {children}
    </section>
  )
}