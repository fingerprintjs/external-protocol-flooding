import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
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

export async function getVistiorId() {
  try {
    const agent = await FingerprintJS.load({
      token: 'k3Fv9ygx1xhQ1NxFOsVA',
      endpoint: 'https://fp.schemeflood.com',
    })
    const result = await agent.get()

    return result.visitorId || ''
  } catch (e) {
    return ''
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
