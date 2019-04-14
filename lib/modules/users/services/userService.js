const Schmervice = require('schmervice')
const _ = require('lodash')
class UserService extends Schmervice.Service {
  async editUserInformation (user, attrs) {
    const { userRepository } = this.server.services()
    let { uid } = user
    let attrsWithUserId = _.merge({}, { uid }, attrs)
    let updatedUser = await userRepository.update(attrsWithUserId)
    delete updatedUser.uid
    return updatedUser
  }
}
module.exports = UserService
