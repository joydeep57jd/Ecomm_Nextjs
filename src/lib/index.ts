import { formatDistanceStrict } from "date-fns/formatDistanceStrict"

/**
 * GET THE DIFFERENCE DATE FORMAT
 * @param  DATE | NUMBER | STRING
 * @returns FORMATTED DATE STRING
 */

export function getDateDifference(date: string | number | Date) {
  const distance = formatDistanceStrict(new Date(), new Date(date))
  return distance + " ago"
}

/**
 * CALCULATE PRICE WITH PRODUCT DISCOUNT THEN RETURN NEW PRODUCT PRICES
 * @param  price - PRODUCT PRICE
 * @param  discount - DISCOUNT PERCENT
 * @returns - RETURN NEW PRICE
 */

export function calculateDiscount(price: number, discount: number, format = true) {
  const afterDiscount = Number((price - price * (discount / 100)).toFixed(2))
  return format ? currency(afterDiscount) : afterDiscount
}

/**
 * CHANGE THE CURRENCY FORMAT
 * @param  price - PRODUCT PRICE
 * @param  fraction - HOW MANY FRACTION WANT TO SHOW
 * @returns - RETURN PRICE WITH CURRENCY
 */

export function currency(price: number, fraction: number = 2) {
  const numberFormat = process.env.NEXT_PUBLIC_NUMBER_FORMAT || "en-US"
  const currencyFormat = process.env.NEXT_PUBLIC_CURRENCY_FORMAT || "USD"

  return Intl.NumberFormat(numberFormat, {
    currency: currencyFormat,
    style: "currency",
    maximumFractionDigits: fraction
  }).format(price)
}
