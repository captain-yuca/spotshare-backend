
const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
// const _ = require('lodash')

const PostcardCollectValidations = {
  payload: {
    spot: Joi.object({
      id: Joi.string().required().description('The spot id of where you are going to collect your postcard'),
      location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      }).unknown().required(),
      name: Joi.string().required(),
      picture: Joi.object({
        data: Joi.object({
          url: Joi.string().uri().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const SinglePatchPostcardValidations = {
  payload: {
    postcard: {
      title: Joi.string().description('The postcard title'),
      imgUrl: Joi.string().uri().description('The postcard image location'),
      style: Joi.object().description('The postcard style object'),
      message: Joi.string().description('The postcard message content')
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

const TagDeletionValidations = {
  query: {
    type: Joi.valid('sharing', 'category', 'public').required().description('Type of tag you want to delete')
  },
  params: {
    id: Joi.number().required(),
    text: Joi.string().required()
  },
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const PostcardQueryValidations = {
  query: {
    limit: Joi.number().integer().default(10).description('limit result set'),
    page: Joi.number().integer().default(1).description('number of record to skip'),
    q: Joi.string().default('').description('query search string (search for title or tag text)'),
    visibility: Joi.valid('shared', 'public').description('postcards shared with the logged in user')
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
  TagDeletionValidations,
  SinglePostcardValidations,
  SinglePatchPostcardValidations
}
