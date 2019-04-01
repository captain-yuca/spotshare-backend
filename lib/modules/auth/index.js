const config = require('../../config')
const Schmervice = require('schmervice')
const Schwifty = require('schwifty')
const AuthRepository = require('./repositories/authRepository')
const AuthObjectionModel = require('./models/Auth')

const register = async (server, options) => {
  await server.register(Schmervice)
  await server.register({
    plugin: Schwifty,
    options: {
      models: [AuthObjectionModel]
    }
  })
  await server.registerService(AuthRepository)
  var { authRepository } = server.services()
  const validate = async (decoded, request) => {
    try {
      console.log(decoded.username)
      let user = await authRepository.findByUsername(decoded.username)
      return {
        isValid: true,
        credentials: user
      }
    } catch (err) {
      // console.log(err.message)
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
  await server.register(require('./api'))
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}

module.exports = plugin
