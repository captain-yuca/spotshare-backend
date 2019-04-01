const Routes = require('./routes')
const Schmervice = require('schmervice')
const UserRepository = require('../repositories/userRepository')
const AuthService = require('../services/authService')
const Schwifty = require('schwifty')
const UserObjectionModel = require('../models/User')
const register = async (server, options) => {
  await server.register({
    plugin: Schwifty,
    options: {
      models: [UserObjectionModel]
    }
  })
  await server.register(Schmervice)
  await server.registerService(UserRepository)
  await server.registerService(AuthService)
  await server.dependency('auth')
  server.route(Routes(server))
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}
module.exports = plugin
