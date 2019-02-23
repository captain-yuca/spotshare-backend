const User = require('../models/User')

// createUser: async function (payload) {
//   let user = await User
//     .query()
//     .insert({ email: payload.user.email, username: payload.user.username })

//   user.setPassword(payload.user.password)
// },

async function findByUsername (username) {
  return User.query().throwIfNotFound().first().where({ username })
}

module.exports = [
  {
    name: 'services.users.findByUsername',
    method: findByUsername
  }
]
