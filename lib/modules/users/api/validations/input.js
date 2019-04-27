const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../../validations')

// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------

const UserPatchPayload = {
  payload: Joi.object().keys({
    user: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      birthdate: Joi.date().description('date in mm-dd-yyyy'),
      bio: Joi.string()
    }).required().description('User object with username and password')
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction,
  headers: HeadersPayLoad
}

const GetUserParamValidations = {
  params: {
    username: Joi.string().required()
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const GetCurrentPayload = {
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  GetCurrentPayload,
  GetUserParamValidations,
  UserPatchPayload

}
