const Schmervice = require('schmervice')
const {
  NotFoundError
} = require('objection')
class AuthRepository extends Schmervice.Service {
  async findByEmail (email) {
    let result
    if (email === 'notfound@email.com') {
      throw new NotFoundError('Not found!')
    } else {
      result = {
        uid: 1,
        email: email,
        username: 'username',
        hash: 'hash',
        salt: 'salt'
      }
    }
    return result
  }

  async findByUsername (username) {
    let result
    if (username === 'notfound') {
      throw new NotFoundError('Not found!')
    } else {
      result = {
        uid: 1,
        email: 'email@email.com',
        username: username,
        hash: 'hash',
        salt: 'salt'
      }
    }
    return result
  }

  async save (attrs) {
    let user = { attrs }
    return user
  }
  async update (user) {}
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
