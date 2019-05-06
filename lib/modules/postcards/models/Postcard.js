const { Model } = require('schwifty')
const { DbErrors } = require('objection-db-errors')

const User = require('./User')
const moment = require('moment')
class Postcard extends DbErrors(Model) {
  static get tableName () {
    return 'postcards'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['firstName', 'lastName'],

      properties: {
        id: { type: 'integer' },
        style: { type: 'object' },
        date: { type: 'string' },
        title: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    const Tag = require('./Tag')
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'postcards.userId',
          to: 'users.uid'
        }
      },
      tags: {
        relation: Model.HasManyRelation,
        modelClass: Tag,
        join: {
          from: 'postcards.id',
          to: 'tags.postcardId'
        }
      }
    }
  }

  $parseDatabaseJson (json) {
    json = super.$parseDatabaseJson(json)
    if (json.date) {
      json.date = moment(json.date).toISOString()
    }

    return json
  }
}

module.exports = Postcard
