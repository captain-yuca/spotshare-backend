const Joi = require('joi')
// const _ = require('lodash')
// const {
//   ErrorsWithAuthOutputValidations,
//   ErrorsOnPostOutputValidations,
//   ErrorsOnGetOutputValidations,
//   ErrorsOnPutOutputValidations,
//   ErrorsOnDeleteOutputValidations
// } = require('../../validations')

// --------------------------------------------------
//    Schema - Output Validations
// --------------------------------------------------

const PostcardJSON = Joi.object().keys({
  id: Joi.number().required().description('The postcard unique identifier'),
  title: Joi.string().required().description('The postcard title'),
  imgUrl: Joi.string().uri().required().description('The postcard image location'),
  date: Joi.date().required().description('The postcard creation date')
})

const SinglePostcardOutputPayload = Joi.object().keys({
  postcard: PostcardJSON
})

const ListPostcardOutputPayload = Joi.object().keys({
  postcards: Joi.array().items(PostcardJSON),
  count: Joi.number().required().description('The number of postcards')
})

// --------------------------------------------------
//    Config - Output Validations
// --------------------------------------------------

const ListPostcardOutputValidationsConfig = {
  status: {
    200: ListPostcardOutputPayload
  }
}
module.exports = {
  ListPostcardOutputValidationsConfig,
  SinglePostcardOutputPayload
}
