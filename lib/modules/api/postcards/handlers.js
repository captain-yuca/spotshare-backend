module.exports = (server) => {
  return {
    /**
     * GET /api/postcards
     */
    getPostcards: async function (request, h) {
      let postcards = await server.methods.services.postcards
        .getPostcardsFromUser({})
      let response = {
        postcards,
        count: 1
      }
      return h.response(response).code(200)
    }
  }
}
