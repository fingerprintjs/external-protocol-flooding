import { BrowserFamily } from './types'
import { isDesktopSafari, isGecko } from '@fingerprintjs/fingerprintjs'

export function getBrowserFamily(): BrowserFamily {
  const noWebRTC = +!('RTCDataChannel' in window)
  const noPointerEvent = +!('PointerEvent' in window)
  const noAudioBuffer = +!('AudioBuffer' in window)
  const noWebGLSync = +!('noWebGLSync' in window)

  if (noWebRTC + noPointerEvent + noAudioBuffer + noWebGLSync >= 3) {
    return BrowserFamily.TorBrowser
  }

  if (isDesktopSafari()) {
    return BrowserFamily.Safari
  } else if (isGecko()) {
    return BrowserFamily.Firefox
  } else {
    // if (isChromium()) {
    return BrowserFamily.Chrome
  }

  // return BrowserFamily.Unknown
}
