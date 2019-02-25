/* eslint-env jest */
const UserService = require('../../lib/modules/services/users')
const factory = require('../factories')
const Knex = require('knex')
const knexConfig = require('../../knexfile')
const knexCleaner = require('knex-cleaner')

describe('users service', () => {
  // let client
  let knex = Knex(knexConfig.testing)
  let { Model } = require('objection')
  let user
  beforeAll(async () => {
    Model.knex(knex)
    // await knex.migrate.latest()
  })

  beforeEach(async () => {
    await knexCleaner.clean(knex)
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
    expect(resultingBool).toBeTruthy()
  })

  test('validatePassword with incorrect credentials returns false', async () => {
    let validatePasswordObject = UserService
      .find(o => o.name === 'services.users.validatePassword')

    let validatePassword = validatePasswordObject.method
    let resultingBool = await validatePassword(user, 'invalidPassword')
    expect(resultingBool).toBeFalsy()
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
})
