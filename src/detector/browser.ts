import { BrowserFamily } from './types'

export function getBrowserFamily(): BrowserFamily {
  const userAgent = navigator.userAgent.toLowerCase()
  const noWebRTC = +!('RTCDataChannel' in window)
  const noPointerEvent = +!('PointerEvent' in window)
  const noAudioBuffer = +!('AudioBuffer' in window)
  const noWebGLSync = +!('noWebGLSync' in window)

  if (noWebRTC + noPointerEvent + noAudioBuffer + noWebGLSync >= 3) {
    return BrowserFamily.TorBrowser
  }

  if (userAgent.includes('chrome')) {
    return BrowserFamily.Chrome
  } else if (userAgent.includes('safari')) {
    return BrowserFamily.Safari
  } else if (userAgent.includes('firefox')) {
    return BrowserFamily.Firefox
  }

  return BrowserFamily.Unknown
}
