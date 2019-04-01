const Schmervice = require('schmervice')

class UserRepository extends Schmervice.Service {
  async findByEmail (email) {
    const { User } = this.server.models()
    let result = await User.query().first().where({ email }).throwIfNotFound()
    return result
  }

  async findByUsername (username) {
    const { User } = this.server.models()
    let result = await User.query().first().where({ username }).throwIfNotFound()
    return result
  }

  async save (attrs) {
    const { User } = this.server.models()
    let user = await User.query().insertAndFetch(attrs)
    return user
  }
  async update (user) {
    const { User } = this.server.models()
    await User.query().patch(user).where({ uid: user.uid })
  }
}

module.exports = UserRepository
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
