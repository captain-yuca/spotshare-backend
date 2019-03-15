const Postcards = require('../models/Postcard')

module.exports = {

  findById: async function (id) {
    let result = await Postcards.query().findById(id)
    return result
  },
  getPostcards: async function (attrs) {
    let result = await Postcards.query().where(attrs)
    return result
  },
  getPostcardsWithUser: async function (user) {
    let result = await user
      .$relatedQuery('postcards')
      .select('imgUrl', 'title', 'date', 'id')
      // .where(attrs)
    return result
  },
  getAll: async function () {
    let result = await Postcards.query()
    return result
  }
}
