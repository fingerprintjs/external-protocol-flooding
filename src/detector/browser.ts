import { BrowserFamily } from './types'

export function getBrowserFamily(): BrowserFamily {
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('chrome')) {
    return BrowserFamily.Chrome
  } else if (userAgent.includes('safari')) {
    return BrowserFamily.Safari
  } else if (userAgent.includes('firefox')) {
    return BrowserFamily.Firefox
  }

  return BrowserFamily.Unknown
}
