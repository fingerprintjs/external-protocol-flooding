import sha1 from '@cryptography/sha1'
import { applications } from 'detector/const'
import { isDetectionCompleted } from 'detector/detection'
import { useDetectionProgress } from 'detector/hooks'
import { useEffect, useState } from 'react'

const STATS_CACHE_KEY = '__stats'

type Statistics = {
  count: number
  total: number
}

export function useIdentifier() {
  const progress = useDetectionProgress()

  if (isDetectionCompleted()) {
    const bitstring = progress.state
      .map((item: boolean) => +item)
      .toString()
      .replace(/,/g, '')
    return sha1(bitstring, 'hex').slice(0, 16)
  } else {
    return
  }
}

export function useStatistics() {
  const fingerprint = useIdentifier()
  const progress = useDetectionProgress()
  const cacheHit = localStorage.getItem(STATS_CACHE_KEY)
  const cachedStats = cacheHit ? JSON.parse(cacheHit) : { count: 0, total: 0 }
  const [stats, setStats] = useState<Statistics>(cachedStats)
  const [isLoading, setLoading] = useState(!cacheHit)

  useEffect(() => {
    if (isDetectionCompleted() && !cacheHit) {
      const visitorId = 'test'
      const apps = progress.state
        .map((isDetected, index) => isDetected && applications[index].title)
        .filter((item) => typeof item === 'string')

      fetch('https://api.external-protocol-flooding.io/result', {
        method: 'POST',
        body: JSON.stringify({
          apps,
          visitorId,
          fingerprint,
        }),
      })
        .then((response) => response.json())
        .then((data: Statistics) => {
          localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(data))

          setLoading(false)
          setStats(data)
        })
    }
  }, [])

  return { stats, isLoading }
}
