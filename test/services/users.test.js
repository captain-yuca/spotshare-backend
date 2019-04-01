/* eslint-env jest */
const UserService = require('../../lib/modules/services/users')
const factory = require('../factories')
const Knex = require('knex')
const knexConfig = require('../../knexfile')
// const knexCleaner = require('knex-cleaner')
const extractMethod = require('./helpers').extractMethod
const UserModel = require('../../lib/modules/models/User')
describe('users service', async () => {
  // let client
  let knex = Knex(knexConfig.testing)
  let { Model } = require('objection')
  let user
  beforeAll(async () => {
    Model.knex(knex)
    // await knex.migrate.latest()
  })

  beforeEach(async () => {
    // await knexCleaner.clean(knex)
    user = await factory.create('user')
  })

  test('findByUsername returns the correct user', async () => {
    let findByUsernameObject = UserService
      .find(o => o.name === 'services.users.findByUsername')

    let findByUsername = findByUsernameObject.method
    let resultingUser = await findByUsername(user.username)

    expect(resultingUser).toEqual(user)
  })

  test('validatePassword with correct credentials returns true', async () => {
    let validatePasswordObject = UserService
      .find(o => o.name === 'services.users.validatePassword')

    let validatePassword = validatePasswordObject.method
    let resultingBool = await validatePassword(user, 'password')
    expect(resultingBool).toBe(true)
  })

  test('validatePassword with incorrect credentials returns false', async () => {
    let validatePasswordObject = UserService
      .find(o => o.name === 'services.users.validatePassword')

    let validatePassword = validatePasswordObject.method
    let resultingBool = await validatePassword(user, 'invalidPassword')
    expect(resultingBool).toBe(false)
  })

  test('toAuthJSONFor returns a valid Auth', async () => {
    let generateAuthJSONForObject = UserService
      .find(o => o.name === 'services.users.generateAuthJSONFor')

    let generateAuthJSONFor = generateAuthJSONForObject.method
    let authResult = await generateAuthJSONFor(user)
    expect(authResult).toBeInstanceOf(Object)
    expect(authResult.username).toEqual(user.username)
    expect(authResult.email).toEqual(user.email)
    expect(authResult.token).toBeDefined()
  })

  test('userExistsFromEmail returns true for an existing user', async () => {
    let userExistsFromEmail = extractMethod('services.users.userExistsFromEmail', UserService)
    let result = await userExistsFromEmail(user.email)
    expect(result).toBe(true)
  })

  test('userExistsFromEmail returns false from a non existing user', async () => {
    let userExistsFromEmail = extractMethod('services.users.userExistsFromEmail', UserService)
    let result = await userExistsFromEmail('gibberish')
    expect(result).toBe(false)
  })

  test('userExistsFromUsername returns true for an existing user', async () => {
    let userExistsFromUsername = extractMethod('services.users.userExistsFromUsername', UserService)
    let result = await userExistsFromUsername(user.username)
    expect(result).toBe(true)
  })

  test('userExistsFromUsername returns false from a non existing user', async () => {
    let userExistsFromUsername = extractMethod('services.users.userExistsFromUsername', UserService)
    let result = await userExistsFromUsername('gibberish')
    expect(result).toBe(false)
  })

  test('createUser returns User Object', async () => {
    let attrs = await factory.attrs('user', { password: 'password' })
    let createUser = await extractMethod('services.users.createUser', UserService)
    let result = await createUser(attrs)
    expect(result).toBeInstanceOf(UserModel)
    expect(result.username).toEqual(attrs.username)
    expect(result.email).toEqual(attrs.email)
  })

  test('createUser creates user in db', async () => {
    let attrs = await factory.attrs('user', { password: 'password' })
    let createUser = extractMethod('services.users.createUser', UserService)
    let createdUser = await createUser(attrs)
    let queryFromDB = await UserModel.query().findById(createdUser.uid)
    expect(queryFromDB).toBeInstanceOf(Object)
    expect(queryFromDB.username).toEqual(attrs.username)
    expect(queryFromDB.email).toEqual(attrs.email)
    expect(queryFromDB.hash).toBeDefined()
    expect(queryFromDB.salt).toBeDefined()
  })
})
