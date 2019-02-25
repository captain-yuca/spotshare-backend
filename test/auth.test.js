/* eslint-env jest */

const createServer = require('../lib')
const factory = require('./factories')
// const DatabaseCleaner = require('database-cleaner')
// const databaseCleaner = new DatabaseCleaner('sqlite')
const Knex = require('knex')
const knexConfig = require('../knexfile')
const knexCleaner = require('knex-cleaner')

// var sqlite3 = require('sqlite3')

describe('login', () => {
  let server
  // let client
  let user
  let knex = Knex(knexConfig.testing)
  beforeAll(async () => {
    // await knex.migrate.latest()
  })

  beforeEach(async () => {
    await knexCleaner.clean(knex)
    user = await factory.create('user')
    server = await createServer
  })

  test('return status 200 with valid credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        'user': {
          'username': user.username,
          'password': 'password'
        }
      }
    })
    expect(response.statusCode).toEqual(200)
    var payload = JSON.parse(response.payload)
    expect(payload).toBeInstanceOf(Object)
    expect(payload.user).toBeDefined()
    expect(payload.user.token).toBeDefined()
    expect(payload.user.username).toEqual(user.username)
    // expect(payload.user.email).toEqual(user.email)
  })

  test('return 401 with invalid credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        'user': {
          'username': user.username,
          'password': 'invalidPassword'
        }
      }
    })
    expect(response.statusCode).toEqual(401)
    var payload = JSON.parse(response.payload)
    expect(payload.error).toEqual('Unauthorized')
    expect(payload.message).toEqual('Invalid Credentials')
  })
})
