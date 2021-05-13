import React from 'react'
import { useDetectionProgress } from 'detector/hooks'
import { applications } from 'detector/const'
import styles from './AppGrid.module.css'
import { App } from '../App/App'
import { Hr } from '../Hr/Hr'

type Props = { layout: 'short' | 'full' }

export function AppGrid({ layout }: Props) {
  const { state } = useDetectionProgress()
  const detectedApps: React.ReactNode[] = []
  const notDetectedApps: React.ReactNode[] = []

  for (let i = 0; i < state.length; i++) {
    const isDetected = state[i]
    const appData = applications[i]

    if (appData) {
      const component =  <App {...appData} key={appData.scheme} isDetected={isDetected} />
      
      if (isDetected) {
        detectedApps.push(component)
      } else {
        notDetectedApps.push(component)
      }
    }
  }

  switch (layout) {
    case 'short':
      return (
        <ul className={styles.container}>
          {detectedApps}
        </ul>
      )

    default:
      return (
        <div className={styles.wrapper}>
          <p>We have generated your identifier based on {detectedApps.length} applications you have installed.</p>
          <ul className={styles.container}>
            {detectedApps}
          </ul>
          <p>Out of {applications.length} applications in our database.</p>
          <ul className={styles.container}>
            {notDetectedApps}
          </ul>
          <Hr />
        </div>
      )
  }
}