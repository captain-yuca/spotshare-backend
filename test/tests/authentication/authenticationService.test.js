/* eslint-env jest */
const Hapi = require('hapi')
const Schmervice = require('schmervice')
const Schwifty = require('schwifty')
const AuthenticationService = require('../../../lib/modules/auth/services/authService')
const MockUserRepository = require('../../mocks/userRepository')
const UserRepository = require('../../../lib/modules/auth/repositories/userRepository')
const faker = require('faker')
var crypto = require('crypto')
const {
  NotFoundError
} = require('objection')
// var jwt = require('jsonwebtoken')
// var config = require('../../../lib/config')
// var sqlite3 = require('sqlite3')

describe('Authentication Service Unit Tests', () => {
  let server
  // let client

  beforeEach(async () => {
    server = await Hapi.Server()
    await server.register(Schmervice)
    await server.registerService(MockUserRepository)
    await server.registerService(AuthenticationService)
  })

  // describe('createUser')
  describe('setPassword', async () => {
    test('sets password correctly', async () => {
      let username = faker.random.alphaNumeric(6)
      let password = faker.random.alphaNumeric(6)
      let user = {
        username
      }
      const { authService } = server.services()
      await authService.setPassword(user, password)
      let expectedHash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')

      expect(user.hash).toEqual(expectedHash)
    })
  })
  describe('validatePassword', async () => {
    test('return true when correct password', async () => {
      const { authService } = server.services()

      let username = faker.random.alphaNumeric(6)
      let password = faker.random.alphaNumeric(6)

      let salt = crypto.randomBytes(16).toString('hex')
      let hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
      let user = {
        username,
        salt,
        hash
      }
      let result = await authService.validatePassword(user, password)

      expect(result).toEqual(true)
    })
    test('return false when incorrect password', async () => {
      const { authService } = server.services()

      let username = faker.internet.userName()
      let realPassword = 'realPassword'
      let fakePassword = 'fakePassword'

      let salt = crypto.randomBytes(16).toString('hex')
      let hash = crypto.pbkdf2Sync(realPassword, salt, 10000, 512, 'sha512').toString('hex')
      let user = {
        username,
        salt,
        hash
      }
      let result = await authService.validatePassword(user, fakePassword)

      expect(result).toEqual(false)
    })
  })
  // describe('generateJWT')
  // describe('generateAuthJSONFor')
  // describe('validateJWT')
})

describe('Authentication Service integrated with Repositories', () => {
  const factory = require('../../factories')
  const Knex = require('knex')
  const knexConfig = require('../../../knexfile')
  const UserObjectionModel = require('../../../lib/modules/auth/models/User')
  const { Model } = require('objection')

  let server, knex
  beforeAll(async () => {
    // await knexCleaner.clean(knex)
    knex = Knex(knexConfig.testing)
    Model.knex(knex)
    // user = await factory.create('user')
    // unauthorizedUser = await factory.create('user')
  })

  beforeEach(async () => {
    server = await Hapi.Server()
    await server.register({
      plugin: Schwifty,
      options: {
        models: [UserObjectionModel]
      }
    })
    await server.register(Schmervice)
    await server.registerService(UserRepository)
    await server.registerService(AuthenticationService)
  })

  describe('setPassword', async () => {
    test('sets password correctly', async () => {
      const { authService } = server.services()

      let user = await factory.create('user')
      let password = faker.internet.password(6)

      await authService.setPassword(user, password)
      let expectedHash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
      let persistedHash = (await UserObjectionModel.query().findById(user.uid)).hash
      expect(persistedHash).toEqual(expectedHash)
    })
  })
  describe('createAndSaveUser', async () => {
    test('creates user correctly in the backend', async () => {
      const { authService } = server.services()

      let username = faker.random.alphaNumeric(6)
      let password = faker.random.alphaNumeric(6)

      let email = 'myemail@myemail.com'
      let attrs = { username, email, password }
      let recievedUser = await authService.createAndSaveUser(attrs)
      let persistedUser = await UserObjectionModel.query().findById(recievedUser.uid)
      expect(persistedUser).toBeDefined()
      expect(persistedUser.username).toEqual(username)

      let expectedHash = crypto.pbkdf2Sync(password, persistedUser.salt, 10000, 512, 'sha512').toString('hex')
      let persistedHash = persistedUser.hash
      expect(persistedHash).toEqual(expectedHash)
    })
  })
  describe('validatePassword', async () => {
    let username, email, password, salt, hash, createdUser
    beforeAll(async () => {
      username = faker.random.alphaNumeric(6)
      email = faker.internet.email()
      password = faker.internet.password(6)
      salt = crypto.randomBytes(16).toString('hex')
      hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
      createdUser = await UserObjectionModel.query().insertAndFetch({ username, email, salt, hash })
    })
    test('returns true for a correct password', async () => {
      const { authService } = server.services()
      let result = await authService.validatePassword(createdUser, password)
      expect(result).toEqual(true)
    })
    test('returns false for an incorrect password', async () => {
      const { authService } = server.services()
      let incorrectPassword = faker.random.word()
      let result = await authService.validatePassword(createdUser, incorrectPassword)
      expect(result).toEqual(false)
    })
  })
  // TODO: findByUsername
  describe('findByUsername', async () => {
    let username, email, password, salt, hash, createdUser

    beforeAll(async () => {
      username = faker.random.alphaNumeric(6)
      email = faker.internet.email()
      password = faker.internet.password(6)
      salt = crypto.randomBytes(16).toString('hex')
      hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
      createdUser = await UserObjectionModel.query().insertAndFetch({ username, email, salt, hash })
    })

    test('returns the created user', async () => {
      const { authService } = server.services()
      let resultingUser = await authService.findByUsername(username)
      expect(resultingUser).toMatchObject(createdUser)
    })

    test('returns NotFoundError', async () => {
      const { authService } = server.services()
      let error
      try {
        await authService
          .findByUsername(faker.random.alphaNumeric(10))
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(NotFoundError)
    })
  })
})
