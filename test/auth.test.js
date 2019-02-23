/* eslint-env jest */

const createServer = require('../lib')
const factory = require('./factories')

describe('login', () => {
  let server
  let user
  beforeAll(async () => {
    user = await factory.create('user')
  })

  beforeEach(async () => {
    server = await createServer
  })

  test('return status 200 with valid credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        'user': {
          'username': user.username,
          'password': 'password'
        }
      }
    })
    expect(response.statusCode).toEqual(200)
    var payload = JSON.parse(response.payload)
    expect(payload).toBeInstanceOf(Object)
    expect(payload.user).toBeDefined()
    expect(payload.user.token).toBeDefined()
    expect(payload.user.username).toEqual(user.username)
    // expect(payload.user.email).toEqual(user.email)
  })

  test('return 401 with invalid credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        'user': {
          'username': user.username,
          'password': 'invalidPassword'
        }
      }
    })
    console.log(response)
    expect(response.statusCode).toEqual(401)
    var payload = JSON.parse(response.payload)
    expect(payload.error).toEqual('Unauthorized')
    expect(payload.message).toEqual('Invalid Credentials')
  })
})
