const Joi = require('joi')
const {
  // ErrorsOutputValidations,
  // ErrorsWithAuthOutputValidations,
  // ErrorsOnPutOutputValidations,
  // ErrorsOnGetOutputValidations,
  // ErrorsOnPostOutputValidations,
  NotFoundStatus
  // UnauthorizedStatus
} = require('../../validations')
const _ = require('lodash')

// --------------------------------------------------
//    Schemas
// --------------------------------------------------

const UserAuthOutputPayload = Joi.object().keys({
  user: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    token: Joi.string().allow(null, ''),
    bio: Joi.string().allow(null, ''),
    image: Joi.string().uri().allow(null, '')
  })
})
// --------------------------------------------------
//    Config - Output Validations
// --------------------------------------------------

const AuthOnLoginOutputValidationConfig = _.merge({}, NotFoundStatus, {
  status: {
    200: UserAuthOutputPayload
  }
})

module.exports = {
  AuthOnLoginOutputValidationConfig
}
