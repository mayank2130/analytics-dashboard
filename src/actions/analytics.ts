'use server'

import { analytics } from '@/utils/analytics'
import { headers } from 'next/headers'

export async function trackAnalytics(formData: FormData) {
  const event = formData.get('event') as string
  const url = formData.get('url') as string
  const referrer = formData.get('referrer') as string
  const userAgent = formData.get('userAgent') as string
  const language = formData.get('language') as string
  const timestamp = formData.get('timestamp') as string

  const headersList = headers()
  const country = headersList.get('x-vercel-ip-country') || 'Unknown'

  const websiteId = new URL(url).hostname

  try {
    await analytics.track(`${websiteId}:${event}`, {
      url,
      referrer,
      userAgent,
      language,
      timestamp,
      country
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to track analytics:', error)
    return { success: false, error: 'Failed to track analytics' }
  }
}