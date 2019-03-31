const Schmervice = require('schmervice')
const _ = require('lodash')
class PostcardRepository extends Schmervice.Service {
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
        .select('imgUrl', 'title', 'date', 'id')
        .where(_.merge({}, { userId }, attrs))
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
