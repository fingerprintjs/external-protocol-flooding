import React from 'react'
import fingerprintIcon from 'assets/fingerprint.svg'
import styles from './Logo.module.css'

export function Logo() {
  return (
   <img className={styles.icon} src={fingerprintIcon} />
  )
}