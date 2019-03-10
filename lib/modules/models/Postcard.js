const { Model } = require('objection')
const moment = require('moment')
class Postcard extends Model {
  static get tableName () {
    return 'postcards'
  }

  $parseDatabaseJson (json) {
    json = super.$parseDatabaseJson(json)
    json.date = moment(json.date).toISOString()

    return json
  }
}

module.exports = Postcard
