const User = require('../models/User')

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

module.exports = [
  {
    name: 'services.users.findByUsername',
    method: findByUsername
  }
]
