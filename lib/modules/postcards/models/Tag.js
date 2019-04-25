const { Model } = require('schwifty')
const { DbErrors } = require('objection-db-errors')

class Tag extends DbErrors(Model) {
  static get tableName () {
    return 'tags'
  }

  static get relationMappings () {
    const Postcard = require('./Postcard')
    return { postcard: {
      relation: Model.BelongsToOneRelation,
      modelClass: Postcard,
      join: {
        from: 'tags.postcardId',
        to: 'postcards.id'
      }
    }
    }
  }
}

module.exports = Tag
