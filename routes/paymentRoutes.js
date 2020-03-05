const {Payment} = require('../models')
const passport = require('passport')

module.exports = app => {
  
  //GET ALL YOUR PAYMENTS
  app.get('/payments', passport.authenticate('jwt', {session:false}), (req, res) =>{
    Payment.find()
      .populate('author')
      .then(payments=>res.json(payments))
      .catch(e=>console.error(e))
  })

  //POST A NEW PAYMENT
  app.post('/posts', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const { _id: author } = req.user
    const { title, frequency, amount, category, website, startingDate, notes } = req.body
    Payment.create({title, frequency, amount, category, website, startingDate, notes, author})
      .then(payment => {
        //When we create a payment, the author needs something pushed into her posts array.
        User.updateOne({_id: author}, {$push: {posts: post}})
          .then(()=>res.sendStatus(200))
          .cathc(e=> console.error(e))
        res.sendStatus(200)
      })
      .catch(e=>console.error(e))
  })

}