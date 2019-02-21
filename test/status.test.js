/* eslint-env jest */

const createServer = require('../lib')

describe('Hapi Healthchecks', () => {
  let server

  beforeEach(async () => {
    server = await createServer
  })

  test('Hapi Healthchecks respond correctly', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/status'
    })

    expect.assertions(2)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload)).toEqual({ status: 'UP' })
  })
})
