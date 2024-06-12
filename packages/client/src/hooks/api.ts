import { isDetectionCompleted } from 'detector/detection'
import { useDetectionProgress } from 'detector/hooks'

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
