const Boom = require('boom')
const Schmervice = require('schmervice')

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
      throw Boom.notFound('Postcard does not exist!')
    }
    if (postcard.userId !== user.uid) {
      throw Boom.unauthorized('User is not authorized to access the Postcard!')
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
