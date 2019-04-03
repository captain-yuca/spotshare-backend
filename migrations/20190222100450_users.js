exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('uid').primary()
    table.string('username')
    table.string('email')
    table.string('hash', 5000)
    table.string('salt', 5000)
  })
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('users')
  ])
}
