import { redis } from '@/lib/redis'
import { getDate } from '@/utils'
import { parse } from 'date-fns'

export class Analytics {
  private retention: number = 60 * 60 * 24 * 7

  constructor(opts?: { retention?: number }) {
    if (opts?.retention) this.retention = opts.retention
  }

  async track(namespace: string, event: object = {}) {
    const key = `analytics::${namespace}::${getDate()}`

    await redis.hincrby(key, JSON.stringify(event), 1)
    await redis.expire(key, this.retention)
  }

  async retrieveDays(namespace: string, nDays: number) {
    const promises = Array.from({ length: nDays }, (_, i) => 
      this.retrieve(namespace, getDate(i))
    )

    const fetched = await Promise.all(promises)

    return fetched.sort((a, b) => 
      parse(a.date, 'dd/MM/yyyy', new Date()) > parse(b.date, 'dd/MM/yyyy', new Date()) ? 1 : -1
    )
  }

  async retrieve(namespace: string, date: string) {
    const res = await redis.hgetall<Record<string, string>>(`analytics::${namespace}::${date}`)

    return {
      date,
      events: Object.entries(res ?? {}).map(([key, value]) => ({
        [key]: Number(value),
      })),
    }
  }

  async getWebsiteStats(websiteId: string, days: number) {
    const pageviews = await this.retrieveDays(`${websiteId}:pageview`, days)

    const totalPageviews = pageviews.reduce((acc, curr) => 
      acc + curr.events.reduce((sum, event) => sum + Object.values(event)[0]!, 0), 0
    )

    const avgVisitorsPerDay = (totalPageviews / days).toFixed(1)

    const amtVisitorsToday = pageviews
      .filter((ev) => ev.date === getDate())
      .reduce((acc, curr) => 
        acc + curr.events.reduce((sum, event) => sum + Object.values(event)[0]!, 0), 0
      )

    // Calculate top countries
    const topCountriesMap = new Map<string, number>()

    pageviews.forEach(day => {
      day.events.forEach(event => {
        const key = Object.keys(event)[0]!
        const value = Object.values(event)[0]!
        const parsedKey = JSON.parse(key)
        const country = parsedKey?.country

        if (country) {
          topCountriesMap.set(country, (topCountriesMap.get(country) || 0) + value)
        }
      })
    })

    const topCountries = [...topCountriesMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      avgVisitorsPerDay,
      amtVisitorsToday,
      timeseriesPageviews: pageviews,
      topCountries,
    }
  }
}

export const analytics = new Analytics()