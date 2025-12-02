function buildFormatOptions(opts?: {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  noDecimals?: boolean
}) {
  const { minimumFractionDigits, maximumFractionDigits, noDecimals } = opts ?? {}

  const options: Intl.NumberFormatOptions = {}

  if (noDecimals) {
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = 0
  } else {
    if (minimumFractionDigits !== undefined)
      options.minimumFractionDigits = minimumFractionDigits
    if (maximumFractionDigits !== undefined)
      options.maximumFractionDigits = maximumFractionDigits
  }

  return options
}

export function formatCurrency(
  amount: number,
  opts?: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    noDecimals?: boolean
  },
) {
  const {
    currency = 'USD',
    locale = 'en-US',
    ...numberOpts
  } = opts ?? {}

  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    ...buildFormatOptions(numberOpts),
  }

  return new Intl.NumberFormat(locale, formatOptions).format(amount)
}

export function formatNumber(
  value?: string | number,
  opts?: {
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    noDecimals?: boolean
  },
) {
  const num = Number(value)
  if (Number.isNaN(num)) throw new Error(`Invalid number: ${value}`)

  const { locale = 'en-US', ...numberOpts } = opts ?? {}

  return new Intl.NumberFormat(locale, buildFormatOptions(numberOpts)).format(num)
}
