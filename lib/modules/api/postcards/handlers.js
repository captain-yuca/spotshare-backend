module.exports = (server) => {
  return {
    /**
     * GET /api/postcards
     */
    getPostcards: async function (request, h) {
      let user = (await request.auth.credentials)
      let limit = request.query.limit
      let page = request.query.page - 1

      let options = {
        limit,
        page,
        attrs: {}
      }
      let postcards = await server.methods.services.postcards
        .getPostcardsFromUser(user, options)

      let res = {
        postcards: postcards.results,
        count: postcards.total
      }
      return h.response(res).code(200)
    },
    /**
     * GET /api/postcards/{id}
     */
    getPostcard: async function (request, h) {
      let user = (await request.auth.credentials)
      let id = encodeURIComponent(request.params.id)
      let postcard = await server.methods.services.postcards
        .getPostcardById(id, user)

      let res = {
        postcard
      }
      return h.response(res).code(200)
    }
  }
}
