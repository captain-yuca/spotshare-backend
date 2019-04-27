/* eslint-env jest */
const faker = require('faker')

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
        spot: {
          id: faker.random.number().toString(),
          name: faker.random.word(),
          location: {
            latitude: faker.random.number(-9999, 9999, 10),
            longitude: faker.random.number(-9999, 9999, 10)
          },
          picture: {
            data: {
              url: faker.image.nightlife()
            }
          }
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
    // test('nonexistant spot 403', async () => {
    //   const { authService } = server.services()
    //   const reqPayload = {
    //     postcard: {
    //       spotId: '-1'
    //     }
    //   }
    //   const response = await server.inject({
    //     method: 'POST',
    //     url: '/api/postcards',
    //     headers: {
    //       'Authorization': `${await authService.generateJWT(user)}`
    //     },
    //     payload: reqPayload
    //   })
    //   expect(response.statusCode).toEqual(403)
    // })
    test.todo('user already has a postcard from that place 403')
  })

  describe('edit postcard', async () => {
    let postcardToEdit
    let user
    beforeAll(async (done) => {
      user = await factory.create('user')
      postcardToEdit = await factory.create('postcard', { userId: user.uid })
      done()
    })

    test('return 200 when edit the postcard', async () => {
      const { authService } = server.services()
      var { id } = postcardToEdit
      const reqPayload = {
        postcard: {
          title: faker.random.word(),
          imgUrl: faker.image.nature(),
          style: { test: 'herrow' },
          message: faker.lorem.words(5)
        }
      }

      const response = await server.inject({
        method: 'PATCH',
        url: `/api/postcards/${id}`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        },
        payload: reqPayload
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload.postcard).toBeInstanceOf(Object)
      expect(payload.postcard.title).toEqual(reqPayload.postcard.title)
      expect(payload.postcard.message).toEqual(reqPayload.postcard.message)
    })
  })

  describe('create tags', async () => {
    let postcardWithoutTags1
    let postcardWithoutTags2
    let postcardWithoutTags3
    let sharedUser

    beforeAll(async (done) => {
      // await knexCleaner.clean(knex)
      sharedUser = await factory.create('user')
      postcardWithoutTags1 = await factory.create('postcard', { userId: user.uid })
      postcardWithoutTags2 = await factory.create('postcard', { userId: user.uid })
      postcardWithoutTags3 = await factory.create('postcard', { userId: user.uid })
      done()
    })

    test('successfully created category tag on an existing postcard 200', async () => {
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

    test('successfully created public tag on an existing postcard 200', async () => {
      const { authService } = server.services()
      var { id } = postcardWithoutTags3
      const reqPayload = {
        tag: {
          type: 'public'
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

  describe('delete tags', async () => {
    let postcard
    let user
    let sharedUser
    let category

    beforeEach(async (done) => {
      category = 'animal'
      user = await factory.create('user')
      sharedUser = await factory.create('user', { username: category })
      postcard = await factory.create('postcard_without_assoc', { userId: user.uid })
      await factory.create('category_tag', { postcardId: postcard.id, text: category })
      await factory.create('sharing_tag', { postcardId: postcard.id, username: sharedUser.username })
      done()
    })

    test('delete category tag return 200', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/postcards/${postcard.id}/tags/${category}?type=category`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.tags).toBeInstanceOf(Array)
      expect(payload.tags).toHaveLength(1)
      expect(payload.tags[0].text).toEqual(category)
      expect(payload.tags[0].type).toEqual('sharing')
    })

    test('delete username tag return 200', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/postcards/${postcard.id}/tags/${category}?type=sharing`,
        headers: {
          'Authorization': `${await authService.generateJWT(user)}`
        }
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.tags).toBeInstanceOf(Array)
      expect(payload.tags).toHaveLength(1)
      expect(payload.tags[0].text).toEqual(category)
      expect(payload.tags[0].type).toEqual('category')
    })
  })

  describe('category tags', async () => {
    let postcards
    let user
    let category

    beforeAll(async (done) => {
      category = 'animal'
      user = await factory.create('user')
      postcards = await factory.createMany('postcard_without_assoc', 3, { userId: user.uid })
      for (let i = 0; i < postcards.length; i++) {
        let p = postcards[i]
        await factory.create('category_tag', { postcardId: p.id, text: category })
      }
      done()
    })
    describe('get tags', async () => {
      test('return 1 tag 200', async () => {
        const { authService } = server.services()
        const response = await server.inject({
          method: 'GET',
          url: `/api/postcards/${postcards[0].id}/tags`,
          headers: {
            'Authorization': `${await authService.generateJWT(user)}`
          }
        })
        expect(response.statusCode).toEqual(200)
        var payload = JSON.parse(response.payload)
        expect(payload).toBeInstanceOf(Object)
        expect(payload.tags).toBeInstanceOf(Array)
        expect(payload.tags).toHaveLength(1)
        expect(payload.tags[0].text).toEqual(category)
      })
    })
    describe('search postcards by public tags', async () => {
      test('return 3 postcards shared to me with 200 status', async () => {
        const { authService } = server.services()
        const response = await server.inject({
          method: 'GET',
          url: `/api/postcards?limit=3&q=${category}`,
          headers: {
            'Authorization': `${await authService.generateJWT(user)}`
          }
        })
        expect(response.statusCode).toEqual(200)
        var payload = JSON.parse(response.payload)
        expect(payload).toBeInstanceOf(Object)
        expect(payload.postcards).toBeInstanceOf(Array)
        expect(payload.postcards).toHaveLength(3)
      })
    })
  })

  describe('search shared postcards by tags', async () => {
    let postcards
    let sharer
    let reciever
    // let category

    beforeAll(async (done) => {
      // category = 'animal'
      sharer = await factory.create('user')
      reciever = await factory.create('user')
      postcards = await factory.createMany('postcard_without_assoc', 3, { userId: sharer.uid })
      for (let i = 0; i < postcards.length; i++) {
        let p = postcards[i]
        await factory.create('sharing_tag', { postcardId: p.id, username: reciever.username })
      }
      done()
    })

    test('return 3 postcards shared to me with 200 status', async () => {
      const { authService } = server.services()
      const response = await server.inject({
        method: 'GET',
        url: '/api/postcards?limit=3&visibility=shared',
        headers: {
          'Authorization': `${await authService.generateJWT(reciever)}`
        }
      })
      expect(response.statusCode).toEqual(200)
      var payload = JSON.parse(response.payload)
      expect(payload).toBeInstanceOf(Object)
      expect(payload.postcards).toBeInstanceOf(Array)
      expect(payload.postcards).toHaveLength(3)
    })
  })
})
