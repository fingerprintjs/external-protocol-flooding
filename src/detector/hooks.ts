import { createAdditionalWindow } from './window'
import { clearState, getCurrentIndex, getState } from './detection'
import { applications } from './const'

/**
 * Should be invoked after any button click
 */
export function initDetection() {
  clearState()
  createAdditionalWindow()
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
