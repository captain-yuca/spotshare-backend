const Boom = require('boom')
const {
  // ValidationError,
  NotFoundError
} = require('objection')

// const {
//   DBError,
//   ConstraintViolationError,
//   UniqueViolationError,
//   NotNullViolationError,
//   ForeignKeyViolationError,
//   CheckViolationError,
//   DataError
// } = require('objection-db-errors')
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
      let postcard
      try {
        postcard = await postcardService.getPostcardById(id, user)
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw Boom.notFound(err.message)
        } else if (err.name === 'AuthorizationError') {
          throw Boom.unauthorized(err.message)
        } else {
          console.error(err)
          throw Boom.badImplementation('Something bad happened!')
        }
      }
      let res = {
        postcard
      }
      return h.response(res).code(200)
    },
    /**
     * POST /api/postcards
     */
    collectPostcard: async function (request, h) {
      let user = (await request.auth.credentials)
      let payload = request.payload.postcard
      const { postcardService, templateService, spotRepository, postcardRepository } = request.services()
      let spot
      try {
        spot = await spotRepository.findById(payload.spotId)
      } catch (err) {
        throw Boom.forbidden('Spot does not exist')
      }
      let template
      try {
        template = await templateService.getSpotTemplate(spot.id)
      } catch (err) {
        console.error("Didn't find any template!")
        console.error(err)
        throw Boom.badImplementation('Something bad happened!')
      }
      let postcard = await postcardService.createPostcard(template, spot, user)
      try {
        await postcardRepository.save(postcard)
      } catch (err) {
        console.error(err)
        throw Boom.badImplementation('Something bad happened!')
      }
      let res = {
        postcard
      }
      return h.response(res).code(200)
    }
  }
}
