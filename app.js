const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
const URL = require('./models/url')
db.on('error', () => {
  console.log('DB connection error!')
})
db.once('open', () =>{
  console.log('DB connection successful!')
})
app.engine('hbs', exphbs.engine({ extname:'.hbs'}))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})