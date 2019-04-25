/* eslint-env jest */

// const DatabaseCleaner = require('database-cleaner')
// const databaseCleaner = new DatabaseCleaner('sqlite')
// const Knex = require('knex')
// const knexConfig = require('../../../knexfile')
// const knexCleaner = require('knex-cleaner')

// var sqlite3 = require('sqlite3')
describe('Postcard Routes', () => {
  const createServer = require('../../../lib')
  const factory = require('../../factories')
  let server
  let user
  let postcard
  let unauthorizedUser

  beforeAll(async (done) => {
    // await knexCleaner.clean(knex)
    server = await createServer
    user = await factory.create('user')
    unauthorizedUser = await factory.create('user')
    postcard = await factory.create('postcard', { userId: user.uid })
    await factory.createMany('postcard_without_assoc', 30, { userId: user.uid })
    done()
  })

  afterAll(async () => {
    await server.stop()
  })
  describe('get single Postcard', async () => {
    test('return status 200', async () => {
      var { id } = postcard
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: `/api/postcards/${id}`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })
      // console.error(response)
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.postcard).toBeDefined()
      let match = postcard
      delete match.owner
      expect(payload.postcard).toMatchObject(match)
    })

    test('return status 401 with unauthorized user', async () => {
      var { id } = postcard
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: `/api/postcards/${id}`,
        headers: {
          'Authorization': `${await authService.generateJWT(unauthorizedUser)}`
        }
      })
      expect(response.statusCode).toEqual(401)
    })

    test('return status 404 with nonexistant postcard', async () => {
      var id = -1
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: `/api/postcards/${id}`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })
      expect(response.statusCode).toEqual(404)
    })
  })

  describe('get multiple postcards', () => {
    // let knex = Knex(knexConfig.testing)

    beforeAll(async () => {
      // await knexCleaner.clean(knex)
    })

    test('return 10 postcards by default with 200 status', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: '/api/postcards',
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.postcards).toBeInstanceOf(Array)
      expect(payload.postcards).toHaveLength(10)
    })

    test('return 20 postcards with query params with 200 status', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: '/api/postcards?limit=20',
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.postcards).toBeInstanceOf(Array)
      expect(payload.postcards).toHaveLength(20)
    })

    test('return postcards with with query search param with 200 status', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: `/api/postcards?q=${postcard.title}`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.postcards).toBeInstanceOf(Array)
      for (let i = 0; i < payload.postcards.length; i++) {
        expect(payload.postcards[i].title).toEqual(postcard.title)
      }
    })
  })
  describe('collect postcard', async () => {
    test('successfully created postcard 200', async () => {
      const { authService } = server.services()
      const reqPayload = {
        postcard: {
          spotId: '1'
        }
      }
      const response = await server.inject({
        method: 'POST',
        url: '/api/postcards',
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        },
        payload: reqPayload
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload.postcard).toBeInstanceOf(Object)
    })
    test('nonexistant spot 403', async () => {
      const { authService } = server.services()
      const reqPayload = {
        postcard: {
          spotId: '-1'
        }
      }
      const response = await server.inject({
        method: 'POST',
        url: '/api/postcards',
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        },
        payload: reqPayload
      })
      expect(response.statusCode).toEqual(403)
    })
    test.todo('user already has a postcard from that place 403')
  })

  describe('tags', async () => {
    let postcardWithoutTags1
    let postcardWithoutTags2
    // let postcardWithoutTags3
    let sharedUser

    beforeAll(async (done) => {
      // await knexCleaner.clean(knex)
      sharedUser = await factory.create('user')
      postcardWithoutTags1 = await factory.create('postcard', { userId: user.uid })
      postcardWithoutTags2 = await factory.create('postcard', { userId: user.uid })
      // postcardWithoutTags3 = await factory.create('postcard', { userId: user.uid })
      done()
    })

    test('successfully created tag on an existing postcard 200', async () => {
      const { authService } = server.services()
      var { id } = postcardWithoutTags1
      const reqPayload = {
        tag: {
          type: 'category',
          text: 'dogs'
        }
      }
      const response = await server.inject({
        method: 'POST',
        url: `/api/postcards/${id}/tags`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        },
        payload: reqPayload
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      console.log(payload)
      expect(payload.tags).toBeInstanceOf(Array)
      expect(payload.tags).toHaveLength(1)
    })

    test('successfully created sharing tag on an existing postcard 200', async () => {
      const { authService } = server.services()
      var { id } = postcardWithoutTags2
      const reqPayload = {
        tag: {
          type: 'sharing',
          text: sharedUser.username
        }
      }
      const response = await server.inject({
        method: 'POST',
        url: `/api/postcards/${id}/tags`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        },
        payload: reqPayload
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      console.log(payload)
      expect(payload.tags).toBeInstanceOf(Array)
      expect(payload.tags).toHaveLength(1)
    })
  })
})
