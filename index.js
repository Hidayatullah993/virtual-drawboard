/*
Simple Express application
serves the public directory
/createUser endpoint to write data into the database
*/
const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.post('/createUser', (req, res) => {
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.sendStatus(200))
})
app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})