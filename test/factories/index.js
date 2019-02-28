'use strict'

const factoryGirl = require('factory-girl')
const factory = factoryGirl.factory
const ObjectionAdapter = require('factory-girl-objection-adapter')

const adapter = new ObjectionAdapter()

factory.setAdapter(adapter)

require('./users')(factory)

module.exports = factory
