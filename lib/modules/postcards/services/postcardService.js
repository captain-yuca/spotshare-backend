const Schmervice = require('schmervice')
const moment = require('moment')
const {
  NotFoundError
} = require('objection')

const {
  DBError
} = require('objection-db-errors')
class PostcardService extends Schmervice.Service {
  async getPostcardsFromUser (user, options) {
    const { postcardRepository } = this.server.services()
    let { page, limit, attrs } = options
    let result = await postcardRepository.getPostcardsFromUserId(user.uid, page, limit, attrs)
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

    return postcard
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
