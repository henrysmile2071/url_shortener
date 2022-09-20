//Create and return a x digit code depending on the input
function newShortUrl(numOfCode) {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  let collection = []
  collection = collection.concat(lowerCaseLetters.split('')).concat(upperCaseLetters.split('')).concat(numbers.split(''))
  let shortCode = ''
  for (let i = 0; i < numOfCode; i++) {
    shortCode += sample(collection)
  }
  return shortCode
}

//Randomly pick and return an element from the input array
function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

module.exports = newShortUrl