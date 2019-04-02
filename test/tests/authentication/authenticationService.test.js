/* eslint-env jest */
const Hapi = require('hapi')
const Schmervice = require('schmervice')

const AuthenticationService = require('../../../lib/modules/auth/services/authService')
const MockUserRepository = require('../../mocks/userRepository')
const faker = require('faker')
var crypto = require('crypto')
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
      let username = faker.internet.userName()
      let password = faker.internet.password(6)
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

      let username = faker.internet.userName()
      let password = faker.internet.password(6)

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

describe('Authentication Service integrated with Repositories', () => {})

/* eslint-env jest */
// const UserService = require('../../lib/modules/services/users')
// const factory = require('../factories')
// const Knex = require('knex')
// const knexConfig = require('../../knexfile')
// // const knexCleaner = require('knex-cleaner')
// const extractMethod = require('./helpers').extractMethod
// const UserModel = require('../../lib/modules/models/User')
// describe('users service unit tests', async () => {
//   // let client
//   let knex = Knex(knexConfig.testing)
//   let { Model } = require('objection')
//   let user
//   beforeAll(async () => {
//     Model.knex(knex)
//     // await knex.migrate.latest()
//   })

//   beforeEach(async () => {
//     // await knexCleaner.clean(knex)
//     user = await factory.create('user')
//   })

//   test('findByUsername returns the correct user', async () => {
//     let findByUsernameObject = UserService
//       .find(o => o.name === 'services.users.findByUsername')

//     let findByUsername = findByUsernameObject.method
//     let resultingUser = await findByUsername(user.username)

//     expect(resultingUser).toEqual(user)
//   })

//   test('toAuthJSONFor returns a valid Auth', async () => {
//     let generateAuthJSONForObject = UserService
//       .find(o => o.name === 'services.users.generateAuthJSONFor')

//     let generateAuthJSONFor = generateAuthJSONForObject.method
//     let authResult = await generateAuthJSONFor(user)
//     expect(authResult).toBeInstanceOf(Object)
//     expect(authResult.username).toEqual(user.username)
//     expect(authResult.email).toEqual(user.email)
//     expect(authResult.token).toBeDefined()
//   })

//   test('userExistsFromEmail returns true for an existing user', async () => {
//     let userExistsFromEmail = extractMethod('services.users.userExistsFromEmail', UserService)
//     let result = await userExistsFromEmail(user.email)
//     expect(result).toBe(true)
//   })

//   test('userExistsFromEmail returns false from a non existing user', async () => {
//     let userExistsFromEmail = extractMethod('services.users.userExistsFromEmail', UserService)
//     let result = await userExistsFromEmail('gibberish')
//     expect(result).toBe(false)
//   })

//   test('userExistsFromUsername returns true for an existing user', async () => {
//     let userExistsFromUsername = extractMethod('services.users.userExistsFromUsername', UserService)
//     let result = await userExistsFromUsername(user.username)
//     expect(result).toBe(true)
//   })

//   test('userExistsFromUsername returns false from a non existing user', async () => {
//     let userExistsFromUsername = extractMethod('services.users.userExistsFromUsername', UserService)
//     let result = await userExistsFromUsername('gibberish')
//     expect(result).toBe(false)
//   })

//   test('createUser returns User Object', async () => {
//     let attrs = await factory.attrs('user', { password: 'password' })
//     let createUser = await extractMethod('services.users.createUser', UserService)
//     let result = await createUser(attrs)
//     expect(result).toBeInstanceOf(UserModel)
//     expect(result.username).toEqual(attrs.username)
//     expect(result.email).toEqual(attrs.email)
//   })

//   test('createUser creates user in db', async () => {
//     let attrs = await factory.attrs('user', { password: 'password' })
//     let createUser = extractMethod('services.users.createUser', UserService)
//     let createdUser = await createUser(attrs)
//     let queryFromDB = await UserModel.query().findById(createdUser.uid)
//     expect(queryFromDB).toBeInstanceOf(Object)
//     expect(queryFromDB.username).toEqual(attrs.username)
//     expect(queryFromDB.email).toEqual(attrs.email)
//     expect(queryFromDB.hash).toBeDefined()
//     expect(queryFromDB.salt).toBeDefined()
//   })
// })
