const register = async (server, options) => {
  await server.register(require('./api'))
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}

module.exports = plugin
