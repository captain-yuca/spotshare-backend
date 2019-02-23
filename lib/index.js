'user strict'

// require('dotenv').config({ path: process.cwd() + '/.secret' })

const Glue = require('glue')

const manifest = require('./config/manifest')
const Knex = require('knex')
const knexConfig = require('../knexfile')
const knex = Knex(knexConfig.development)
const { Model } = require('objection')
var options = {
  relativeTo: process.cwd() + '/lib/modules'
}
const startServer = async function () {
  try {
    const server = await Glue.compose(manifest, options)
    Model.knex(knex)
    if (process.env.NODE_ENV === 'test') {
      console.log('In Testing Mode')
      return server
    }
    await server.start()
    console.log('hapi days!')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
module.exports = startServer()

// Glue.compose(manifest, options, (err, server) => {
//   if (err) {
//     throw err
//   }

//   // Step 2.
//   // Show the server to our instance of labbable
//   if (process.env.NODE_ENV === 'test') {
//     // labbable.using(server)
//   }

//   // Step 3.
//   // Initialize your server
//   server.initialize((err) => {
//     if (err) {
//       throw err
//     }

//     // Don't continue to start server if module
//     // is being require()'d (likely in a test)
//     if (process.env.NODE_ENV === 'test') {
//       if (module.parent) {
//         return
//       }
//     }

//     server.start((err) => {
//       if (err) {
//         throw err
//       }

//       console.log('Server started')
//     })
//   })
// })
