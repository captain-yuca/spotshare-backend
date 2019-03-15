
const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
// const _ = require('lodash')

const PostcardQueryValidations = {
  query: {
    limit: Joi.number().integer().default(20).description('limit result set'),
    offset: Joi.number().integer().default(0).description('number of record to skip')
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  PostcardQueryValidations
}
