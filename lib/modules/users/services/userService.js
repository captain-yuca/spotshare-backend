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
  async getUserActivity (user) {
    const { userRepository } = this.server.services()
    let { uid } = user
    let activity = await userRepository.getUserActivity(uid)
    return activity
  }
  async getUserInformation (user, username) {
    if (user.username === username) {
      return user
    } else {
      let error = { name: 'AuthorizationError', message: 'User does not exist or noty allowed to access!' }
      throw error
    }
  }
}
module.exports = UserService
