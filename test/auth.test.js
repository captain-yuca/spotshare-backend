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

  test('return status 401 with invalid credentials', async () => {
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

  test('return status 400 with invalid request payload', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        user: {}
      }
    })

    expect(response.statusCode).toEqual(400)
    var payload = JSON.parse(response.payload)
    expect(payload.error).toEqual('Bad Request')
    expect(payload.invalidParameters).toBeDefined()
  })
})

describe('register', () => {
  let server
  // let client
  let knex = Knex(knexConfig.testing)
  beforeAll(async () => {
    // await knex.migrate.latest()
  })

  beforeEach(async () => {
    await knexCleaner.clean(knex)
    server = await createServer
  })

  test('return status 200 with valid information', async () => {
    let attrs = await factory.attrs('user', { password: 'password' })
    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        'user': {
          'username': attrs.username,
          'email': attrs.email,
          'password': 'password'
        }
      }
    })
    expect(response.statusCode).toEqual(200)
    var payload = JSON.parse(response.payload)
    expect(payload).toBeInstanceOf(Object)
    expect(payload.user).toBeDefined()
    expect(payload.user.token).toBeDefined()
    expect(payload.user.username).toEqual(attrs.username)
    expect(payload.user.email).toEqual(attrs.email)
  })

  test('return status 409 with existing credentials', async () => {
    let user = await factory.create('user')
    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        'user': {
          'username': user.username,
          'email': user.email,
          'password': 'password'
        }
      }
    })
    expect(response.statusCode).toEqual(409)
  })
})
