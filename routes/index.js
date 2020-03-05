//routes/index.js
module.exports = app => {
  require('./userRoutes.js')(app)
  require('./paymentRoutes.js')(app)
}