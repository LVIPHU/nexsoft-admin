import dayjs from 'dayjs'
import { z } from 'zod'

export const dateSchema = z
  .union([
    z.date(),
    z.number(),
    z.string().datetime(),
    z.object({
      seconds: z.number(),
      nanos: z.number(),
    }),
  ])
  .transform((value) => {
    if (value instanceof Date) return value
    if (typeof value === 'string' || typeof value === 'number')
      return dayjs(value).toDate()
    // {seconds, nanos} -> Date
    return new Date(value.seconds * 1000 + Math.floor(value.nanos / 1_000_000))
  })

export const sortByDate = <T>(a: T, b: T, key: keyof T, desc = true) => {
  if (!a[key] || !b[key]) return 0
  if (!(a[key] instanceof Date) || !(b[key] instanceof Date)) return 0

  if (dayjs(a[key] as Date).isSame(dayjs(b[key] as Date))) return 0
  if (desc)
    return dayjs(a[key] as Date).isBefore(dayjs(b[key] as Date)) ? 1 : -1
  else return dayjs(a[key] as Date).isBefore(dayjs(b[key] as Date)) ? -1 : 1
}

export function parseDate(value: any): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const d = dayjs(value)
    if (d.isValid()) return d.toDate()
  }
  if (typeof value === 'number') {
    return dayjs(value).toDate()
  }
  if (typeof value === 'object' && 'seconds' in value && 'nanos' in value) {
    return new Date(value.seconds * 1000 + Math.floor(value.nanos / 1_000_000))
  }
  return undefined
}

export const deepSearchAndParseDates = (
  obj: any,
  dateKeys: Array<string>,
): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const keys = Object.keys(obj)

  if (keys.length === 0) {
    return obj
  }

  for (const key of keys) {
    const value = obj[key]

    if (dateKeys.includes(key) && value !== null && value !== undefined) {
      // Only parse if value looks like a date (string that can be parsed, number, or Date)
      // Skip if it's a plain string like "DESC" in sort object
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        value instanceof Date ||
        (typeof value === 'object' && 'seconds' in value)
      ) {
        const parsed = parseDate(value)
        if (parsed) obj[key] = parsed
      }
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      obj[key] = deepSearchAndParseDates(value, dateKeys)
    } else if (value !== null && Array.isArray(value)) {
      obj[key] = value.map((item) => deepSearchAndParseDates(item, dateKeys))
    }
  }

  return obj
}
