
// format a time given in minutes to H:MM 
export const formatTime = (n) => `${n / 60 ^ 0}:` + ('0' + n % 60).slice(-2)

// get the suffix of a given number, i.e. 1 -> 'st', 32 -> 'nd', 5 -> 'th'
//https://stackoverflow.com/a/13627586
export const ordinalSuffixOf = (i) => {
  let j = i % 10, k = i % 100;
  if (j === 1 && k !== 11) {
    return 'st'
  }
  if (j === 2 && k !== 12) {
    return 'nd'
  }
  if (j === 3 && k !== 13) {
    return 'rd'
  }
  return 'th'
}

// random array index for array of length n
export const randomNum = n => {
    return Math.ceil(Math.random() * n-1)
}
