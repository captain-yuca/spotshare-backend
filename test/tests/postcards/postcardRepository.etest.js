/* eslint-env jest */
const Hapi = require('hapi')
const Schmervice = require('schmervice')

const PostcardRepository = require('../../lib/modules/postcards/repositories/postcardRepository')
// var sqlite3 = require('sqlite3')

describe('Postcard Repository', () => {
  let server
  // let client

  beforeEach(async () => {
    // Create MockSpotRepository
    // Create MockPostcardRepository

    server = await Hapi.Server()
    await server.register(Schmervice)
    await server.register(PostcardRepository)
  })

  describe('findById', () => {})
  describe('query', () => {})
  describe('findByUserId', () => {})
  describe('findBySpotId', () => {})
  describe('store', () => {})
  describe('update', () => {})
})

describe('Postcard Service integrated with Repositories', () => {
  // const Knex = require('knex')
  // const knexConfig = require('../../knexfile')
  // const knexCleaner = require('knex-cleaner')
  // const factory = require('../factories')
  const PostcardRepository = require('../../lib/modules/postcards/repositories/postcardRepository')
  const SpotRepository = require('../../lib/modules/postcards/repositories/spotRepository')
  let server
  // let knex = Knex(knexConfig.testing)
  beforeEach(async () => {
    // await knexCleaner.clean(knex)
    server = await Hapi.Server()
    await server.register(SpotRepository)
    await server.register(PostcardRepository)
    // await server.register(PostcardService)
  })
})
