
const register = (server, options) => {
  // const preResponse = (request, h) => {
  //   let response = request.response
  //   if (response.isBoom) {
  //     const reformated = { errors: {} }
  //     reformated.errors[response.output.statusCode] = [response.output.payload.message]
  //     return h.response(reformated).code(response.output.statusCode)
  //   }
  //   return h.continue
  // }

  server.register(require('./postcards'))

  // server.ext('onPreResponse', preResponse)

  server.route({
    method: 'GET',
    path: '/status',
    config: {
      description: 'Status endpoint',
      notes: 'Return the current status of the API',
      tags: ['api', 'status']
    },
    handler: (request, h) => {
      return { status: 'UP' }
    }
  })
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}

module.exports = plugin
