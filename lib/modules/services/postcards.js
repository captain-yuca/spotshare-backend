const PostcardRepository = require('../repositories/postcard')
const Boom = require('boom')
async function getPostcardsFromUser (user, options) {
  let { page, limit, attrs } = options
  let result = await PostcardRepository.getPostcardsWithUser(user, page, limit, attrs)
  return result
}

async function getPostcardById (postcardId, user, options) {
  let postcard = await PostcardRepository.findById(postcardId)
  if (postcard == null) {
    Boom.notFound('Postcard does not exist!')
  }
  if (postcard.userId !== user.uid) {
    Boom.unauthorized('User is not authorized to access the Postcard!')
  }
  return postcard
}

module.exports = [{
  name: 'services.postcards.getPostcardsFromUser',
  method: getPostcardsFromUser
},
{
  name: 'services.postcards.getPostcardById',
  method: getPostcardById
}]
