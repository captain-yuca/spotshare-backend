// Update with your config settings.
var pg = require('pg')
pg.defaults.ssl = true

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
      timezone: 'UTC',
      dateStrings: true
    }
  },

  testing: {
    client: 'pg',
    ssl: false,
    connection: {
      host: '127.0.0.1',
      port: '5432',
      user: 'test',
      password: 'test',
      database: 'spotshare',
      ssl: false,
      dateStrings: true
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'pg',
    ssl: true,
    connection: process.env.DATABASEURL || 'postgres://rbjnkmrmvswbsd:234c9f3f87f6ab4e6efe0684dd271ebdb5d139d6ef29727db763868680d12314@ec2-107-21-224-76.compute-1.amazonaws.com:5432/dfvsuusq2gl78d',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

}
