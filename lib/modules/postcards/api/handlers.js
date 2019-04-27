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
      let query = request.query.q
      let visibility = request.query.visibility
      let options = {
        limit,
        page,
        attrs: {}
      }
      const { postcardService } = request.services()
      let postcards
      if (visibility === 'shared') {
        if (query !== '') {
          postcards = await postcardService.searchSharedPostcardsToUser(user, options, query)
        } else {
          postcards = await postcardService.getSharedPostcardsToUser(user, options)
        }
      } else {
        if (query !== '') {
          postcards = await postcardService.searchPostcardsFromUser(user, options, query)
        } else {
          postcards = await postcardService.getPostcardsFromUser(user, options)
        }
      }

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
          throw Boom.notFound('Postcard does not exist!')
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
      let payload = request.payload.spot
      // const { postcardService, templateService, spotRepository } = request.services()
      const { postcardService, templateService } = request.services()

      let spot
      try {
        // spot = await spotRepository.findById(payload.spotId)
        spot = {
          id: payload.id,
          name: payload.name,
          photoUrl: payload.picture.data.url,
          latitude: payload.location.latitude,
          longitude: payload.location.longitude
        }
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw Boom.forbidden('Spot does not exist')
        } else {
          console.error(err)
          throw Boom.badImplementation('Something bad happened!')
        }
      }
      let template
      try {
        template = await templateService.getSpotTemplate(spot.id)
      } catch (err) {
        console.error(err)
        throw Boom.badImplementation('Something bad happened!')
      }
      let postcard
      try {
        postcard = await postcardService.createPostcard(template, spot, user)
      } catch (err) {
        console.error(err)
        throw Boom.badImplementation('Something bad happened!')
      }
      let res = {
        postcard
      }
      return h.response(res).code(200)
    },

    getPostcardTags: async function (request, h) {
      let user = (await request.auth.credentials)
      let postcardId = encodeURIComponent(request.params.id)

      const { postcardService } = request.services()
      let tags
      try {
        tags = await postcardService.getPostcardTags(postcardId, user)
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw Boom.notFound('Postcard does not exist!')
        } else if (err.name === 'AuthorizationError') {
          throw Boom.unauthorized(err.message)
        } else {
          console.error(err)
          throw Boom.badImplementation('Something bad happened!')
        }
      }
      let res = {
        tags,
        count: tags.length
      }
      return h.response(res).code(200)
    },
    /**
     * POST /api/postcards/{id}/tags
     */
    addTag: async function (request, h) {
      let user = (await request.auth.credentials)
      let postcardId = encodeURIComponent(request.params.id)

      let payload = request.payload.tag
      const { postcardService } = request.services()
      let tags
      try {
        tags = await postcardService.addTagToPostcard(payload, postcardId, user)
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw Boom.notFound('Postcard does not exist!')
        } else if (err.name === 'AuthorizationError') {
          throw Boom.unauthorized(err.message)
        } else {
          console.error(err)
          throw Boom.badImplementation('Something bad happened!')
        }
      }
      let res = {
        tags,
        count: tags.length
      }
      return h.response(res).code(200)
    }
  }
}
