/* eslint-env jest */
const Hapi = require('hapi')
const Schmervice = require('schmervice')
const Schwifty = require('schwifty')
const PostcardObjectionModel = require('../../../lib/modules/postcards/models/Postcard')

const PostcardRepository = require('../../../lib/modules/postcards/repositories/postcardRepository')
// var sqlite3 = require('sqlite3')
const factory = require('../../factories')

describe('Postcard Repository', () => {
  const Knex = require('knex')
  const knexConfig = require('../../../knexfile')
  const { Model } = require('objection')

  let knex
  let server
  let user
  let publicPostcard
  // let client
  beforeAll(async () => {
    knex = Knex(knexConfig.testing)
    Model.knex(knex)
    server = await Hapi.Server()
    await server.register({
      plugin: Schwifty,
      options: {
        models: [PostcardObjectionModel]
      }
    })
    await server.register(Schmervice)
    await server.registerService(PostcardRepository)
    user = await factory.create('user')
    publicPostcard = await factory.create('postcard', { userId: user.uid })
    await factory.create('public_tag', { postcardId: publicPostcard.id })
  })
  describe('getPublicPostcards', () => {
    test('gets a postcard instance', async () => {
      const { postcardRepository } = server.services()
      let results = await postcardRepository.getPublicPostcards(0, 10, {})
      expect(results[0].id).toEqual(publicPostcard.id)
    })
  })
})
