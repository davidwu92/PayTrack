//models/index.js
const { model, Schema } = require('mongoose')

const User = require('./User.js')(model, Schema)
const Event = require('./Event.js')(model, Schema)

module.exports = { User, Event }