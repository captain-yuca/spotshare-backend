const Routes = require('./routes')
const Schmervice = require('schmervice')
const Schwifty = require('schwifty')

const PostcardObjectionModel = require('../models/Postcard')
const PostcardService = require('../services/postcardService')
const PostcardRepository = require('../repositories/postcardRepository')

const register = async (server, options) => {
  await server.register({
    plugin: Schwifty,
    options: {
      models: [PostcardObjectionModel]
    }
  })
  await server.register(Schmervice)
  await server.registerService(PostcardRepository)
  await server.registerService(PostcardService)
  await server.route(Routes(server))
  await server.dependency('auth')
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}
module.exports = plugin
