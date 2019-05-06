const User = require('../../lib/modules/postcards/models/User')
var faker = require('faker')
var crypto = require('crypto')

module.exports = async (factory) => {
  factory.define('user', User, () => ({
    username: faker.internet.userName(),
    email: faker.internet.email()
    // uid: factory.seq('User.uid', (n) => n)
  }), {
    afterBuild: async (model, attrs, buildOptions) => {
      model.salt = crypto.randomBytes(16).toString('hex')
      model.hash = crypto.pbkdf2Sync('password', model.salt, 10000, 512, 'sha512').toString('hex')
      return model
    }
  })

  factory.define('alberto', User, () => ({
    username: 'alberto',
    email: faker.internet.email()
    // uid: factory.seq('User.uid', (n) => n)
  }), {
    afterBuild: async (model, attrs, buildOptions) => {
      model.salt = crypto.randomBytes(16).toString('hex')
      model.hash = crypto.pbkdf2Sync('alberto', model.salt, 10000, 512, 'sha512').toString('hex')
      return model
    }
  })
}
