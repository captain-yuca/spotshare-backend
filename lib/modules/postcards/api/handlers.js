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
      const { postcardService } = request.services()
      let postcards = await postcardService.getPostcardsFromUser(user, options)
      console.log(postcards)

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
      const { postcardService } = request.services()
      let postcard = await postcardService.getPostcardById(id, user)

      let res = {
        postcard
      }
      return h.response(res).code(200)
    }
  }
}
