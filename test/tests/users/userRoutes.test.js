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

    test('return status 200 when valid request with updated user', async () => {
      const { authService } = server.services()
      let reqPayload = {
        user: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
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
})
