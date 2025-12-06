'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only report in production and if enabled
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS) {
      
      // Log to console in development
      console.log('Web Vital:', metric)
      
      // Send to analytics service (Google Analytics, Sentry, etc.)
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', metric.name, {
          custom_map: { metric_id: 'web_vitals' },
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_rating: metric.rating
        })
      }
      
      // Optional: Send to custom analytics endpoint
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      }).catch(() => {
        // Silently fail if analytics endpoint is not available
      })
    }
  })

  return null
}