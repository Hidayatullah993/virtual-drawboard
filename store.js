//This file is used to store new users into mysql database
//declaring knex to knexfile.js configuration
//knex establishes the mysql client destination
const knex = require('knex')(require('./knexfile'));

//requires crypto native module to secure passwords in the database
const crypto = require('crypto');

// All new users created have a random salt assigned
module.exports = {
  saltHashPassword,
  createUser ({ username, password }) {
    console.log(`Add user ${username}`);
    // Assigning salt and hash at the same time from the output of saltHashPassword
    const { salt, hash } = saltHashPassword({password})
    return knex('user').insert({
      salt,
      encrypted_password: hash,
      username
    });
  },

  // Receives the password from the login page
  // Conducts saltHashPassword on the passsword input
  // Checks the encrypted password with the password in the database with the user's salt
  authenticate ({ username, password }) {
    console.log(`Authenticating user ${username}`);
    return knex('user').where({ username })
      .then(([user]) => {
        if (!user) return { success: false }
        const { hash } = saltHashPassword({
          password,
          salt: user.salt
        });
        return { success: hash === user.encrypted_password }
      });
  }
}

//method returns encrypted password with a randomly generated salt
function saltHashPassword ({
  password,
  salt = randomString()
}) {
  const hash = crypto
    .createHmac('sha256', salt)
    .update(password);
  return {
    salt,
    hash: hash.digest('hex')
  }
}

//generates a random string with a byte size of 4
function randomString () {
  return crypto.randomBytes(4).toString('hex');
}