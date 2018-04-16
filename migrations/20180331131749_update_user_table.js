const { saltHashPassword } = require('../store')

exports.up = function up (knex) {
  return knex.schema
    .table('user', table => {
      table.string('salt').notNullable()
      table.string('encrypted_password').notNullable()
    })
    .then(() => knex('user'))
    .then(users => Promise.all(users.map(convertPassword)))
    .then(() => {
      return knex.schema.table('user', table => {
        table.dropColumn('password')
      })
    })

  function convertPassword (user) {
    const { salt, hash } = saltHashPassword(user.password)
    return knex('user')
      .where({ id: user.id })
      .update({
        salt,
        encrypted_password: hash
      })
  }
}

exports.down = function down (knex) {
  return knex.schema.table('user', t => {
    t.dropColumn('salt')
    t.dropColumn('encrypted_password')
    t.string('password').notNullable()
  })
}

// table => {
//   return 'hello';
// }

// var _this = this;
// function (table) {
//   this = _this;
//   return 'hello';
// }

// (table) -> {
//   return 'hello';
// }

// function (table) {
//   return 'hello';
// }