const Joi = require('joi')
const {
  // ErrorsOutputValidations,
  // ErrorsWithAuthOutputValidations,
  // ErrorsOnPutOutputValidations,
  // ErrorsOnGetOutputValidations,
  // ErrorsOnPostOutputValidations,
  NotFoundStatus
  // UnauthorizedStatus
} = require('../../../validations')
const _ = require('lodash')

// --------------------------------------------------
//    Schemas
// --------------------------------------------------

const UserOutputPayload = Joi.object().keys({
  user: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    token: Joi.string().allow(null, ''),
    bio: Joi.string().allow(null, ''),
    image: Joi.string().uri().allow(null, ''),
    firstName: Joi.string().allow(null, ''),
    lastName: Joi.string().allow(null, ''),
    birthdate: Joi.date().allow(null, ''),
    hash: Joi.strip(),
    salt: Joi.strip(),
    uid: Joi.strip()
  })
})
// --------------------------------------------------
//    Config - Output Validations
// --------------------------------------------------

const UserOnPatchOutputValidationConfig = _.merge({}, NotFoundStatus, {
  status: {
    204: UserOutputPayload
  }
})

module.exports = {
  UserOnPatchOutputValidationConfig
}
