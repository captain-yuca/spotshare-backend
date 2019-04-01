const Schmervice = require('schmervice')

class AuthRepository extends Schmervice.Service {
  async findByUsername (username) {
    const { Auth } = this.server.models()
    let result = await Auth.query().first().where({ username }).throwIfNotFound()
    return result
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
