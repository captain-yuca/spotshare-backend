const Joi = require('joi')
const {
  // ErrorsOutputValidations,
  // ErrorsWithAuthOutputValidations,
  // ErrorsOnPutOutputValidations,
  ErrorsOnGetOutputValidations,
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
    birthdate: Joi.date().allow(null),
    hash: Joi.strip(),
    salt: Joi.any().strip(),
    uid: Joi.any().strip()
  })
})

const ReportOutputPayload = Joi.object().keys({
  activity: Joi.object().keys({
    postcardCount: Joi.number().required(),
    postcardCollectionLog: Joi.array().required()
  })
})
// --------------------------------------------------
//    Config - Output Validations
// --------------------------------------------------

const UserOnGetOutputValidationConfig = _.merge({}, ErrorsOnGetOutputValidations, {
  status: {
    200: UserOutputPayload
  }
})

const UserOnPatchOutputValidationConfig = _.merge({}, NotFoundStatus, {
  status: {
    200: UserOutputPayload
  }
})

const ReportOnGetOutputValidationConfig = _.merge({}, ErrorsOnGetOutputValidations, {
  status: {
    200: ReportOutputPayload
  }
})

module.exports = {
  UserOnGetOutputValidationConfig,
  UserOnPatchOutputValidationConfig,
  ReportOnGetOutputValidationConfig
}
