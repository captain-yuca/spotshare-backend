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
          this.where('title', 'like', `%${query}%`).orWhere(function () {
            this.whereExists(Postcard.relatedQuery('tags').where('text', 'like', `%${query}`))
          })
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
  async addTag (tag) {
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
    let tags = []

    // Get all category tags
    let categoryTags = await postcard.$relatedQuery('tags')
      .where({ isPublicTag: false, username: null })

    for (let i = 0; i < categoryTags.length; i++) {
      tags.push({
        text: categoryTags[i].text,
        type: 'category'
      })
    }

    // Get all sharing tags
    let sharingTags = await postcard.$relatedQuery('tags')
      .whereNot({ username: null })
    for (let i = 0; i < sharingTags.length; i++) {
      tags.push({
        text: sharingTags[i].username,
        type: 'sharing'
      })
    }

    // Get a public tag if it exists
    let publicTag = await postcard.$relatedQuery('tags')
      .where({ isPublicTag: true })

    if (publicTag.length === 1) {
      tags.push({ type: 'public' })
    }

    return tags
  }

  async searchSharedPostcardsFromUsername (username, page, limit, attrs, query) {
    const { Postcard } = this.server.models()
    let result
    try {
      result = await Postcard
        .query()
        .select(PostcardRepository.postcardProjection())
        .where('title', 'like', `%${query}%`)
        .andWhere(function () {
          this.whereExists(Postcard.relatedQuery('tags').where({ 'username': username }))
        })
        .page(page, limit)
    } catch (err) {
      console.error(err)
      throw err
    }
    return result
  }

  async getSharedPostcardsFromUsername (username, page, limit, attrs) {
    const { Postcard } = this.server.models()
    let result
    try {
      result = await Postcard
        .query()
        .select(PostcardRepository.postcardProjection())
        .whereExists(Postcard.relatedQuery('tags').where({ username }))
        .page(page, limit)
    } catch (err) {
      console.error(err)
      throw err
    }
    return result
  }

  async deleteTagById (id, attrs) {
    let dbAttrs = {}
    if (attrs.type === 'category') {
      dbAttrs['isPublicTag'] = false
      dbAttrs['text'] = attrs.text
    } else if (attrs.type === 'sharing') {
      dbAttrs['isPublicTag'] = false
      dbAttrs['username'] = attrs.text
    } else if (attrs.type === 'public') {
      dbAttrs['isPublicTag'] = true
    } else {
      throw new Error('No detectable type')
    }
    const { Postcard } = this.server.models()
    let postcard = await Postcard.query().findById(id).throwIfNotFound()
    let result
    try {
      result = await postcard
        .$relatedQuery('tags')
        .delete()
        .where(dbAttrs)
    } catch (err) {
      console.error(err)
      throw err
    }
    if (result === 0) {
      throw new Error('No deletion happened!')
    }
  }

  async update (id, postcard) {
    const { Postcard } = this.server.models()
    let updatedPostcard = await Postcard.query().patchAndFetchById(id, postcard).throwIfNotFound()
    return updatedPostcard
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
