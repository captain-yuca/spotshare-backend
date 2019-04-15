exports.up = async function (knex) {
  return knex.schema.alterTable('postcards', (table) => {
    table.string('spotId').alter()
  })
}

exports.down = async function (knex) {
  return knex.schema.alterTable('postcards', (table) => {
    table.integer('spotId').alter()
  })
}
