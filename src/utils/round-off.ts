/**
 * ROUNDING MODE FOR THE PAYABLE AMOUNT — COMES FROM `companyInfo.rounded`
 */
export const ROUND_OFF = {
  NONE: 0,
  UPPER: 1,
  LOWER: 2
} as const

/** DROP FLOATING POINT NOISE (e.g. 751.7000000000001 -> 751.7) BEFORE ANY COMPARISON OR ROUNDING */
export const roundAmount = (amount: number): number =>
  Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0

/**
 * AMOUNT THE CUSTOMER ACTUALLY PAYS, AFTER APPLYING THE COMPANY ROUNDING RULE
 * @param amount - GRAND TOTAL BEFORE ROUNDING
 * @param rounded - 0 NO ROUNDING | 1 UPPER BOUND | 2 LOWER BOUND
 */
export const getFinalAmount = (amount: number, rounded?: number | null): number => {
  const value = roundAmount(amount)

  switch (rounded) {
    case ROUND_OFF.UPPER:
      return Math.ceil(value)
    case ROUND_OFF.LOWER:
      return Math.floor(value)
    default:
      return value
  }
}

/** DIFFERENCE ADDED/REMOVED BY ROUNDING — SHOWN AS THE "Round Off" LINE IN THE UI */
export const getRoundOff = (amount: number, rounded?: number | null): number =>
  roundAmount(getFinalAmount(amount, rounded) - roundAmount(amount))
