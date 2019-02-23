const register = (server, options) => {
  let services = [].concat(
    require('./users')
  )
  server.method(services)
}

const plugin = {
  pkg: require('./package.json'),
  register: register
}

module.exports = plugin
