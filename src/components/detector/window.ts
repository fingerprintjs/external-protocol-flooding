import { getBrowserFamily } from './browser'
import { BrowserFamily, GenericMessage, GenericMessageType } from './types'

/**
 * Additinal window instance
 */
let handler: Window | null = null

/**
 * Function will create a popup (is separeted from getAdditionalWindow because requires user gesture)
 * This popup is used for Safari, Chrome and Firefox installed apps detection
 * Since we don't want to open multiple popups it has the memoization
 */
export function createAdditionalWindow() {
  const params = 'width=100,height=100,left=9999,top=9999'

  handler = window.open(getInitialUrlForPopup(), '', params)

  if (!handler) {
    throw new Error('Unable to open popup')
  }

  return handler
}

function getInitialUrlForPopup() {
  const target = getBrowserFamily()
  return target === BrowserFamily.Safari ? '/popup' : 'about:blank'
}

/**
 * Checks if the current window instance is the main frame or popup window
 */
export function isPopupWindow() {
  return !!window.opener
}

/**
 * Some instructions should be executed in main window and others in popup
 */
export async function invokeWithFrame(type: 'main' | 'popup', callback: () => unknown) {
  if (type === 'popup' && isPopupWindow()) {
    await callback()
  }

  if (type === 'main' && !isPopupWindow()) {
    await callback()
  }
}

export function sendWindowMessage(type: GenericMessageType) {
  const targetWindow: Window = window.opener || handler

  targetWindow.postMessage(
    {
      type,
      crossBrowserDemo: true,
    },
    document.location.origin
  )
}

const messageListeners: Record<string, () => unknown> = {}
export function onMessage(type: GenericMessageType, callback: () => unknown) {
  messageListeners[type] = callback
}

/**
 * Cross-window communication
 */
export function initWindowMessaging() {
  window.onmessage = (event: MessageEvent) => {
    const data = event.data as GenericMessage

    // Update the current handler pointer after each incoming message
    // This might be useful if the main page was reloaded so we will still have an access
    // to the popup instance
    if (data.crossBrowserDemo) {
      handler = event.source as Window
    }

    if (messageListeners[data.type]) {
      messageListeners[data.type]()
    }
  }
}

/**
 * Returns additional popup window instance
 */
export function getAdditionalWindow() {
  return handler || createAdditionalWindow()
}
