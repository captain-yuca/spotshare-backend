const Routes = require('./routes')

const register = (server, options) => {
  server.route(Routes(server))
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}
module.exports = plugin
