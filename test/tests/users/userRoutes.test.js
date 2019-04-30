/* eslint-env jest */

const createServer = require('../../../lib')
const factory = require('../../factories')
const faker = require('faker')
const moment = require('moment')
// const DatabaseCleaner = require('database-cleaner')
// const databaseCleaner = new DatabaseCleaner('sqlite')
// const Knex = require('knex')
// const knexConfig = require('../knexfile')
// const knexCleaner = require('knex-cleaner')

// var sqlite3 = require('sqlite3')
describe('Authentication Routes', async () => {
  describe('generate user activity report', async () => {
    let server
    // let client
    let user
    beforeAll(async () => {
    })
    afterAll(async () => {
      await server.stop()
    })

    beforeEach(async () => {
      server = await createServer
      user = await factory.create('user')
      await factory.createMany('postcard_without_assoc', 30, { userId: user.uid })
    })

    test('generate a user report status 200', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: '/api/users/activity',
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })

      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.activity).toBeInstanceOf(Object)
      expect(payload.activity.postcardCount).toEqual(30)
      expect(payload.activity.postcardCollectionLog).toHaveLength(30)
    })
  })
  describe('editUser', async () => {
    let server
    // let client
    let user
    // let knex = Knex(knexConfig.testing)
    beforeAll(async () => {
      // await knex.migrate.latest()
    })
    afterAll(async () => {
      await server.stop()
    })

    beforeEach(async () => {
      // await knexCleaner.clean(knex)
      server = await createServer
      user = await factory.create('user')
    })

    test('return status 200 when valid firstName and lastName with updated user', async () => {
      const { authService } = server.services()
      let reqPayload = {
        user: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName()
        }
      }
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/users',
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        },
        payload: reqPayload
      })

      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.user).toBeDefined()
      expect(payload.user).toMatchObject(reqPayload.user)
    })

    test('return status 200 when valid birthdate with updated user', async () => {
      const { authService } = server.services()
      let reqPayload = {
        user: {
          birthdate: moment(faker.date.past(18).toISOString()).format('MM-DD-YYYY')
        }
      }
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/users',
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        },
        payload: reqPayload
      })

      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.user).toBeDefined()
      expect(payload.user).toMatchObject(reqPayload.user)
    })
  })

  describe('get user', async () => {
    let server
    // let client
    let user
    // let knex = Knex(knexConfig.testing)
    beforeAll(async () => {
      // await knex.migrate.latest()
    })
    afterAll(async () => {
      await server.stop()
    })

    beforeEach(async () => {
      // await knexCleaner.clean(knex)
      server = await createServer
      user = await factory.create('user')
    })

    test('return status 200 when valid request with updated user', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: `/api/users/${user.username}`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })

      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.user).toBeDefined()
      expect(payload.user).toMatchObject(user)
    })
  })
})
