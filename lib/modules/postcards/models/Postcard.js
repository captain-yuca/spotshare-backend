const { Model } = require('schwifty')
const User = require('./User')
const moment = require('moment')
class Postcard extends Model {
  static get tableName () {
    return 'postcards'
  }

  static get relationMappings () {
    return { owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'postcards.userId',
        to: 'users.uid'
      }
    }
    }
  }

  $parseDatabaseJson (json) {
    json = super.$parseDatabaseJson(json)
    json.date = moment(json.date).toISOString()

    return json
  }
}

module.exports = Postcard
