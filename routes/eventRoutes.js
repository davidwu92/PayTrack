const {Event, User} = require('../models')
const passport = require('passport')

module.exports = app => {

  //GET ALL YOUR PAYMENTS (READ)
  app.get('/events', passport.authenticate('jwt', {session:false}), (req, res) =>{
    Event.find()
      .populate('author')
      .then(events=>res.json(events))
      .catch(e=>console.error(e))
  })

  //POST A NEW PAYMENT (CREATE)
  app.post('/events', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const { _id: author } = req.user
    const { title, groupId, amount, isPayment, frequency, website, category, date, notes } = req.body
    Event.create({ title, groupId, amount, isPayment, frequency, website, category, date, notes })
      .then(event => {
        //When we create a payment, the author needs something pushed into her posts array.
        User.updateOne({_id: author}, {$push: {events: event}})
          .then(()=>res.sendStatus(200))
          .catch(e=> console.error(e))
        res.sendStatus(200)
      })
      .catch(e=>console.error(e))
  })

  //PUT A PAYMENT (UPDATE)
  app.put('/events/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const _id = req.params.id
    Event.updateOne({ _id }, req.body)
      .then(() => res.sendStatus(200))
      .catch(e => console.error(e))
  })

  //DELETE A PAYMENT (DELETE)
  app.delete('/events/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const _id = req.params.id
    Event.deleteOne({ _id })
      .then(() => res.sendStatus(200))
      .catch(e => console.error(e))
  })
  
}