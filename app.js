const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
const URL = require('./models/url')
db.on('error', () => {
  console.log('DB connection error!')
})
db.once('open', () =>{
  console.log('DB connection successful!')
})

app.get('/', (req, res) => {
  res.send('this will be url shortener')
})

app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})