exports.up = async function (knex) {
  return knex.schema.createTable('tags', (table) => {
    table.increments('id').primary()
    table.string('text')
    table.string('username')
    table.boolean('isPublicTag')
    table.integer('postcardId')
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('tags')
}
