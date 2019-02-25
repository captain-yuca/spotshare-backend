const User = require('../models/User')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var config = require('../../config')

// createUser: async function (payload) {
//   let user = await User
//     .query()
//     .insert({ email: payload.user.email, username: payload.user.username })

//   user.setPassword(payload.user.password)
// },

async function findByUsername (username) {
  let result = await User.query().throwIfNotFound().first().where({ username })
  return result
}

async function validatePassword (user, password) {
  var hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
  return user.hash === hash
}

async function generateJWT (user) {
  var today = new Date()
  var exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: user.uid,
    username: user.username,
    exp: parseInt(exp.getTime() / 1000)
  }, config.auth.secret, { algorithm: config.auth.algorithm })
}

async function generateAuthJSONFor (user) {
  return {
    username: user.username,
    email: user.email,
    token: await generateJWT(user)
  }
}

module.exports = [
  {
    name: 'services.users.findByUsername',
    method: findByUsername
  },
  {
    name: 'services.users.validatePassword',
    method: validatePassword
  },
  {
    name: 'services.users.generateAuthJSONFor',
    method: generateAuthJSONFor
  }
]
