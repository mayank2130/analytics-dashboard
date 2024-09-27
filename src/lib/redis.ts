import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://finer-bug-23519.upstash.io',
  token: process.env.REDIS_KEY!,
})
