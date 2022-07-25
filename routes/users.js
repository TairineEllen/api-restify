const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = server => {
  server.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({ email, password });

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, async (error, hash) => {
        user.password = hash;

        try {
          await user.save();
          res.send(201);
          next();
        } catch(error) {
          return next(new errors.InternalError(error.message));
        }
        
      })

    })
  })
}