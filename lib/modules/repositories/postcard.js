const Postcards = require('../models/Postcard')

module.exports = {

  findById: async function (id) {
    let result = await Postcards.query().findById(id).throwIfNotFound()
    return result
  },
  getPostcards: async function (attrs) {
    let result = await Postcards.query().where(attrs)
    return result
  },
  getPostcardsWithUser: async function (user, page, limit, attrs) {
    let result = await user
      .$relatedQuery('postcards')
      .select('imgUrl', 'title', 'date', 'id')
      .where(attrs)
      .page(page, limit)
    return result
  },
  getAll: async function () {
    let result = await Postcards.query()
    return result
  }
}
