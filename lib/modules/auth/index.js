const config = require('../../config')
const register = (server, options) => {
  var UserService = server.methods.services.users
  const validate = async (decoded, request) => {
    try {
      let user = UserService.findByUsername(decoded.username)
      return {
        isValid: true,
        credentials: user
      }
    } catch (err) {
      return {
        isValid: false
      }
    }
  }

  server.auth.strategy('jwt', 'jwt', {
    key: config.auth.secret,
    validate: validate,
    verifyOptions: config.auth.verifyOptions
  })
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}

module.exports = plugin
