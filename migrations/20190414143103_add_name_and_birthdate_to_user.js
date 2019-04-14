exports.up = function (knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
    table.date('birthdate')
    table.string('firstName')
    table.string('lastName')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('birthdate')
    table.dropColumn('firstName')
    table.dropColumn('lastName')
  })
}
