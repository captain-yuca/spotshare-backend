const Postcards = require('../models/Postcard')

async function getPostcardsFromUser (user) {
  let result = await Postcards.query()
  return result
}

module.exports = [{
  name: 'services.postcards.getPostcardsFromUser',
  method: getPostcardsFromUser
}]
