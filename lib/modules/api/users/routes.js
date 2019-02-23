module.exports = (server) => {
  // const inputValidations = require('./validations/input')
  // const outputValidations = require('./validations/output')
  // const fetchArticle = require('./routes_prerequisites').fetchArticle(server)
  // const fetchComment = require('./routes_prerequisites').fetchComment(server)
  // const authorizeArticle = require('./routes_prerequisites').authorizeArticle(server)
  // const authorizeComment = require('./routes_prerequisites').authorizeComment(server)
  const handlers = require('./handlers')(server)

  return [
    // POST /api/users/login
    {
      method: 'POST',
      path: '/users/login',
      config: {
        description: 'Get user information with auth token',
        notes: 'Return user information with auth token',
        tags: ['api', 'users']
        // response: outputValidations.ListPostcardOutputValidationsConfig
        // validate: inputValidations.ArticlesQueryValidations
      },
      handler: handlers.login
    }
  ]
}
