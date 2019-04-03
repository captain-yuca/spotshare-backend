
exports.up = function (knex, Promise) {
  return knex.schema.createTable('postcards', (table) => {
    table.increments('id').primary()
    table.string('imgUrl')
    table.string('title')
    table.timestamp('date')
    table.integer('userId')
    table.string('style', 5000)
    table.integer('spotId')
    table.text('message')
    table.float('latitude')
    table.float('longitude')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('postcards')
}
