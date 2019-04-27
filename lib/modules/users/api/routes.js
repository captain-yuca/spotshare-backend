module.exports = (server) => {
  const inputValidations = require('./validations/input')
  const outputValidations = require('./validations/output')
  // const fetchArticle = require('./routes_prerequisites').fetchArticle(server)
  // const fetchComment = require('./routes_prerequisites').fetchComment(server)
  // const authorizeArticle = require('./routes_prerequisites').authorizeArticle(server)
  // const authorizeComment = require('./routes_prerequisites').authorizeComment(server)
  const handlers = require('./handlers')(server)

  return [
    // PATCH /api/users
    {
      method: 'PATCH',
      path: '/users',
      config: {
        description: 'Edit the current logged in user',
        notes: 'Edit the current logged in user',
        tags: ['api', 'users'],
        response: outputValidations.UserOnPatchOutputValidationConfig,
        validate: inputValidations.UserPatchPayload,
        auth: 'jwt'

      },
      handler: handlers.editUser
    },
    // GET /api/users/activity
    {
      method: 'GET',
      path: '/users/activity',
      config: {
        description: 'Get activity',
        notes: 'Get the users activity',
        tags: ['api', 'users'],
        response: outputValidations.ReportOnGetOutputValidationConfig,
        validate: inputValidations.GetCurrentPayload,
        auth: 'jwt'

      },
      handler: handlers.generateActivityReport
    },
    // GET /api/users/{username}
    {
      method: 'GET',
      path: '/users/{username}',
      config: {
        description: 'Get activity',
        notes: 'Get the users activity',
        tags: ['api', 'users'],
        response: outputValidations.UserOnGetOutputValidationConfig,
        validate: inputValidations.GetUserParamValidations,
        auth: 'jwt'

      },
      handler: handlers.getUser
    }
  ]
}
