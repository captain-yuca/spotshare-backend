const Schmervice = require('schmervice')
const moment = require('moment')
// const _ = require('lodash')

const {
  NotFoundError
} = require('objection')

const {
  DBError
} = require('objection-db-errors')
class PostcardService extends Schmervice.Service {
  async addTagToPostcard (tag, postcardId, user) {
    const { postcardRepository } = this.server.services()
    // Check if postcard exists

    // Check which type of tag it is
    let result
    try {
      if (tag.type === 'category') {
        let categoryTag = {
          text: tag.text,
          isPublicTag: false,
          postcardId: postcardId
        }
        await postcardRepository.addTag(categoryTag)
        result = await postcardRepository.getAllTagsFromId(postcardId)
      } else if (tag.type === 'sharing') {
        let sharingTag = {
          username: tag.text,
          isPublicTag: false,
          postcardId: postcardId
        }
        await postcardRepository.addTag(sharingTag)
        result = await postcardRepository.getAllTagsFromId(postcardId)
      } else if (tag.type === 'public') {
        let publicTag = {
          isPublicTag: true,
          postcardId: postcardId
        }
        await postcardRepository.addTag(publicTag)
        result = await postcardRepository.getAllTagsFromId(postcardId)
      } else {
        const err = { name: 'NotImplementedError', message: 'too lazy to implement' }
        throw err
      }
    } catch (err) {
      throw err
    }
    return result
  }

  async getPostcardsFromUser (user, options) {
    const { postcardRepository } = this.server.services()
    let { page, limit, attrs } = options
    let result = await postcardRepository.getPostcardsFromUserId(user.uid, page, limit, attrs)
    return result
  }

  async searchPostcardsFromUser (user, options, query) {
    const { postcardRepository } = this.server.services()
    let { page, limit, attrs } = options
    let result = await postcardRepository.searchPostcardsFromUserId(user.uid, page, limit, attrs, query)
    return result
  }

  async getPostcardById (postcardId, user, options) {
    const { postcardRepository } = this.server.services()
    let postcard
    try {
      postcard = await postcardRepository.findById(postcardId)
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err
      } else {
        console.error(err)
        throw new DBError('Some error occurred')
      }
    }
    if (postcard.userId !== user.uid) {
      let error = { name: 'AuthorizationError', message: 'User is not authorized to view postcard!' }
      throw error
    }
    return postcard
  }

  async createPostcard (template, spot, user) {
    const { postcardRepository } = this.server.services()

    let postcard = {
      imgUrl: spot.photoUrl,
      style: template.style,
      date: moment().toISOString(),
      title: spot.name + ' - ' + moment().format('MMMM Do YYYY'),
      message: 'Your Message',
      spotId: spot.id,
      userId: user.uid,
      latitude: spot.latitude,
      longitude: spot.longitude
    }

    postcard = await postcardRepository.save(postcard)
    return postcard
  }

  async searchSharedPostcardsToUser (user, options, query) {
    const { postcardRepository } = this.server.services()
    let { page, limit, attrs } = options
    let result = await postcardRepository.searchSharedPostcardsFromUsername(user.username, page, limit, attrs, query)
    return result
  }

  async getSharedPostcardsToUser (user, options) {
    const { postcardRepository } = this.server.services()
    let { page, limit, attrs } = options
    let result = await postcardRepository.getSharedPostcardsFromUsername(user.username, page, limit, attrs)
    return result
  }

  async getPostcardTags (postcardId, user) {
    const { postcardRepository } = this.server.services()
    try {
      await this.getPostcardById(postcardId, user)
    } catch (err) {
      throw err
    }
    let result = await postcardRepository.getAllTagsFromId(postcardId)
    return result
  }

  async removeTagFromPostcard (tagText, tagType, postcardId, user) {
    // TODO: Check if the postcard is from the user
    const { postcardRepository } = this.server.services()
    try {
      await postcardRepository.deleteTagById(postcardId, { text: tagText, type: tagType })
    } catch (err) {
      throw err
    }
    let remainingTags = await postcardRepository.getAllTagsFromId(postcardId)
    return remainingTags
  }

  async editPostcard (postcardId, newProperties) {
    // TODO: Check if the postcard is from the user
    const { postcardRepository } = this.server.services()
    // let newPropertiesWIthId = _.merge({}, newProperties, { id: postcardId })
    let updatedPostcard
    try {
      updatedPostcard = await postcardRepository.update(postcardId, newProperties)
    } catch (err) {
      throw err
    }
    return updatedPostcard
  }
}
module.exports = PostcardService
// module.exports = {
//   name: 'postcardServicePlugin',
//   version: '1.0.0',
//   register: async function (server, options) {
//     await server.register(Schmervice)
//     // await server.dependency('spotRepositoryPlugin')
//     await server.dependency('postcardRepositoryPlugin')
//     // await server.dependency('templateRepositoryPlugin')

//     server.registerService(PostcardService)
//   }
// }
