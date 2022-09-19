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
  const shortURL = newShortUrl()
  URL.exists({ targetURL })
    .then(data => data ? URL.findById(data) : URL.create({ targetURL, shortURL }))
    .then(data => {
      res.render('result', { targetURL, shortURL: data.shortURL })})
    .catch(err => console.log(err))
})

app.get('/:shortURL', (req, res) => {
  const { shortURL } = req.params
  URL.findOne({ shortURL })
    .then(data => res.redirect(data.targetURL)
    )
    .catch(err => console.log(err))
})

app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})

function newShortUrl() {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  let collection = []
  collection = collection.concat(lowerCaseLetters.split('')).concat(upperCaseLetters.split('')).concat(numbers.split(''))
  let shortCode = ''
  for (let i = 0; i < 5; i++) {
    shortCode += sample(collection)
  }
  const shortURL = shortCode
  return shortURL
}

function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}