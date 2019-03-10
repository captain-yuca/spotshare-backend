/* eslint-env jest */

const createServer = require('../lib')
const factory = require('./factories')
// const DatabaseCleaner = require('database-cleaner')
// const databaseCleaner = new DatabaseCleaner('sqlite')
const Knex = require('knex')
const knexConfig = require('../knexfile')
const knexCleaner = require('knex-cleaner')

// var sqlite3 = require('sqlite3')

describe('get postcard', () => {
  let server
  // let client
  // let user
  let postcard
  let knex = Knex(knexConfig.testing)
  beforeAll(async () => {
    // await knex.migrate.latest()
  })

  beforeEach(async () => {
    await knexCleaner.clean(knex)
    // user = await factory.create('user')
    postcard = await factory.create('postcard')
    server = await createServer
  })

  test('return status 200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/postcards'
    })
    expect(response.statusCode).toEqual(200)
    var payload = JSON.parse(response.payload)
    expect(payload).toBeInstanceOf(Object)
    expect(payload.postcards).toBeInstanceOf(Array)
    expect(payload.postcards).toHaveLength(1)
    expect(payload.postcards[0]).toBeDefined()
    expect(payload.postcards[0]).toMatchObject(postcard)
  })
})
