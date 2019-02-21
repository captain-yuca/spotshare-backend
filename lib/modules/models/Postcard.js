const { Model } = require('objection')

class Postcard extends Model {
  static get tableName () {
    return 'postcards'
  }
}

module.exports = Postcard
