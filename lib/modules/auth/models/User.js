const { Model } = require('objection')
const { DbErrors } = require('objection-db-errors')
// var crypto = require('crypto')
// var jwt = require('jsonwebtoken')
// var config = require('../../config')

class User extends DbErrors(Model) {
  static get tableName () {
    return 'users'
  }
  static get idColumn () {
    return 'uid'
  }

  // validPassword (username, password) {
  //   var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  //   return this.hash === hash
  // }

  // setPassword (username, password) {
  //   this.salt = crypto.randomBytes(16).toString('hex')
  //   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  // }

  // generateJWT () {
  //   var today = new Date()
  //   var exp = new Date(today)
  //   exp.setDate(today.getDate() + 60)

  //   return jwt.sign({
  //     id: this._id,
  //     username: this.username,
  //     exp: parseInt(exp.getTime() / 1000)
  //   }, config.auth.secret, { algorithm: config.auth.algorithm })
  // }

  // toAuthJSON () {
  //   return {
  //     username: this.username,
  //     email: this.email,
  //     token: this.generateJWT()
  //   }
  // }
}

module.exports = User
