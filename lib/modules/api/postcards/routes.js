module.exports = (server) => {
  const inputValidations = require('./validations/input')
  const outputValidations = require('./validations/output')
  // const fetchArticle = require('./routes_prerequisites').fetchArticle(server)
  // const fetchComment = require('./routes_prerequisites').fetchComment(server)
  // const authorizeArticle = require('./routes_prerequisites').authorizeArticle(server)
  // const authorizeComment = require('./routes_prerequisites').authorizeComment(server)
  const handlers = require('./handlers')(server)

  return [
    // GET /api/articles
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
    }
  ]
}
