/* eslint-env jest */

module.exports = async function (done) {
  console.log('Starting Teardown')
  const knexConfig = require('../knexfile')
  const knexCleaner = require('knex-cleaner')
  const Knex = require('knex')
  const knex = Knex(knexConfig.testing)
  await knexCleaner.clean(knex).then({})
  await knex.destroy()
  console.log('Finished Teardown')
}
