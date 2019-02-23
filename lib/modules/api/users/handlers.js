module.exports = (server) => {
  return {
    /**
     * POST /api/users/login
     */
    login (request, h) {
      if (request.payload.user.password === 'invalidPassword') {
        return h.response({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid Credentials'
        }).code(401)
      }
      let response = {
        user: {
          username: request.payload.user.username,
          email: 'example@upr.edu',
          token: 'TESTTOKEN'
        }
      }
      // console.log(response)
      return h.response(response).code(200)
    }
  }
}
