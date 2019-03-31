/* eslint-env jest */
const Hapi = require('hapi')
const Schmervice = require('schmervice')

const AuthenticationService = require('../../lib/modules/authentication/services/authenticationService')
// var sqlite3 = require('sqlite3')

describe('Authentication Service', () => {
  let server
  // let client

  beforeEach(async () => {
    server = await Hapi.Server()
    await server.register(Schmervice)
    await server.register(AuthenticationService)
  })

  describe('createUser')
  describe('setPassword')
  describe('validatePassword')
  describe('generateJWT')
  describe('generateAuthJSONFor')
  describe('validateJWT')
})

describe('Authentication Service integrated with Repositories', () => {

})
