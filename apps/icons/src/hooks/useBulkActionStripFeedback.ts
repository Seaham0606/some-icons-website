import { useCallback, useEffect, useRef, useState } from 'react'

const FEEDBACK_MS = 3000

/**
 * Drives `Button` `stateIcons` strip: after a successful bulk copy/download, shows the
 * check state for {@link FEEDBACK_MS}, then resets. Download clearing is deferred until the strip resets.
 */
export function useBulkActionStripFeedback() {
  const [copySuccessStrip, setCopySuccessStrip] = useState(false)
  const [downloadSuccessStrip, setDownloadSuccessStrip] = useState(false)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCopyTimer = useCallback(() => {
    if (copyTimerRef.current != null) {
      clearTimeout(copyTimerRef.current)
      copyTimerRef.current = null
    }
  }, [])

  const clearDownloadTimer = useCallback(() => {
    if (downloadTimerRef.current != null) {
      clearTimeout(downloadTimerRef.current)
      downloadTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearCopyTimer()
      clearDownloadTimer()
    }
  }, [clearCopyTimer, clearDownloadTimer])

  const flashCopySuccess = useCallback(() => {
    setCopySuccessStrip(true)
    clearCopyTimer()
    copyTimerRef.current = setTimeout(() => {
      setCopySuccessStrip(false)
      copyTimerRef.current = null
    }, FEEDBACK_MS)
  }, [clearCopyTimer])

  const flashDownloadSuccess = useCallback((onAfter?: () => void) => {
    setDownloadSuccessStrip(true)
    clearDownloadTimer()
    downloadTimerRef.current = setTimeout(() => {
      setDownloadSuccessStrip(false)
      downloadTimerRef.current = null
      onAfter?.()
    }, FEEDBACK_MS)
  }, [clearDownloadTimer])

  return {
    copySuccessStrip,
    downloadSuccessStrip,
    flashCopySuccess,
    flashDownloadSuccess,
  }
}
