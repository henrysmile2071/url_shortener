const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
const URL = require('./models/url')
app.use(express.static('public'))
db.on('error', () => {
  console.log('DB connection error!')
})
db.once('open', () => {
  console.log('DB connection successful!')
})
app.engine('hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/shorten', (req, res) => {
  const targetURL = req.body.targetUrl
  const shortURL = returnShortUrl(targetURL)
  console.log(shortURL)
  res.render('result', { shortURL: shortURL })
})

app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})

function returnShortUrl(url) {
  URL.exists({ targetURL: url })
    .lean()
    .then((urlInDb) => {
      console.log(urlInDb)
      if (!urlInDb) {
        console.log('not in database')
        const shortURL = generateShortUrl()
        URL.create({
          targetURL: url,
          shortURL
        })
          .then(console.log('update db'))
        return shortURL
      } else {
        console.log('already in database')
        URL.findOne({ targetURL: url })
          .lean()
          .then((url) => {
            const shortURL = url
            return shortURL
          })
      }
    })
}

function generateShortUrl() {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  let collection = []
  collection = collection.concat(lowerCaseLetters.split('')).concat(upperCaseLetters.split('')).concat(numbers.split(''))
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += sample(collection)
  }
  const shortURL = 'https://URLshort.herokuapp.com/' + code
  console.log(shortURL)
  // return the generated password
  return shortURL
}

function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}