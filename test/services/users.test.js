/* eslint-env jest */
const UserService = require('../../lib/modules/services/users')
const factory = require('../factories')
const Knex = require('knex')
const knexConfig = require('../../knexfile')
const fs = require('fs')
const path = require('path')

describe('users service', () => {
  // let client
  let knex = Knex(knexConfig.testing)
  let { Model } = require('objection')
  let user
  beforeAll(async () => {
    fs.unlinkSync(path.resolve('./test.sqlite3'))
    Model.knex(knex)
    await knex.migrate.latest()
  })

  beforeEach(async () => {
    user = await factory.create('user')
  })

  test('findByUsername returns the correct user', async () => {
    let findByUsernameObject = UserService
      .find(o => o.name === 'services.users.findByUsername')

    let findByUsername = findByUsernameObject.method
    let resultingUser = await findByUsername(user.username)

    expect(resultingUser).toEqual(user)
  })
})
