const PostcardRepository = require('../repositories/postcard')

async function getPostcardsFromUser (user) {
  let result = await PostcardRepository.getPostcardsWithUser(user)
  return result
}

module.exports = [{
  name: 'services.postcards.getPostcardsFromUser',
  method: getPostcardsFromUser
}]
