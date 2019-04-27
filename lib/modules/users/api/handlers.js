const Boom = require('boom')

module.exports = (server) => {
  return {
    editUser: async function (request, h) {
      let attrs = request.payload.user
      let user = (await request.auth.credentials)
      let updatedUser

      const {
        userService
      } = request.services()
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
    },
    generateActivityReport: async function (request, h) {
      let user = (await request.auth.credentials)
      let activity

      const { userService } = request.services()
      try {
        activity = await userService.getUserActivity(user)
      } catch (err) {
        console.error(err)
        throw Boom.badImplementation('Something bad happened!')
      }

      let response = {
        activity
      }

      return h.response(response).code(200)
    },
    getUser: async function (request, h) {
      let user = (await request.auth.credentials)
      let username = encodeURIComponent(request.params.username)

      let userInformation
      const { userService } = request.services()
      try {
        userInformation = await userService.getUserInformation(user, username)
      } catch (err) {
        console.error(err)
        throw Boom.badImplementation('Something bad happened!')
      }

      let response = {
        user: userInformation
      }

      return h.response(response).code(200)
    }
  }
}
