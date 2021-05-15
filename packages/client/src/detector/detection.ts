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

const CURRENT_APP_INDEX_KEY = '__currentAppIndex'
const STATE_KEY = '__state'
const APP_STATE_KEY = '__app_state'

export enum ApplicationState {
  Ready = 'ready',
  InProgress = 'in-progress',
  Welcome = 'welcome',
  Alerted = 'alerted',
}

export enum DetectionResult {
  Waiting,
  Ready,
}

export enum AlertMessage {
  FocusWindow = 'Please keep the browser window focused.',
  MissingPopup = 'Please keep the popup opened and do not close it.',
  Unexpected = 'Unexpected error happened',
}

/**
 * State is a current completed or in-progress result of the installed apps detection process
 */
export function getState(): boolean[] {
  return JSON.parse(localStorage.getItem(STATE_KEY) || '[]')
}

/**
 * Returns the next index of applications array for checking:
 * 0 - inital state, first app
 * length - finished state, no app
 */
export function getCurrentIndex() {
  if (window.opener && getBrowserFamily() === BrowserFamily.Safari) {
    return Number(window.opener.localStorage.getItem(CURRENT_APP_INDEX_KEY))
  } else {
    return Number(localStorage.getItem(CURRENT_APP_INDEX_KEY))
  }
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
export function saveDetectionResult(isDetected: boolean, current = getCurrentIndex()) {
  const state = getState()

  state[current] = isDetected

  localStorage.setItem(STATE_KEY, JSON.stringify(state))
  localStorage.setItem(CURRENT_APP_INDEX_KEY, JSON.stringify(current + 1))
}

/**
 * Reverts last result
 */
export function revertLatestResult() {
  const current = getCurrentIndex()

  localStorage.setItem(CURRENT_APP_INDEX_KEY, JSON.stringify(Math.max(0, current - 1)))
}

/**
 * Resets the whole detection alog
 */
export function clearState() {
  currentAppIndexForTorBrowser = 0
  localStorage.clear()
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
export function getCurrentApplicationUrl(index = getCurrentIndex()) {
  return `${applications[index]?.scheme}://test`
}

const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
const isWindows = windowsPlatforms.indexOf(navigator.platform)
function conditionalTiming(normal: number, windows: number) {
  return isWindows ? windows : normal
}

export async function detectChrome() {
  if (isDetectionCompleted()) {
    setInternalApplicationState(ApplicationState.Ready)

    const handler = getAdditionalWindow()
    handler.close()

    return DetectionResult.Waiting
  }

  await invokeWithFrame('main', async () => {
    if (getCurrentIndex() === 0) {
      await Promise.all([assetsPromise, wait(conditionalTiming(300, 400))])
    }

    const handler = getAdditionalWindow()
    let isDetected = true

    const input = document.createElement('input')
    input.style.opacity = '0'
    input.style.position = 'absolute'
    input.onfocus = () => {
      isDetected = false
    }

    await wait(conditionalTiming(40, 100)) // emperical

    const isBrowserActive = document.hasFocus() || handler.document.hasFocus()
    if (!isBrowserActive) {
      throw AlertMessage.FocusWindow
    }

    // Make test
    if (document.hasFocus()) {
      document.body.insertBefore(input, document.getElementById('app'))
    } else {
      handler.document.body.appendChild(input)
    }

    handler.location.replace(getCurrentApplicationUrl())

    await wait(conditionalTiming(125, 250)) // emperical

    input.focus()
    await wait(conditionalTiming(15, 50))
    input.remove()

    saveDetectionResult(isDetected)
    handler.location.replace('/pdf')

    await waitForEmbedElemet()
    await wait(conditionalTiming(400, 800)) // emperical

    handler.location.replace('about:blank')

    await waitForLocation('about:blank')
  })

  return isPopupWindow() ? DetectionResult.Waiting : DetectionResult.Ready
}
export async function detectSafari() {
  onMessage('redirected', async () => {
    await wait(55)
    const handler = getAdditionalWindow()

    try {
      // same origin policy
      handler.document.location.hostname

      saveDetectionResult(true)
      sendWindowMessage('force_reload')

      setInternalApplicationState(ApplicationState.InProgress)
      document.location.reload()
    } catch (e) {
      saveDetectionResult(false)
      handler.location.replace('/popup')
    }

    if (isDetectionCompleted()) {
      setInternalApplicationState(ApplicationState.Ready)
      document.location.reload()
    }
  })

  onMessage('force_reload', async () => {
    await wait(55)
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
    setInternalApplicationState(ApplicationState.Ready)

    const handler = getAdditionalWindow()
    handler.close()

    return DetectionResult.Waiting
  }

  await invokeWithFrame('main', async () => {
    if (getCurrentIndex() === 0) {
      await wait(300)
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

// export async function detectTorBrowser() {
//   await invokeWithFrame('main', async () => {
//     const iframe = document.createElement('iframe')
//     iframe.src = getCurrentApplicationUrl()
//     iframe.style.opacity = '0'
//     document.body.appendChild(iframe)

//     await wait(1000)

//     if (iframe.contentDocument) {
//       saveDetectionResult(true)
//     } else {
//       saveDetectionResult(false)
//     }

//     iframe.remove()
//     await wait(10 * 1000) // emperical
//   })

//   return DetectionResult.Ready
// }

let currentAppIndexForTorBrowser = 0
export async function detectTorBrowserInline(onComplete: (index: number) => unknown) {
  const currentIndex = currentAppIndexForTorBrowser++

  if (currentIndex >= applications.length) {
    return
  }

  const iframe = document.createElement('iframe')
  iframe.src = getCurrentApplicationUrl(currentIndex)
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  setTimeout(() => {
    if (iframe.contentDocument) {
      saveDetectionResult(true, currentIndex)
    } else {
      saveDetectionResult(false, currentIndex)
    }

    iframe.remove()
    onComplete(currentIndex)
  }, 500)
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

    // case BrowserFamily.TorBrowser:
    //   return detectTorBrowser()

    default:
      throw new Error()
  }
}

export function setInternalApplicationState(state: ApplicationState) {
  localStorage.setItem(APP_STATE_KEY, state)
}

export function getInternalApplicationState(): ApplicationState {
  const cachedState = (localStorage.getItem(APP_STATE_KEY) as ApplicationState) || undefined
  return cachedState || ApplicationState.Welcome
}

let assetsPromise: Promise<unknown>

export function preloadAssets() {
  assetsPromise = Promise.all(applications.map((item) => fetch(item.icon)))
}
