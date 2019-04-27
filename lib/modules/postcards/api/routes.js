module.exports = (server) => {
  const inputValidations = require('./validations/input')
  const outputValidations = require('./validations/output')
  // const fetchArticle = require('./routes_prerequisites').fetchArticle(server)
  // const fetchComment = require('./routes_prerequisites').fetchComment(server)
  // const authorizeArticle = require('./routes_prerequisites').authorizeArticle(server)
  // const authorizeComment = require('./routes_prerequisites').authorizeComment(server)
  const handlers = require('./handlers')(server)

  return [
    // GET /api/postcards
    {
      method: 'GET',
      path: '/postcards',
      config: {
        description: 'Get a list of postcards',
        notes: 'Return a list of postcards',
        tags: ['api', 'postcards'],
        auth: 'jwt',

        response: outputValidations.ListPostcardOutputValidationsConfig,
        validate: inputValidations.PostcardQueryValidations
      },
      handler: handlers.getPostcards
    },
    {
      method: 'GET',
      path: '/postcards/{id}',
      config: {
        description: 'Get a single postcard',
        notes: 'Return a given postcard',
        tags: ['api', 'postcards'],
        auth: 'jwt',
        response: outputValidations.SingleGetPostcardOutputValidationsConfig,
        validate: inputValidations.SinglePostcardValidations

        // response: outputValidations.SinglePostcardOutputPayload
      },
      handler: handlers.getPostcard
    },
    {
      method: 'POST',
      path: '/postcards',
      config: {
        description: 'Collect a postcard',
        notes: 'Collect a postcard by spot',
        tags: ['api', 'postcards'],
        auth: 'jwt',
        response: outputValidations.SinglePostPostcardOutputValidationsConfig,
        validate: inputValidations.PostcardCollectValidations
      },
      handler: handlers.collectPostcard
    },
    {
      method: 'GET',
      path: '/postcards/{id}/tags',
      config: {
        description: 'Get postcard tags',
        notes: 'Gets all tag related to a postcard',
        tags: ['api', 'postcards'],
        auth: 'jwt',
        response: outputValidations.ListTagOutputValidationsConfig,
        validate: inputValidations.SinglePostcardValidations
      },
      handler: handlers.getPostcardTags
    },
    {
      method: 'POST',
      path: '/postcards/{id}/tags',
      config: {
        description: 'Add a tag',
        notes: 'Add a tag to the given postcard',
        tags: ['api', 'postcards'],
        auth: 'jwt',
        response: outputValidations.ListTagOutputValidationsConfig,
        validate: inputValidations.TagCreationValidations
      },
      handler: handlers.addTag
    },
    {
      method: 'DELETE',
      path: '/postcards/{id}/tags/{text}',
      config: {
        description: 'Remove a tag',
        notes: 'Remove a tag from the given postcard',
        tags: ['api', 'postcards'],
        auth: 'jwt',
        response: outputValidations.ListTagOutputValidationsConfig,
        validate: inputValidations.TagDeletionValidations
      },
      handler: handlers.removeTag
    }
  ]
}
