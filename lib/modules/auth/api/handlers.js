
const Boom = require('boom')
const {
  // ValidationError,
  NotFoundError
} = require('objection')
module.exports = (server) => {
  return {
    /**
     * POST /api/users/login
     */
    login: async function (request, h) {
      let user
      let payload = request.payload.user
      const { authService } = request.services()
      try {
        user = await authService.findByUsername(payload.username)
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw Boom.unauthorized('Invalid Credentials')
        } else {
          throw Boom.badImplementation(err.message)
        }
      }
      if (!(await authService.validatePassword(user, payload.password))) {
        throw Boom.unauthorized('Invalid Credentials')
      }
      let response = {
        user: await authService.generateAuthJSONFor(user)
      }

      return h.response(response).code(200)
    },

    register: async function (request, h) {
      let attrs = request.payload.user
      const { authService } = request.services()

      if (
        await authService.userExistsFromEmail(attrs.email) ||
        await authService.userExistsFromUsername(attrs.username)
      ) {
        throw Boom.conflict('Username or email already exists in the system')
      }

      let newUser = await authService.createAndSaveUser(attrs)
      let response = {
        user: await authService.generateAuthJSONFor(newUser)
      }

      return h.response(response).code(200)
    }
  }
}
