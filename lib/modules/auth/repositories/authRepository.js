const Schmervice = require('schmervice')

class AuthRepository extends Schmervice.Service {
  async findByEmail (email) {
    const { Auth } = this.server.models()
    let result = await Auth.query().first().where({ email }).throwIfNotFound()
    return result
  }

  async findByUsername (username) {
    const { Auth } = this.server.models()
    let result = await Auth.query().first().where({ username }).throwIfNotFound()
    return result
  }

  async save (attrs) {
    const { Auth } = this.server.models()
    let user = await Auth.query().insertAndFetch(attrs)
    return user
  }
  async update (user) {
    const { Auth } = this.server.models()
    let updatedUser = await Auth.query().patchAndFetchById(user.uid, user)
    return updatedUser
  }
}

module.exports = AuthRepository
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
