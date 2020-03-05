//models/index.js
const { model, Schema } = require('mongoose')

const User = require('./User.js')(model, Schema)
const Payment = require('./Payment.js')(model, Schema)

module.exports = { User, Payment }