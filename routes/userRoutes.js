const { User } = require('../models')
const jwt = require('jsonwebtoken')
const passport = require('passport')

module.exports = app => {
  // Register new user
  app.post('/users', (req, res) => {
      const { username, email } = req.body
      User.register(new User({username, email}), req.body.password,
        e=>{
          if (e){console.error(e)}
          res.sendStatus(200)
        }
      )
  })
  
  // Login route
  app.post('/login', (req, res) => {
    User.authenticate()(req.body.username, req.body.password, (e, user)=>{
      if(e){console.error(e)}
      res.json(user ? {token: jwt.sign({id:user._id}, process.env.SECRET)
      } : user)
    })
  })
  
  // GET MY INFO (when logged in)
  app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log(req.user)
    const { _id } = req.user
    User.findById(_id)
      .then(user => res.json(user))
      .catch(e => console.error(e))
  })
  
    // EDIT MY PROFILE INFO (when logged in)
    // app.put('/users/:id', (req, res) => {
    //   User.findByIdAndUpdate(req.params.id, { $set: req.body })
    //     .then(() => res.sendStatus(200))
    //     .catch(e => console.error(e))
    // })

  // Test route for the GoogleStrategy
  app.get('/auth/google', (req, res) => {
    console.log('Trying to authenticate')
  }
    // passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login']},
    // function( req, res) {
    //   console.log('Hello')
    // })
  )
  // Google Oauth 2.0 callback route
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/mycalendar')
    })
}
