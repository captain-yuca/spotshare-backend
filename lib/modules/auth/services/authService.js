const Schmervice = require('schmervice')
const {
  NotFoundError
} = require('objection')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var config = require('../../../config')
class AuthService extends Schmervice.Service {
  /**
 * Checks if an email belongs to a user in the DB
 * @ userExistsFromEmail
 * @param {string} email
 * @return {boolean} True if the user exists
 */
  async userExistsFromEmail (email) {
    const { authRepository } = this.server.services()
    try {
      await authRepository.findByEmail(email)
      return true
    } catch (err) {
      return false
    }
  }

  /**
 * Checks if a username belongs to a user in the DB
 * @ userExistsFromEmail
 * @param {string} username
 * @return {boolean} True if the user exists
 */
  async userExistsFromUsername (username) {
    const { authRepository } = this.server.services()
    try {
      await authRepository.findByUsername(username)
      return true
    } catch (err) {
      return false
    }
  }

  /**
 * Creates a user in the DB
 * @ createUser
 * @param {Object} attrs The attributes object that contains the user
 * information to create the user
 * @param {string} attrs.username The username for the new user
 * @param {string} attrs.password The password for the new user
 * @param {string} attrs.email The email for the new user
 * @return {Object} Returns the new user in AuthJSON format
 */
  async createAndSaveUser (attrs) {
    const { authRepository } = this.server.services()
    let user
    let { username, email, password } = attrs
    try {
      user = await authRepository.save({ username, email })
      await this.setPassword(user, password)
    } catch (err) {
      console.error(err)
      throw err
    }
    return user
  }

  /**
 * Creates a user in the DB
 * @ setPassword
 * @param {Object} user The attributes object that contains the user
 * information to create the user
 * @param {string} password The new password for the new user
 * @return {Object} Returns the new user in AuthJSON format
 */
  async setPassword (user, password) {
    const { authRepository } = this.server.services()
    let salt = crypto.randomBytes(16).toString('hex')
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
    user.salt = salt
    user.hash = hash
    try {
      await authRepository.update(user)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async findByUsername (username) {
    const { authRepository } = this.server.services()
    let result
    try {
      result = await authRepository.findByUsername(username)
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err
      } else {
        console.error(err)
        throw err
      }
    }
    return result
  }

  async validatePassword (user, password) {
    var hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
    return user.hash === hash
  }

  async generateJWT (user) {
    var today = new Date()
    var exp = new Date(today)
    exp.setDate(today.getDate() + 60)
    let token = jwt.sign({
      id: user.uid,
      username: user.username,
      exp: parseInt(exp.getTime() / 1000)
    }, config.auth.secret, { algorithm: config.auth.algorithm })
    return token
  }

  async generateAuthJSONFor (user) {
    return {
      username: user.username,
      email: user.email,
      token: await this.generateJWT(user)
    }
  }
}
module.exports = AuthService
// module.exports = {
//   name: 'postcardServicePlugin',
//   version: '1.0.0',
//   register: async  (server, options) {
//     await server.register(Schmervice)
//     // await server.dependency('spotRepositoryPlugin')
//     await server.dependency('postcardRepositoryPlugin')
//     // await server.dependency('templateRepositoryPlugin')

//     server.registerService(PostcardService)
//   }
// }
