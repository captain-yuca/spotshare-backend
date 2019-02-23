exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('uid').primary()
    table.string('username', 20)
    table.string('email')
    table.string('hash')
    table.string('salt')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users')
}
