const User = require('../../lib/modules/models/User')
var crypto = require('crypto')

module.exports = async (factory) => {
  factory.define('user', User, {
    username: factory.seq('User.username', (n) => `user${n}`),
    email: factory.seq('User.email', (n) => `user${n}@example.com`),
    uid: factory.seq('User.uid', (n) => n)
  }, {
    afterBuild: async (model, attrs, buildOptions) => {
      model.salt = crypto.randomBytes(16).toString('hex')
      model.hash = crypto.pbkdf2Sync('password', model.salt, 10000, 512, 'sha512').toString('hex')
      return model
    }
  })
}
