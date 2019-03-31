const config = require('./index')
const manifest = {
  server: {
    host: (process.env.PORT) ? '0.0.0.0' : 'localhost',
    port: (process.env.PORT || 3000),
    routes: {
      cors: true
    }
  },

  register: {
    plugins: [
      { plugin: 'blipp' },
      // hapi-auth-jwt2 may be used for authentication
      // { plugin: 'hapi-pagination',
      //   options: config.pagination
      // },
      { plugin: 'hapi-auth-jwt2' },
      { plugin: 'inert' },
      { plugin: 'vision' },

      {
        plugin: 'hapi-swagger',
        options: config.swagger
      },
      // { plugin: 'halacious' },

      {
        plugin: './services'

      },
      {
        plugin: './auth'
      },
      // Postcard
      {
        plugin: './postcards',
        routes: {
          prefix: '/api'
        }
      },
      // },
      // {
      //   plugin: {
      //     register: './models'
      //   }
      // },
      {
        plugin: './api',
        routes: {
          prefix: '/api'
        }
      }

    ]
  }
}

if (process.env.NODE_ENV !== 'test') {
  manifest.register.plugins.push({
    plugin: 'good',
    options: {
      ops: {
        interval: 1000
      },
      reporters: {
        myConsoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*', request: '*', error: '*', user: '*' }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  })
}

module.exports = manifest
