/* eslint-env jest */
const Hapi = require('hapi')
const Schmervice = require('schmervice')

const PostcardService = require('../../lib/modules/postcards/services/postcardService')
// var sqlite3 = require('sqlite3')

describe('Postcard Service', () => {
  let server
  // let client

  beforeEach(async () => {
    // Create MockSpotRepository
    // Create MockPostcardRepository

    server = await Hapi.Server()
    await server.register(Schmervice)
    // await server.register(MockSpotRepository)
    // await server.register(MockPostcardRepository)
    // await server.register(MockTemplateRepository)
    await server.register(PostcardService)
  })

  describe('getPostcardById', () => {
    test('gets a postcard instance')
    test('throws a Boom notFound error when not found')
    test('throws a Boom unathorized error when not authorized')
  })
  describe('createPostcard', () => {

  })
  describe('findPostcardsByUserId', () => {

  })
})

describe('Postcard Service integrated with Repositories', () => {
})
