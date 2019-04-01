/* eslint-env jest */

module.exports = async function (done) {
  const knexConfig = require('../knexfile')
  const knexCleaner = require('knex-cleaner')
  const Knex = require('knex')
  const knex = Knex(knexConfig.testing)
  await knexCleaner.clean(knex).then({})
  await knex.destroy()
}
