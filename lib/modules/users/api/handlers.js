
module.exports = (server) => {
  return {
    /**
     * POST /api/users/login
     */
    login: async function (request, h) {
      let user
      let payload = request.payload.user
      try {
        user = await server.methods.services.users
          .findByUsername(payload.username)
      } catch (err) {
        return h.response({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid Credentials'
        }).code(401)
      }
      if (!(await server.methods.services.users
        .validatePassword(user, payload.password))) {
        return h.response({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid Credentials'
        }).code(401)
      }
      let response = {
        user: await server.methods.services.users
          .generateAuthJSONFor(user)
      }

      return h.response(response).code(200)
    },

    register: async function (request, h) {
      let attrs = request.payload.user

      if (
        await server.methods.services.users
          .userExistsFromEmail(attrs.email) ||
        await server.methods.services.users
          .userExistsFromUsername(attrs.username)
      ) {
        return h.response({
          statusCode: 409,
          error: 'Conflict',
          message: 'Username or email already exists in the system'
        }).code(409)
      }

      let newUser = await server.methods.services.users
        .createUser(attrs)
      let response = {
        user: await server.methods.services.users
          .generateAuthJSONFor(newUser)
      }

      return h.response(response).code(200)
    }
  }
}
