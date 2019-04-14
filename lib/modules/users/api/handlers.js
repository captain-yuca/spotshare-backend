const Boom = require('boom')

module.exports = (server) => {
  return {
    editUser: async function (request, h) {
      let attrs = request.payload.user
      let user = (await request.auth.credentials)
      let updatedUser

      const { userService } = request.services()
      try {
        updatedUser = await userService.editUserInformation(user, attrs)
      } catch (err) {
        console.error(err)
        throw Boom.badImplementation('Something bad happened!')
      }

      let response = {
        user: updatedUser
      }

      return h.response(response).code(200)
    }
  }
}
