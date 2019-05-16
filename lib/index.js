'user strict'

// require('dotenv').config({ path: process.cwd() + '/.secret' })

const Glue = require('glue')

const manifest = require('./config/manifest')
const Knex = require('knex')
const knexConfig = require('../knexfile')
var knex
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'testing') {
  knex = Knex(knexConfig.testing)
} else if (process.env.NODE_ENV === 'production') {
  knex = Knex(knexConfig.production)
} else if (process.env.NODE_ENV === 'staging') {
  knex = Knex(knexConfig.staging)
} else {
  knex = Knex(knexConfig.development)
}
var { Model } = require('objection')
var options = {
  relativeTo: process.cwd() + '/lib/modules'
}
const startServer = async function () {
  try {
    const server = await Glue.compose(manifest, options)
    await Model.knex(knex)
    if (process.env.NODE_ENV === 'test') {
      return server
    }
    await server.start()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
module.exports = startServer()
