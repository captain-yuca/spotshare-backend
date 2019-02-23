const User = require('../../lib/modules/models/User')
var crypto = require('crypto')

module.exports = async (factory) => {
  factory.define('user', User, {
    username: factory.seq('User.username', (n) => `user${n}`),
    email: factory.seq('User.email', (n) => `user${n}@example.com`)
  }, {
    afterBuild: async (model, attrs, buildOptions) => {
      this.salt = crypto.randomBytes(16).toString('hex')
      this.hash = crypto.pbkdf2Sync('password', this.salt, 10000, 512, 'sha512').toString('hex')
      return model
    }
  })
}
