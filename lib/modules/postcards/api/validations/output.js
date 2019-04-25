const Joi = require('joi')
const _ = require('lodash')
const {
  ErrorsWithAuthOutputValidations,
  ErrorsOnPostOutputValidations,
  ErrorsOnGetOutputValidations
  // ErrorsOnPutOutputValidations,
  // ErrorsOnDeleteOutputValidations
} = require('../../validations')

// --------------------------------------------------
//    Schema - Output Validations
// --------------------------------------------------

const PostcardJSON = Joi.object().keys({
  id: Joi.number().required().description('The postcard unique identifier'),
  title: Joi.string().required().description('The postcard title'),
  imgUrl: Joi.string().uri().required().description('The postcard image location'),
  date: Joi.date().required().description('The postcard creation date'),
  style: Joi.object().description('The postcard style object'),
  message: Joi.string().description('The postcard message content'),
  spotId: Joi.number().description('The spot that was used to generate the postcard'),
  userId: Joi.number().description('The user that the postcard belongs to'),
  latitude: Joi.number().description('The latitude where the postcard was collected'),
  longitude: Joi.number().description('The longitude where the postcard was collected')

})

const TagJSON = Joi.object().keys({
  type: Joi.string().required().valid('sharing', 'category', 'public'),
  text: Joi.string()
})

const SinglePostcardOutputPayload = Joi.object().keys({
  postcard: PostcardJSON
})

const ListPostcardOutputPayload = Joi.object().keys({
  postcards: Joi.array().items(PostcardJSON),
  count: Joi.number().required().description('The number of postcards')
})

const ListTagOutputPayload = Joi.object().keys({
  tags: Joi.array().items(TagJSON),
  count: Joi.number().required().description('The number of tags')
})

// --------------------------------------------------
//    Config - Output Validations
// --------------------------------------------------

const ListPostcardOutputValidationsConfig = {
  status: {
    200: ListPostcardOutputPayload
  }
}
const ListTagOutputValidationsConfig = {
  status: {
    200: ListTagOutputPayload
  }
}
const SingleGetPostcardOutputValidationsConfig = _.merge({}, ErrorsOnGetOutputValidations, ErrorsWithAuthOutputValidations, {
  status: {
    200: SinglePostcardOutputPayload
  }
})
const SinglePostPostcardOutputValidationsConfig = _.merge({}, ErrorsOnPostOutputValidations, ErrorsWithAuthOutputValidations, {
  status: {
    200: SinglePostcardOutputPayload
  }
})

module.exports = {
  ListPostcardOutputValidationsConfig,
  ListTagOutputValidationsConfig,
  SingleGetPostcardOutputValidationsConfig,
  SinglePostPostcardOutputValidationsConfig
}
