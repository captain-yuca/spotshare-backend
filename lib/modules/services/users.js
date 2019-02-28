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
/**
 * Checks if an email belongs to a user in the DB
 * @function userExistsFromEmail
 * @param {string} email
 * @return {boolean} True if the user exists
 */
async function userExistsFromEmail (email) {
  let result = await User.query().first().where({ email })
  return result != null
}

/**
 * Checks if a username belongs to a user in the DB
 * @function userExistsFromEmail
 * @param {string} username
 * @return {boolean} True if the user exists
 */
async function userExistsFromUsername (username) {
  let result = await User.query().first().where({ username })
  return result != null
}

/**
 * Creates a user in the DB
 * @function createUser
 * @param {Object} attrs The attributes object that contains the user
 * information to create the user
 * @param {string} attrs.username The username for the new user
 * @param {string} attrs.password The password for the new user
 * @param {string} attrs.email The email for the new user
 * @return {Object} Returns the new user in AuthJSON format
 */
async function createUser (attrs) {
  let user
  let { username, email, password } = attrs
  try {
    user = await User.query().insertAndFetch({ username, email })
    setPassword(user, password)
  } catch (err) {
    console.error(err)
    return null
  }
  return user
}

/**
 * Creates a user in the DB
 * @function setPassword
 * @param {Object} user The attributes object that contains the user
 * information to create the user
 * @param {string} password The new password for the new user
 * @return {Object} Returns the new user in AuthJSON format
 */
async function setPassword (user, password) {
  let salt = crypto.randomBytes(16).toString('hex')
  let hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
  try {
    await User.query().patch({ salt, hash }).where({ username: user.username })
  } catch (err) {
    console.error(err)
    throw err
  }
}

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
  },
  {
    name: 'services.users.createUser',
    method: createUser
  },
  {
    name: 'services.users.userExistsFromEmail',
    method: userExistsFromEmail
  },
  {
    name: 'services.users.userExistsFromUsername',
    method: userExistsFromUsername
  }
]
