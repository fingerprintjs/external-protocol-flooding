import { isDetectionCompleted } from 'detector/detection'
import { getVistiorId, useDetectionProgress } from 'detector/hooks'
import { useEffect, useState } from 'react'

const STATS_CACHE_KEY = '__stats'

type Statistics = {
  count: number
  totalCount: number
}

export function useIdentifier() {
  const progress = useDetectionProgress()

  if (isDetectionCompleted()) {
    const num = progress.state.reduce((acc, item, index) => acc | (+item << index), 0)
    const xored = 0xffffff ^ num
    return num.toString(32) + xored.toString(32)
  } else {
    return
  }
}

export function useStatistics() {
  const appHash = useIdentifier()
  const cacheHit = localStorage.getItem(STATS_CACHE_KEY)
  const cachedStats = cacheHit ? JSON.parse(cacheHit) : { count: 0, total: 0 }
  const [stats, setStats] = useState<Statistics>(cachedStats)
  const [isLoading, setLoading] = useState(!cacheHit)

  useEffect(() => {
    if (isDetectionCompleted() && !cacheHit) {
      getVistiorId()
        .then((visitorId) =>
          fetch('https://api.schemeflood.com/app_hashes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              visitorId,
              appHash,
            }),
          })
        )
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
