module.exports = (server) => {
  return {
    /**
     * GET /api/postcards
     */
    getPostcards: async function (request, h) {
      let user = (await request.auth.credentials)
      let postcards = await server.methods.services.postcards
        .getPostcardsFromUser(user)
      let response = {
        postcards,
        count: postcards.length
      }
      return h.response(response).code(200)
    }
  }
}
