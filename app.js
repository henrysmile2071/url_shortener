const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
const URL = require('./models/url')
const newShortUrl = require('./utility/generate_short_url')
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

//routes
//index
app.get('/', (req, res) => {
  res.render('index')
})

//post target url and return shorturl
app.post('/shorten', (req, res) => {
  const targetURL = req.body.targetUrl
  const shortURL = newShortUrl()
  URL.exists({ targetURL }) //checks if target URL already exists
    .then(data => data ? URL.findById(data) : URL.create({ targetURL, shortURL })) //if it does find document with returned _ID, else create new entry in database and return new document
    .then(data => {
      res.render('result', { targetURL, shortURL: data.shortURL })})
    .catch(err => console.log(err))
})

//get target url from shorturl and redirect
app.get('/:shortURL', (req, res) => {
  const { shortURL } = req.params
  URL.findOne({ shortURL })
    .then(data => res.redirect(data.targetURL)
    )
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})