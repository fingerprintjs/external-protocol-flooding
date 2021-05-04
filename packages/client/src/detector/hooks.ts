import { createAdditionalWindow } from './window'
import { clearState, getCurrentIndex, getState } from './detection'
import { getBrowserFamily } from './browser'
import { applications } from './const'
import { BrowserFamily } from './types'

/**
 * Should be invoked after any button click
 */
export function initDetection() {
  clearState()

  if (getBrowserFamily() !== BrowserFamily.TorBrowser) {
    createAdditionalWindow()
  }
}

export function useDetectionProgress() {
  const current = getCurrentIndex()
  const state = getState()

  return {
    current,
    total: applications.length,
    state,
  }
}
