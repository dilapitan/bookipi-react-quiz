'use client'

import { useEffect, useCallback, useRef } from 'react'

import { useRecordEvent } from '@/services/attemptQueries'

interface UseAntiCheatOptions {
  attemptId: number | null
  enabled: boolean
  onTabSwitch?: () => void
  onPaste?: () => void
}

export function useAntiCheat({
  attemptId,
  enabled,
  onTabSwitch,
  onPaste,
}: UseAntiCheatOptions) {
  const recordEvent = useRecordEvent()
  const lastBlurTime = useRef<number>(0)

  // Record an event
  const logEvent = useCallback(
    (eventType: string) => {
      if (!attemptId || !enabled) return

      const timestamp = new Date().toISOString()
      recordEvent.mutate(
        {
          attemptId,
          event: `${eventType}:${timestamp}`,
        },
        {
          onError: error => {
            // Silently ignore "Attempt already submitted" errors
            if (
              error instanceof Error &&
              !error.message.includes('Attempt already submitted')
            ) {
              console.error('Failed to log anti-cheat event:', error)
            }
          },
        }
      )
    },
    [attemptId, enabled, recordEvent]
  )

  // Track window/tab focus events
  useEffect(() => {
    if (!enabled) return

    const handleBlur = () => {
      lastBlurTime.current = Date.now()
      logEvent('tab_blur')
      onTabSwitch?.()
    }

    const handleFocus = () => {
      // Only log focus if there was a previous blur
      if (lastBlurTime.current > 0) {
        logEvent('tab_focus')
      }
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled, logEvent, onTabSwitch])

  // Return a function to manually log paste events
  const logPasteEvent = useCallback(() => {
    logEvent('paste')
    onPaste?.()
  }, [logEvent, onPaste])

  return { logPasteEvent }
}
