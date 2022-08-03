const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

const siFormatter = (value: number) => {
  // what tier? (determines SI symbol)
  var tier = (Math.log10(Math.abs(value)) / 3) | 0

  // if zero, we don't need a suffix
  if (!tier) return value

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier]

  var scale = Math.pow(10, tier * 3)

  // scale the number
  var scaled = value / scale

  // format number and add suffix
  return scaled.toFixed(1) + suffix
}

export default siFormatter
