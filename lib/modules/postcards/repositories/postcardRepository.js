const Schmervice = require('schmervice')
const _ = require('lodash')

class PostcardRepository extends Schmervice.Service {
  static postcardProjection () { return ['imgUrl', 'title', 'date', 'id'] }

  async findById (id) {
    const { Postcard } = this.server.models()
    let result = await Postcard.query().findById(id).throwIfNotFound()
    return result
  }

  async getPostcards (attrs) {
    const { Postcard } = this.server.models()
    let result = await Postcard.query().where(attrs)
    return result
  }

  async getPostcardsFromUserId (userId, page, limit, attrs) {
    const { Postcard } = this.server.models()
    let result
    try {
      result = await Postcard
        .query()
        .select(PostcardRepository.postcardProjection())
        .where(_.merge({}, { userId }, attrs))
        .page(page, limit)
    } catch (err) {
      console.error(err)
      throw err
    }

    return result
  }

  async getPublicPostcards (page, limit, attrs) {
    const { Postcard } = this.server.models()
    let result
    try {
      result = await Postcard
        .query()
        .select(PostcardRepository.postcardProjection())
        .whereExists(Postcard.relatedQuery('tags').where({ 'isPublicTag': true }))
    } catch (err) {
      console.error(err)
      throw err
    }
    console.log(result)
    return result
  }

  async searchPostcardsFromUserId (userId, page, limit, attrs, query) {
    const { Postcard } = this.server.models()
    let result
    try {
      result = await Postcard
        .query()
        .select(PostcardRepository.postcardProjection())
        .where(_.merge({}, { userId }, attrs))
        .andWhere(function () {
          this.where('title', 'like', `%${query}%`)
        })
        .page(page, limit)
    } catch (err) {
      console.error(err)
      throw err
    }
    return result
  }

  async getAll () {
    const { Postcard } = this.server.models()

    let result = await Postcard.query()
    return result
  }

  async addCategoryTag (tag) {
    const { Tag } = this.server.models()
    let createdTag
    try {
      createdTag = await Tag.query().insert(
        tag
      )
    } catch (err) {
      throw err
    }
    return createdTag
  }

  async getAllTagsFromId (postcardId) {
    const { Postcard } = this.server.models()
    let postcard = await Postcard.query().findById(postcardId).throwIfNotFound()
    let result = await postcard.$relatedQuery('tags')
      .where({ isPublicTag: false, username: null })
    for (let i = 0; i < result.length; i++) {
      result[i] = {
        text: result[i].text,
        type: 'category'
      }
    }
    return result
  }

  async save (postcard) {
    const { Postcard } = this.server.models()
    let createdPostcard
    try {
      createdPostcard = await Postcard.query().insert(
        postcard
      )
    } catch (err) {
      throw err
    }
    return createdPostcard
  }
}

module.exports = PostcardRepository
// module.exports = {
//   name: 'postcardRepositoryPlugin',
//   version: '1.0.0',
//   register: async function (server, options) {
//     await server.register(Schmervice)
//     await server.registerService(PostcardRepository)
//     await server.register({
//       plugin: Schwifty,
//       options: {
//         models: [PostcardObjectionModel]
//       }
//     })
//   }
// }
