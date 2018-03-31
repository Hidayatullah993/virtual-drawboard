//This file is used to store new users into mysql database

//declaring knex constant to knexfile.js configuration
//const knex establishes the mysql client destination and establishes connection to the db
const knex = require('knex')(require('./knexfile'))

//requires native node crypto to secure passwords in the database
const crypto = require('crypto')

//All new users created have a random salt assigned
//use of crypto to hash passwords
module.exports = {
  saltHashPassword,
  createUser ({ username, password }) {
    console.log(`Add user ${username}`)
    //assigning salt and hash at the same time from the output of saltHashPassword
    const { salt, hash } = saltHashPassword(password)
    return knex('user').insert({
      salt,
      encrypted_password: hash,
      username
    })
  }
}

//method returns hashed password with a randomly generated salt
function saltHashPassword (password) {
  const salt = randomString()
  const hash = crypto
    .createHmac('sha256', salt)
    .update(password)
  return {
    salt,
    hash: hash.digest('hex')
  }
}

//
function randomString () {
  return crypto.randomBytes(4).toString('hex')
}