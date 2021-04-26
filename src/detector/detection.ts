import {
  getAdditionalWindow,
  invokeWithFrame,
  isPopupWindow,
  listenOnce,
  onMessage,
  sendWindowMessage,
  waitForEmbedElemet,
  waitForLocation,
} from './window'
import { getBrowserFamily } from './browser'
import { applications } from './const'
import { BrowserFamily } from './types'
import { wait } from './utils'
import pdfLink from 'assets/blank.pdf'

const CURRENT_APP_INDEX_KEY = '__currentAppIndex'
const STATE_KEY = '__state'

export enum DetectionResult {
  Waiting,
  Ready,
}

/**
 * State is a current completed or in-progress result of the installed apps detection process
 */
export function getState() {
  return JSON.parse(localStorage.getItem(STATE_KEY) || '[]')
}

/**
 * Returns the next index of applications array for checking:
 * 0 - inital state, first app
 * length - finished state, no app
 */
export function getCurrentIndex() {
  return Number(localStorage.getItem(CURRENT_APP_INDEX_KEY))
}

/**
 * Returns the total number of applications for detection
 */
export function getLength() {
  return applications.length
}

/**
 * Saves the flag if the current application installed or not
 */
export function saveDetectionResult(isDetected: boolean) {
  const state = getState()
  const current = getCurrentIndex()

  console.log('save result', current, isDetected)

  state[current] = isDetected

  localStorage.setItem(STATE_KEY, JSON.stringify(state))
  localStorage.setItem(CURRENT_APP_INDEX_KEY, JSON.stringify(current + 1))
}

/**
 * Resets the whole detection alog
 */
export function clearState() {
  localStorage.removeItem(STATE_KEY)
  localStorage.removeItem(CURRENT_APP_INDEX_KEY)
}

/**
 * Returns true if the current index if greater then the number of apps
 */
export function isDetectionCompleted() {
  return getCurrentIndex() >= getLength()
}

/**
 * Returns the URL with the current application scheme
 */
export function getCurrentApplicationUrl() {
  return `${applications[getCurrentIndex()]?.scheme}://test`
}

export async function detectChrome() {
  if (isDetectionCompleted()) {
    const handler = getAdditionalWindow()
    handler.close()

    return DetectionResult.Waiting
  }

  await invokeWithFrame('main', async () => {
    if (getCurrentIndex() === 0) {
      await wait(100)
    }

    const handler = getAdditionalWindow()
    let isDetected = false

    function flushTrigger() {
      handler.location.replace(pdfLink) // 'chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/index.html') //
    }

    const unsubscribe = listenOnce('blur', () => {
      saveDetectionResult((isDetected = true))
      flushTrigger()
    })

    // Make test
    handler.location.replace(getCurrentApplicationUrl())

    await wait(50) // emperical

    if (!isDetected) {
      saveDetectionResult(false)
      unsubscribe()
      flushTrigger()
    }

    await waitForEmbedElemet()
    await wait(200) // emperical

    handler.location.href = 'about:blank'
    await wait(5) // emperical
  })

  return isPopupWindow() ? DetectionResult.Waiting : DetectionResult.Ready
}

export async function detectSafari() {
  onMessage('redirected', async () => {
    await wait(30)
    const handler = getAdditionalWindow()

    try {
      // same origin policy
      handler.document.location.hostname

      saveDetectionResult(true)
      sendWindowMessage('force_reload')
      document.location.reload()
    } catch (e) {
      saveDetectionResult(false)
      handler.location.replace('/popup')
    }
  })

  onMessage('force_reload', async () => {
    await wait(30)
    document.location.reload()
  })

  await invokeWithFrame('popup', async () => {
    if (isDetectionCompleted()) {
      window.close()
    }

    document.location.replace(getCurrentApplicationUrl())
    sendWindowMessage('redirected')

    await wait(200)
    document.location.reload()
  })

  return DetectionResult.Waiting
}

const firefoxDetectionWaitingDefault = 200
let firefoxDetectionWaiting = firefoxDetectionWaitingDefault

export async function detectFirefox() {
  if (isDetectionCompleted()) {
    const handler = getAdditionalWindow()
    handler.close()

    return DetectionResult.Waiting
  }

  await invokeWithFrame('main', async () => {
    if (getCurrentIndex() === 0) {
      await wait(100)
    }

    const handler = getAdditionalWindow()
    const start = performance.now()

    const unsubscribe = listenOnce('load', () => {
      const delta = performance.now() - start

      if (firefoxDetectionWaiting === firefoxDetectionWaitingDefault) {
        firefoxDetectionWaiting = delta + 15 // emperical
      }
    })

    const iframe = document.createElement('iframe')
    iframe.src = getCurrentApplicationUrl()
    iframe.style.opacity = '0'
    handler.document.body.appendChild(iframe)

    await wait(firefoxDetectionWaiting)
    unsubscribe()

    if (iframe.contentDocument) {
      saveDetectionResult(true)
    } else {
      saveDetectionResult(false)
    }

    handler.location.replace('/blank')
    await waitForLocation(document.location.origin + '/blank')

    handler.location.replace('about:blank')
    await waitForLocation('about:blank')
  })

  return isPopupWindow() ? DetectionResult.Waiting : DetectionResult.Ready
}

export async function detectTorBrowser() {
  await invokeWithFrame('main', async () => {
    const iframe = document.createElement('iframe')
    iframe.src = getCurrentApplicationUrl()
    iframe.style.opacity = '0'
    document.body.appendChild(iframe)

    await wait(50)

    if (iframe.contentDocument) {
      saveDetectionResult(true)
    } else {
      saveDetectionResult(false)
    }

    iframe.remove()
    await wait(10 * 1000) // emperical
  })

  return DetectionResult.Ready
}

/**
 * Permforms checks and detects if the current app installed or not and saves result
 */
export async function detectNext(): Promise<number> {
  const target = getBrowserFamily()

  switch (target) {
    case BrowserFamily.Chrome:
      return detectChrome()

    case BrowserFamily.Safari:
      return detectSafari()

    case BrowserFamily.Firefox:
      return detectFirefox()

    case BrowserFamily.TorBrowser:
      return detectTorBrowser()

    default:
      throw new Error()
  }
}
