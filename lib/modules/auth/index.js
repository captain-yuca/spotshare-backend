const config = require('../../config')
const Schmervice = require('schmervice')
const Schwifty = require('schwifty')
const Routes = require('./api/routes')

const AuthRepository = require('./repositories/authRepository')
const AuthObjectionModel = require('./models/Auth')
const AuthService = require('./services/authService')
const register = async (server, options) => {
  await server.register(Schmervice)
  await server.register({
    plugin: Schwifty,
    options: {
      models: [AuthObjectionModel]
    }
  })
  await server.registerService(AuthService)
  await server.registerService(AuthRepository)
  var { authRepository } = server.services()
  const validate = async (decoded, request) => {
    try {
      let user = await authRepository.findByUsername(decoded.username)
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
  server.route(Routes(server))
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}

module.exports = plugin
