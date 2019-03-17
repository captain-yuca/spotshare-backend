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
  let user
  let postcard
  let knex = Knex(knexConfig.testing)
  beforeAll(async () => {
    // await knex.migrate.latest()
  })

  beforeEach(async () => {
    await knexCleaner.clean(knex)
    user = await factory.create('user')
    postcard = await factory.create('postcard', { userId: user.uid })
    server = await createServer
  })

  test('return status 200', async () => {
    var { date, id, imgUrl, title } = postcard
    const response = await server.inject({
      method: 'GET',
      url: `/api/postcards/${id}`,
      headers: {
        'Authorization': `${await server.methods.services.users.generateJWT(user)}`
      }
    })
    expect(response.statusCode).toEqual(200)
    var payload = JSON.parse(response.payload)
    expect(payload).toBeInstanceOf(Object)
    expect(payload.postcard).toBeDefined()
    expect(payload.postcard).toMatchObject({ date, id, imgUrl, title })
  })
})

describe('get multiple postcards', () => {
  let server

  let user
  let knex = Knex(knexConfig.testing)

  beforeEach(async () => {
    await knexCleaner.clean(knex)
    user = await factory.create('user')
    await factory.createMany('postcard_without_assoc', 30, { userId: user.uid })
    server = await createServer
  })

  test('return 10 postcards by default with 200 status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/postcards',
      headers: {
        'Authorization': `${await server.methods.services.users.generateJWT(user)}`
      }
    })
    expect(response.statusCode).toEqual(200)
    var payload = JSON.parse(response.payload)
    expect(payload).toBeInstanceOf(Object)
    expect(payload.postcards).toBeInstanceOf(Array)
    expect(payload.postcards).toHaveLength(10)
  })

  test('return 20 postcards with query params with 200 status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/postcards?limit=20',
      headers: {
        'Authorization': `${await server.methods.services.users.generateJWT(user)}`
      }
    })
    expect(response.statusCode).toEqual(200)
    var payload = JSON.parse(response.payload)
    expect(payload).toBeInstanceOf(Object)
    expect(payload.postcards).toBeInstanceOf(Array)
    expect(payload.postcards).toHaveLength(20)
  })
})
