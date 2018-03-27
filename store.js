//This file is used to store new users into mysql database

//declaring knex constant to knexfile.js configuration
//const knex establishes the mysql client destination and establishes connection to the db
const knex = require('knex')(require('./knexfile'))

//exports the new user from createUser and inserts the username and password into the user table in the db schema
module.exports = {
  createUser ({ username, password }) {
    console.log(`Add user ${username} with password ${password}`)
    return knex('user').insert({
      username,
      password
    })
  }
}