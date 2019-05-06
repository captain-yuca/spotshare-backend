async function run () {
  const factory = require('../factories')
  const Knex = require('knex')
  const knexConfig = require('../../knexfile')
  const { Model } = require('objection')

  let knex = Knex(knexConfig.testing)
  Model.knex(knex)
  let user = await factory.create('alberto', { firstName: 'Alberto', lastName: 'De Jesus' })
  await factory.createMany('postcard_without_assoc', 3, { userId: user.uid })
  console.log('seed complete')
  await knex.destroy()
  return true
}

run().then(r => console.log(r))
