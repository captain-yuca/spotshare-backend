
exports.up = function (knex, Promise) {
  return knex.schema.createTable('postcards', (table) => {
    table.increments('id').primary()
    table.string('imgUrl')
    table.string('title')
    table.date('date')
    table.integer('userId')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('postcards')
}
