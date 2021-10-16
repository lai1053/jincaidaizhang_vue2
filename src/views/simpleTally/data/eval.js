import * as math from 'mathjs'
export function printFn(value) {
  const precision = 14
  return Number(math.format(value, precision))
}
