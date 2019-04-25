
const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
// const _ = require('lodash')

const PostcardCollectValidations = {
  payload: {
    postcard: {
      spotId: Joi.string().required().description('The spot id of where you are going to collect your postcard')
    }
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}
const TagCreationValidations = {
  payload: {
    tag: {
      type: Joi.string().valid('sharing', 'category', 'public').required().description('Type of tag you want to create'),
      text: Joi.string()
    }
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const PostcardQueryValidations = {
  query: {
    limit: Joi.number().integer().default(10).description('limit result set'),
    page: Joi.number().integer().default(1).description('number of record to skip'),
    q: Joi.string().default('').description('query search string')
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}
const SinglePostcardValidations = {
  params: {
    id: Joi.number().required()
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  PostcardQueryValidations,
  PostcardCollectValidations,
  TagCreationValidations,
  SinglePostcardValidations
}
