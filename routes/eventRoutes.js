const {Event, User} = require('../models')
const passport = require('passport')

module.exports = app => {

  //GET ALL YOUR PAYMENTS
  app.get('/events', passport.authenticate('jwt', {session:false}), (req, res) =>{
    const { _id } = req.user
    Event.find({author: _id})
      .populate('author')
      .then(events=>res.json(events))
      .catch(e=>console.error(e))
  })

  //POST ONE new event
  app.post('/event', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const { _id: author } = req.user
    const { title, groupId, amount, isPayment, frequency, website, category, date, groupEndDate, eventNumber, groupTotal, notes } = req.body
    Event.create({ title, groupId, amount, isPayment, frequency, website, category, date, groupEndDate, eventNumber, groupTotal, notes, author })
      .then(event => {
        //When we create a payment, the author needs something pushed into her posts array.
        User.updateOne({_id: author}, {$push: {events: event}})
          .then(()=>res.sendStatus(200))
          .catch(e=> console.error(e))
        res.sendStatus(200)
      })
      .catch(e=>console.error(e))
  })

  //POST GROUP of events
  app.post('/events', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const { _id: author } = req.user
    for (let i=0; i<req.body.length; i++){
      req.body[i].author = author
    }
    Event.insertMany(req.body)
      .then(event => {
        //When we create a payment, the author needs something pushed into her posts array.
        User.updateOne({_id: author}, {$push: {events: event}})
          .then(()=>res.sendStatus(200))
          .catch(e=> console.error(e))
        res.sendStatus(200)
      })
      .catch(e=>console.error(e))
  })

  //EDIT ONE event
  app.put('/event/:id' ,passport.authenticate('jwt', {session: false}), (req, res) => {
    Event.findByIdAndUpdate(req.params.id, { $set: req.body })
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
  
  //EDIT GROUP of events
  app.put('/events/:groupId', (req, res) =>{
    Event.find({groupId: req.params.groupId})
  })
}