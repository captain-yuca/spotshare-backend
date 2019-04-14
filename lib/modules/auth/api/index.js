const Routes = require('./routes')
const Schmervice = require('schmervice')
const AuthRepository = require('../repositories/authRepository')
const AuthService = require('../services/authService')
const register = async (server, options) => {
  await server.register(Schmervice)
  await server.registerService(AuthRepository)
  await server.registerService(AuthService)
  await server.dependency('auth')
  server.route(Routes(server))
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}
module.exports = plugin
